'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/apiClient';
import AuthGuard from '@/components/Auth/AuthGuard';

interface Subject {
    id: number;
    title: string;
    slug: string;
    description: string | null;
}

interface SubjectProgress {
    total_videos: number;
    completed_videos: number;
    percent_complete: number;
    last_video_id: number | null;
}

interface EnrolledSubject extends Subject {
    progress: SubjectProgress;
}

const CARD_COLORS = [
    { from: '#f97316', to: '#ec4899', light: '#fff7ed', glow: 'rgba(249,115,22,0.15)' },
    { from: '#3b82f6', to: '#6366f1', light: '#eff6ff', glow: 'rgba(59,130,246,0.15)' },
    { from: '#a855f7', to: '#ec4899', light: '#fdf4ff', glow: 'rgba(168,85,247,0.15)' },
    { from: '#22c55e', to: '#10b981', light: '#f0fdf4', glow: 'rgba(34,197,94,0.15)' },
];

export default function ProfilePage() {
    const { user } = useAuthStore();
    const [enrolledSubjects, setEnrolledSubjects] = useState<EnrolledSubject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const subjectsRes = await apiClient<{ data: Subject[] }>('/api/subjects');
                const allSubjects = subjectsRes.data;

                const progressPromises = allSubjects.map(subject =>
                    apiClient<{ data: SubjectProgress }>(`/api/progress/subjects/${subject.id}`)
                        .then(res => ({ subject, progress: res.data }))
                        .catch(() => ({ subject, progress: null }))
                );

                const results = await Promise.all(progressPromises);
                const activeSubjects = results
                    .filter(r => r.progress && (r.progress.percent_complete > 0 || r.progress.last_video_id !== null))
                    .map(r => ({ ...r.subject, progress: r.progress! }));

                setEnrolledSubjects(activeSubjects);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to load profile data';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchProfileData();
    }, [user]);

    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
    const totalCompleted = enrolledSubjects.reduce((acc, s) => acc + s.progress.completed_videos, 0);
    const totalVideos = enrolledSubjects.reduce((acc, s) => acc + s.progress.total_videos, 0);

    return (
        <AuthGuard>
            <div style={{ background: 'transparent', minHeight: '100vh', paddingTop: '68px' }}>

                {/* ── Hero Banner ── */}
                <div style={{ position: 'relative', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', overflow: 'hidden' }}>
                    {/* bg orbs */}
                    <div style={{ position: 'absolute', top: '-30%', left: '-10%', width: '60%', height: '200%', background: '#f97316', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.08 }} />
                    <div style={{ position: 'absolute', bottom: '-30%', right: '-10%', width: '50%', height: '200%', background: '#a855f7', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.1 }} />
                    {/* dot grid */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 40px 48px', position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '28px', flexWrap: 'wrap' }}>
                            {/* Avatar */}
                            <div style={{
                                width: '96px', height: '96px', borderRadius: '28px',
                                background: 'linear-gradient(135deg, #f97316, #ec4899)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: '0 20px 60px rgba(249,115,22,0.4)',
                                border: '3px solid rgba(255,255,255,0.15)',
                                fontSize: '36px', fontWeight: 900, color: 'white',
                            }}>
                                {initials}
                            </div>

                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '99px', padding: '4px 14px', marginBottom: '12px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.8)' }} />
                                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Active Learner</span>
                                </div>
                                <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: 'white', margin: '0 0 6px', letterSpacing: '-1px', lineHeight: 1.1 }}>
                                    {user?.name || 'Learner'}
                                </h1>
                                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', margin: 0, fontFamily: 'monospace' }}>{user?.email}</p>
                            </div>

                            {/* Quick stats */}
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                {[
                                    { label: 'Courses', value: enrolledSubjects.length },
                                    { label: 'Lessons Done', value: totalCompleted },
                                    { label: 'Total Lessons', value: totalVideos },
                                ].map(stat => (
                                    <div key={stat.label} style={{
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        padding: '16px 24px',
                                        textAlign: 'center',
                                        backdropFilter: 'blur(10px)',
                                        minWidth: '90px',
                                    }}>
                                        <div style={{ fontSize: '28px', fontWeight: 900, color: 'white', lineHeight: 1 }}>{stat.value}</div>
                                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Content ── */}
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px 80px' }}>

                    {/* Section heading */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ width: '5px', height: '36px', background: 'linear-gradient(180deg, #f97316, #ec4899)', borderRadius: '99px' }} />
                            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>Continue Learning</h2>
                        </div>
                        <Link href="/courses" style={{
                            padding: '10px 24px', borderRadius: '99px', textDecoration: 'none',
                            background: 'rgba(255,251,245,0.82)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(249,115,22,0.12)',
                            fontSize: '14px', fontWeight: 700, color: '#374151',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        }}>
                            Browse All Courses →
                        </Link>
                    </div>

                    {/* States */}
                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))', gap: '24px' }}>
                            {[1, 2].map(i => (
                                <div key={i} style={{ background: 'rgba(255,251,245,0.6)', borderRadius: '24px', height: '220px', border: '1px solid rgba(249,115,22,0.1)', animation: 'pulse 2s infinite' }} />
                            ))}
                        </div>
                    ) : error ? (
                        <div style={{ background: '#fff1f2', color: '#e11d48', padding: '28px 32px', borderRadius: '20px', border: '1px solid #fecdd3' }}>
                            <strong style={{ display: 'block', marginBottom: '6px' }}>Could not load progress</strong>
                            <span style={{ fontSize: '14px', opacity: 0.8 }}>{error}</span>
                        </div>
                    ) : enrolledSubjects.length === 0 ? (
                        <div style={{ background: 'rgba(255,251,245,0.85)', backdropFilter: 'blur(10px)', borderRadius: '28px', border: '1px solid rgba(249,115,22,0.1)', padding: '64px 40px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <div style={{ width: '72px', height: '72px', background: '#f9fafb', borderRadius: '20px', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '10px' }}>No Courses Started Yet</h3>
                            <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                                You haven't started any courses yet. Pick a learning path and begin your journey!
                            </p>
                            <Link href="/" style={{
                                display: 'inline-block', padding: '14px 32px', borderRadius: '99px',
                                background: 'linear-gradient(135deg,#f97316,#ec4899)', color: 'white',
                                fontWeight: 700, fontSize: '16px', textDecoration: 'none',
                                boxShadow: '0 8px 24px rgba(249,115,22,0.35)',
                            }}>
                                Explore Courses →
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))', gap: '24px' }}>
                            {enrolledSubjects.map((item, idx) => {
                                const color = CARD_COLORS[idx % CARD_COLORS.length];
                                const pct = item.progress.percent_complete;
                                const href = item.progress.last_video_id
                                    ? `/subjects/${item.id}/video/${item.progress.last_video_id}`
                                    : `/subjects/${item.id}`;

                                return (
                                    <Link key={item.id} href={href} style={{ textDecoration: 'none', display: 'block' }}>
                                        <div style={{
                                            background: 'rgba(255,251,245,0.82)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1.5px solid #f3f4f6',
                                            borderRadius: '24px',
                                            padding: '28px 28px 24px',
                                            transition: 'all 0.25s ease',
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                            cursor: 'pointer',
                                        }}
                                            onMouseEnter={e => {
                                                const el = e.currentTarget as HTMLDivElement;
                                                el.style.transform = 'translateY(-4px)';
                                                el.style.boxShadow = `0 20px 40px ${color.glow}`;
                                                el.style.borderColor = color.from + '60';
                                            }}
                                            onMouseLeave={e => {
                                                const el = e.currentTarget as HTMLDivElement;
                                                el.style.transform = 'translateY(0)';
                                                el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                                                el.style.borderColor = '#f3f4f6';
                                            }}>
                                            {/* Card header */}
                                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', gap: '12px' }}>
                                                <div style={{
                                                    width: '52px', height: '52px', borderRadius: '16px', flexShrink: 0,
                                                    background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    boxShadow: `0 8px 20px ${color.glow}`,
                                                }}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                                                    </svg>
                                                </div>
                                                <div style={{
                                                    padding: '5px 14px', borderRadius: '99px',
                                                    background: color.light,
                                                    fontSize: '12px', fontWeight: 800, color: color.from,
                                                    letterSpacing: '0.04em',
                                                }}>
                                                    {pct}% Done
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#111827', margin: '0 0 8px', lineHeight: 1.3 }}>
                                                {item.title}
                                            </h3>
                                            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px' }}>
                                                {item.progress.completed_videos} of {item.progress.total_videos} lessons completed
                                            </p>

                                            {/* Progress bar */}
                                            <div style={{ background: '#f3f4f6', borderRadius: '99px', height: '10px', overflow: 'hidden' }}>
                                                <div style={{
                                                    height: '100%', borderRadius: '99px',
                                                    background: `linear-gradient(90deg, ${color.from}, ${color.to})`,
                                                    width: `${pct}%`,
                                                    boxShadow: `0 0 10px ${color.glow}`,
                                                    transition: 'width 1s ease',
                                                }} />
                                            </div>

                                            {/* Resume CTA */}
                                            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                                    {pct === 100 ? '✅ Completed' : '▶ Resume Course'}
                                                </span>
                                                <div style={{
                                                    width: '36px', height: '36px', borderRadius: '50%',
                                                    background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    boxShadow: `0 4px 12px ${color.glow}`,
                                                }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}
