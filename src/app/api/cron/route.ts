import { NextResponse } from 'next/server';
import axios from 'axios';
import { getServiceSupabase } from '@/lib/supabase';

// Helper to refresh TikTok token
async function refreshTikTokToken(refreshToken: string) {
    const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
    const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
    
    const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
        client_key: CLIENT_KEY,
        client_secret: CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
}

export async function GET(request: Request) {
    // Vercel Cron sends a Bearer token or you can secure this with a secret header
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServiceSupabase();

    // 1. Get TikTok Auth Tokens
    const { data: authRecord, error: authError } = await supabase
        .from('auth_tokens')
        .select('*')
        .eq('id', 1)
        .single();

    if (authError || !authRecord || !authRecord.access_token) {
        return NextResponse.json({ error: 'TikTok not connected' }, { status: 400 });
    }

    let accessToken = authRecord.access_token;

    // Check if token needs refresh (giving 5 mins buffer)
    const expiresAt = new Date(authRecord.expires_at).getTime();
    if (Date.now() > expiresAt - 5 * 60 * 1000) {
        try {
            const refreshData = await refreshTikTokToken(authRecord.refresh_token);
            accessToken = refreshData.access_token;
            
            const newExpiresAt = new Date(Date.now() + refreshData.expires_in * 1000).toISOString();
            await supabase.from('auth_tokens').update({
                access_token: accessToken,
                refresh_token: refreshData.refresh_token,
                expires_at: newExpiresAt,
                updated_at: new Date().toISOString()
            }).eq('id', 1);

        } catch (err: any) {
            console.error('Failed to refresh TikTok token', err?.response?.data || err.message);
            return NextResponse.json({ error: 'Token refresh failed' }, { status: 500 });
        }
    }

    // 2. Fetch pending posts
    const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_at', new Date().toISOString());

    if (postsError) {
        console.error("Error fetching posts", postsError);
        return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    if (!posts || posts.length === 0) {
        return NextResponse.json({ message: 'No posts to publish' });
    }

    const results = [];

    // 3. Publish each post
    for (const post of posts) {
        try {
            // Using PULL_FROM_URL so TikTok downloads it directly from Supabase Storage
            const initResponse = await axios.post('https://open.tiktokapis.com/v2/post/publish/video/init/', {
                post_info: {
                    title: post.title,
                    privacy_level: "PUBLIC_TO_EVERYONE",
                    disable_comment: false,
                    disable_duet: false,
                    disable_stitch: false
                },
                source_info: {
                    source: "PULL_FROM_URL",
                    video_url: post.video_url
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            });

            const data = initResponse.data;
            if (data.error && data.error.code !== "ok") {
                throw new Error(JSON.stringify(data.error));
            }

            const publishId = data.data.publish_id;

            // Mark as published
            await supabase.from('posts').update({
                status: 'published',
                tiktok_publish_id: publishId
            }).eq('id', post.id);

            results.push({ id: post.id, status: 'success', publishId });

        } catch (err: any) {
            console.error(`Failed to publish post ${post.id}`, err?.response?.data || err.message);
            
            // Mark as failed
            await supabase.from('posts').update({
                status: 'failed'
            }).eq('id', post.id);

            results.push({ id: post.id, status: 'failed', error: err?.response?.data || err.message });
        }
    }

    return NextResponse.json({ message: 'Cron finished', results });
}
