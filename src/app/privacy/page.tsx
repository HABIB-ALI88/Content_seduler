import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="header" style={{ marginBottom: '2rem' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <ArrowLeft size={20} /> Back to Dashboard
            </Link>
        </div>
        <div className="glass-panel">
            <h1 style={{ marginBottom: '1.5rem' }}>Privacy Policy</h1>
            <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
            <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                Since this is a personal application, we only collect the minimum information required for the app to function. This includes TikTok OAuth tokens (Access Token and Refresh Token) needed to publish videos on your behalf, and the video files you upload for scheduling.
            </p>

            <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
            <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                Your TikTok tokens are used strictly to automate the posting of your scheduled videos to your TikTok account. They are securely stored in our private Supabase database and are never shared with any third-parties.
            </p>

            <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>3. Data Storage & Security</h2>
            <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                Your videos and authentication tokens are hosted privately on Supabase infrastructure. Because this app is for personal use, no other users have access to your database or storage buckets. You have full control to delete your data at any time from your database.
            </p>
        </div>
    </div>
  );
}
