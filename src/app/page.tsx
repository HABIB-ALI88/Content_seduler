'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Calendar, Video, CheckCircle2, Clock, XCircle, Plus } from 'lucide-react';

export default function Dashboard() {
    const [posts, setPosts] = useState<any[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await supabase.from('auth_tokens').select('*').eq('id', 1).single();
            if (data && data.access_token) {
                setIsConnected(true);
            }
        };

        const fetchPosts = async () => {
            const { data } = await supabase.from('posts').select('*').order('scheduled_at', { ascending: true });
            if (data) setPosts(data);
            setLoading(false);
        };

        checkAuth();
        fetchPosts();

        // Listen for realtime updates
        const channel = supabase
            .channel('posts_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchPosts)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'pending': return <Clock size={16} />;
            case 'published': return <CheckCircle2 size={16} />;
            case 'failed': return <XCircle size={16} />;
            default: return null;
        }
    };

    return (
        <div>
            <div className="header">
                <h1>TikTok Scheduler</h1>
                {!isConnected ? (
                    <a href="/api/auth/tiktok" className="btn btn-primary">
                        Connect TikTok
                    </a>
                ) : (
                    <Link href="/schedule" className="btn btn-primary">
                        <Plus size={18} /> New Post
                    </Link>
                )}
            </div>

            <div className="glass-panel" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={20} /> Your Content
                </h2>
                
                {loading ? (
                    <p>Loading posts...</p>
                ) : posts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                        <Video size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                        <p>No posts scheduled yet.</p>
                        {isConnected && (
                            <Link href="/schedule" style={{ color: 'var(--primary)', marginTop: '1rem', display: 'inline-block' }}>
                                Schedule your first video
                            </Link>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {posts.map(post => (
                            <div key={post.id} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '8px',
                                border: '1px solid var(--border)'
                            }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{post.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        {new Date(post.scheduled_at).toLocaleString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span className={`status-badge status-${post.status}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        {getStatusIcon(post.status)} {post.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
