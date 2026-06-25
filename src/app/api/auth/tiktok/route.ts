import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_SITE_URL 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/tiktok/callback`
        : 'http://localhost:3000/api/auth/tiktok/callback';

    if (!CLIENT_KEY) {
        return NextResponse.json({ error: 'Missing TIKTOK_CLIENT_KEY' }, { status: 500 });
    }

    const csrfState = Math.random().toString(36).substring(2);
    
    let url = 'https://www.tiktok.com/v2/auth/authorize/';
    url += `?client_key=${CLIENT_KEY}`;
    url += '&scope=user.info.basic,video.upload,video.publish';
    url += '&response_type=code';
    url += `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    url += `&state=${csrfState}`;

    // You could set the state in a cookie here if you want strict CSRF protection

    return NextResponse.redirect(url);
}
