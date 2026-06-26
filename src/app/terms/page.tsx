import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="header" style={{ marginBottom: '2rem' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <ArrowLeft size={20} /> Back to Dashboard
            </Link>
        </div>
        <div className="glass-panel">
            <h1 style={{ marginBottom: '1.5rem' }}>Terms of Service</h1>
            <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>1. Personal Use Only</h2>
            <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                This application is a personal project created for individual use. It is not intended for commercial distribution. By using this service, you agree to use it exclusively for managing your own TikTok content.
            </p>

            <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>2. Data & Content</h2>
            <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                You retain all rights to the videos and content you schedule through this application. We do not claim ownership over your media. You are solely responsible for ensuring that the content you publish complies with TikTok's community guidelines.
            </p>

            <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>3. Service Availability</h2>
            <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                This is a hobbyist tool. We make no guarantees regarding uptime, reliability, or the successful publishing of every scheduled post. The service is provided "as is" without any warranties.
            </p>
        </div>
    </div>
  );
}
