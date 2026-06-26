'use client';

import Link from 'next/link';
import { Calendar, Video, Clock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
    return (
        <div className="landing-container">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="nav-logo">
                    <Video className="logo-icon" size={24} />
                    <span className="logo-text">Content Scheduler</span>
                </div>
                <div className="nav-links">
                    <Link href="/terms">Terms</Link>
                    <Link href="/privacy">Privacy</Link>
                    <Link href="/dashboard" className="nav-btn">Dashboard</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero">
                <div className="hero-content">
                    <div className="badge">✨ The #1 Tool for Creators</div>
                    <h1 className="hero-title">Automate your TikTok Growth</h1>
                    <p className="hero-subtitle">
                        Schedule your videos, automate your posting, and focus on creating while we handle the distribution. Build your audience on autopilot.
                    </p>
                    <div className="hero-actions">
                        <Link href="/dashboard" className="btn btn-primary btn-large">
                            Start Scheduling <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="glass-card mockup-card">
                        <div className="mockup-header">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                        </div>
                        <div className="mockup-body">
                            <div className="mockup-item">
                                <Calendar size={20} className="mockup-icon text-primary" />
                                <div>
                                    <h4>Summer Vlog #1</h4>
                                    <p>Scheduled for Tomorrow, 10:00 AM</p>
                                </div>
                            </div>
                            <div className="mockup-item">
                                <Video size={20} className="mockup-icon text-success" />
                                <div>
                                    <h4>Trending Sound Dance</h4>
                                    <p>Published Successfully</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="features" id="features">
                <h2 className="section-title">Everything you need to scale</h2>
                <div className="features-grid">
                    <div className="feature-card glass-panel">
                        <div className="feature-icon-wrapper blue">
                            <Clock size={24} />
                        </div>
                        <h3>Set it and forget it</h3>
                        <p>Upload your videos in batches and choose exactly when they go live. Our reliable chron-job engine ensures your content drops exactly on time, every time.</p>
                    </div>

                    <div className="feature-card glass-panel">
                        <div className="feature-icon-wrapper purple">
                            <ShieldCheck size={24} />
                        </div>
                        <h3>Official TikTok API</h3>
                        <p>We use the official TikTok Direct Post API. No sketchy workarounds, no password sharing, and 100% compliance with TikTok's Terms of Service.</p>
                    </div>

                    <div className="feature-card glass-panel">
                        <div className="feature-icon-wrapper green">
                            <Zap size={24} />
                        </div>
                        <h3>Blazing Fast</h3>
                        <p>Built on top of Next.js and Supabase for real-time syncing. Your content uploads instantly and schedules perfectly without any noticeable delay.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <Video size={20} />
                        <span>Content Scheduler</span>
                    </div>
                    <div className="footer-links">
                        <Link href="/terms">Terms of Service</Link>
                        <Link href="/privacy">Privacy Policy</Link>
                        <a href="mailto:support@contentscheduler.com">Contact Support</a>
                    </div>
                </div>
                <p className="copyright">&copy; {new Date().getFullYear()} Content Scheduler. All rights reserved.</p>
            </footer>
        </div>
    );
}
