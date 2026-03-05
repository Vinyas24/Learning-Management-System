'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

interface SubjectDetails {
    id: number;
    title: string;
    description: string | null;
}

interface SubjectProgress {
    total_videos: number;
    completed_videos: number;
    percent_complete: number;
    last_video_id: number | null;
}

export default function SubjectPage() {
    const params = useParams();
    const router = useRouter();
    const subjectId = Number(params.subjectId);

    const [subject, setSubject] = useState<SubjectDetails | null>(null);
    const [progress, setProgress] = useState<SubjectProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isNaN(subjectId)) return;

        const fetchSubjectData = async () => {
            try {
                setLoading(true);
                const [subjectRes, progressRes] = await Promise.all([
                    apiClient<{ data: SubjectDetails }>(`/api/subjects/${subjectId}`),
                    apiClient<{ data: SubjectProgress }>(`/api/progress/subjects/${subjectId}`).catch(() => ({
                        data: { total_videos: 0, completed_videos: 0, percent_complete: 0, last_video_id: null }
                    }))
                ]);

                setSubject(subjectRes.data);
                setProgress(progressRes.data);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to load subject';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjectData();
    }, [subjectId]);

    const handleStartContinue = async () => {
        try {
            if (progress?.last_video_id) {
                router.push(`/subjects/${subjectId}/video/${progress.last_video_id}`);
                return;
            }
            const res = await apiClient<{ data: { videoId: number } }>(`/api/subjects/${subjectId}/first-video`);
            router.push(`/subjects/${subjectId}/video/${res.data.videoId}`);
        } catch {
            alert('Could not start course. No videos found.');
        }
    };

    /* ── Loading ── */
    if (loading) {
        return (
            <div style={{ padding: '32px', maxWidth: '800px' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ background: '#f3f4f6', borderRadius: '12px', height: i === 1 ? '48px' : '20px', marginBottom: '16px', width: i === 3 ? '60%' : '100%' }} />
                ))}
            </div>
        );
    }

    /* ── Error ── */
    if (error || !subject) {
        return (
            <div style={{ padding: '32px' }}>
                <div style={{ background: '#fff1f2', color: '#e11d48', padding: '20px 24px', borderRadius: '16px', border: '1px solid #fecdd3', fontSize: '15px', fontWeight: 600 }}>
                    {error || 'Subject not found'}
                </div>
            </div>
        );
    }

    const isStarted = progress && progress.percent_complete > 0;
    const isCompleted = progress && progress.percent_complete === 100;
    const pct = progress?.percent_complete ?? 0;

    const btnLabel = isCompleted ? '🎉 Review Course' : isStarted ? '▶ Continue Learning' : 'Start Course →';

    return (
        <div style={{ minHeight: '100vh', background: 'transparent', paddingBottom: '80px' }}>

            {/* ── Hero Banner ── */}
            <div style={{
                position: 'relative',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
                overflow: 'hidden',
                padding: '48px 48px 52px',
            }}>
                {/* Orbs */}
                <div style={{ position: 'absolute', top: '-30%', right: '5%', width: '45%', height: '200%', background: '#f97316', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.08, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-40%', left: '-5%', width: '40%', height: '200%', background: '#818cf8', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.1, pointerEvents: 'none' }} />
                {/* Dot grid */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px' }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '99px', padding: '5px 16px', marginBottom: '20px',
                    }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                        </svg>
                        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)' }}>Course Overview</span>
                    </div>

                    {/* Title */}
                    <h1 style={{
                        fontSize: 'clamp(28px, 5vw, 52px)',
                        fontWeight: 900,
                        color: 'white',
                        letterSpacing: '-1px',
                        lineHeight: 1.1,
                        margin: '0 0 16px',
                    }}>
                        {subject.title}
                    </h1>

                    {/* Description */}
                    <p style={{
                        fontSize: '17px',
                        color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.7,
                        margin: 0,
                        maxWidth: '680px',
                    }}>
                        {subject.description || 'No description provided for this course.'}
                    </p>
                </div>
            </div>

            {/* ── Content ── */}
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 32px 0' }}>

                {/* Progress Card */}
                {progress && progress.total_videos > 0 ? (
                    <div style={{
                        background: 'rgba(255,251,245,0.85)',
                        backdropFilter: 'blur(12px)',
                        border: '1.5px solid #f3f4f6',
                        borderRadius: '24px',
                        padding: '36px',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* Subtle tinted corner */}
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

                        {/* Header row */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
                            <div>
                                <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.3px' }}>Your Progress</h2>
                                <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
                                    <strong style={{ color: '#111827' }}>{progress.completed_videos}</strong> of <strong style={{ color: '#111827' }}>{progress.total_videos}</strong> lessons completed
                                </p>
                            </div>

                            {/* Big % badge */}
                            <div style={{
                                padding: '10px 20px', borderRadius: '16px',
                                background: pct === 100 ? 'linear-gradient(135deg,#22c55e,#10b981)' : 'linear-gradient(135deg,#f97316,#ec4899)',
                                boxShadow: pct === 100 ? '0 8px 24px rgba(34,197,94,0.3)' : '0 8px 24px rgba(249,115,22,0.3)',
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '28px', fontWeight: 900, color: 'white', lineHeight: 1 }}>{pct}%</div>
                                <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '3px' }}>Complete</div>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div style={{ background: '#f3f4f6', borderRadius: '99px', height: '12px', overflow: 'hidden', marginBottom: '32px' }}>
                            <div style={{
                                height: '100%',
                                borderRadius: '99px',
                                background: pct === 100
                                    ? 'linear-gradient(90deg,#22c55e,#10b981)'
                                    : 'linear-gradient(90deg,#f97316,#ec4899)',
                                width: `${Math.max(pct, 2)}%`,
                                boxShadow: pct === 100 ? '0 0 12px rgba(34,197,94,0.4)' : '0 0 12px rgba(249,115,22,0.4)',
                                transition: 'width 1.2s ease',
                                position: 'relative',
                            }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: 'rgba(255,255,255,0.35)', borderRadius: '99px' }} />
                            </div>
                        </div>

                        {/* Stats row */}
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
                            {[
                                { icon: '✅', label: 'Completed', value: progress.completed_videos },
                                { icon: '📚', label: 'Remaining', value: progress.total_videos - progress.completed_videos },
                                { icon: '🎥', label: 'Total Lessons', value: progress.total_videos },
                            ].map(stat => (
                                <div key={stat.label} style={{
                                    flex: 1, minWidth: '100px',
                                    background: '#f9fafb', border: '1px solid #f3f4f6',
                                    borderRadius: '16px', padding: '16px 20px',
                                    textAlign: 'center',
                                }}>
                                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{stat.icon}</div>
                                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#111827', lineHeight: 1 }}>{stat.value}</div>
                                    <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={handleStartContinue}
                            style={{
                                width: '100%',
                                padding: '18px 32px',
                                borderRadius: '16px',
                                border: 'none',
                                background: pct === 100
                                    ? 'linear-gradient(135deg,#22c55e,#10b981)'
                                    : 'linear-gradient(135deg,#0f172a,#1e293b)',
                                color: 'white',
                                fontSize: '17px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                boxShadow: pct === 100
                                    ? '0 8px 30px rgba(34,197,94,0.35)'
                                    : '0 8px 30px rgba(0,0,0,0.25)',
                                letterSpacing: '-0.2px',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
                        >
                            {btnLabel}
                        </button>
                    </div>
                ) : (
                    /* No videos yet */
                    <div style={{ background: 'rgba(255,251,245,0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(249,115,22,0.1)', borderRadius: '24px', padding: '56px 40px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>Content Coming Soon</h3>
                        <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>Videos are currently being added to this course. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
