'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { UploadCloud, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SchedulePost() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!file || !title || !date || !time) {
            setError('Please fill all fields');
            setLoading(false);
            return;
        }

        try {
            // 1. Upload video to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('videos') // Make sure this bucket exists in Supabase and is Public
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: publicUrlData } = supabase.storage
                .from('videos')
                .getPublicUrl(filePath);

            const videoUrl = publicUrlData.publicUrl;

            // 3. Create Date object for scheduled time
            const scheduledAt = new Date(`${date}T${time}`).toISOString();

            // 4. Save to Database
            const { error: dbError } = await supabase
                .from('posts')
                .insert([
                    {
                        title,
                        video_url: videoUrl,
                        scheduled_at: scheduledAt,
                        status: 'pending'
                    }
                ]);

            if (dbError) throw dbError;

            // Success, go back to dashboard
            router.push('/');

        } catch (err: any) {
            console.error('Upload Error:', err);
            setError(err.message || 'An error occurred while scheduling');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="header" style={{ marginBottom: '2rem' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>
            </div>

            <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Schedule a TikTok</h2>
                
                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Video File (MP4)</label>
                        <div style={{ 
                            border: '2px dashed var(--border)', 
                            borderRadius: '8px', 
                            padding: '2rem', 
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: 'rgba(0,0,0,0.2)'
                        }}>
                            <input 
                                type="file" 
                                accept="video/mp4,video/webm" 
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                style={{ display: 'none' }}
                                id="video-upload"
                            />
                            <label htmlFor="video-upload" style={{ cursor: 'pointer', margin: 0 }}>
                                <UploadCloud size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                                {file ? (
                                    <p style={{ color: 'var(--success)' }}>{file.name}</p>
                                ) : (
                                    <p>Click to browse or drag and drop</p>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Caption / Title</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)}
                            placeholder="My awesome video #fyp"
                            required
                        />
                    </div>

                    <div className="grid">
                        <div className="form-group">
                            <label>Schedule Date</label>
                            <input 
                                type="date" 
                                className="form-control" 
                                value={date} 
                                onChange={e => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Schedule Time</label>
                            <input 
                                type="time" 
                                className="form-control" 
                                value={time} 
                                onChange={e => setTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? (
                            <><Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
                        ) : (
                            'Schedule Post'
                        )}
                    </button>
                </form>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}} />
        </div>
    );
}
