import { NextResponse } from 'next/server';
import axios from 'axios';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // In a real app, verify state matches
    const error = searchParams.get('error');

    if (error || !code) {
        return NextResponse.redirect(new URL('/dashboard?error=auth_failed', request.url));
    }

    const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
    const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_SITE_URL 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/tiktok/callback`
        : 'http://localhost:3000/api/auth/tiktok/callback';

    try {
        const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
            client_key: CLIENT_KEY,
            client_secret: CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI
        }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token, refresh_token, expires_in, open_id } = response.data;

        const supabase = getServiceSupabase();
        
        // Calculate expiry date
        const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

        // Update the single auth record (id = 1)
        const { error: dbError } = await supabase
            .from('auth_tokens')
            .update({
                access_token,
                refresh_token,
                expires_at: expiresAt,
                open_id,
                updated_at: new Date().toISOString()
            })
            .eq('id', 1);

        if (dbError) {
            console.error("Supabase Error:", dbError);
            return NextResponse.redirect(new URL('/dashboard?error=db_error', request.url));
        }

        return NextResponse.redirect(new URL('/dashboard?success=auth_connected', request.url));

    } catch (err: any) {
        console.error("TikTok Token Error:", err?.response?.data || err.message);
        return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', request.url));
    }
}
