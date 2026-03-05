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
                        // Fallback if progress fails or isn't tracked yet
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
        } catch (err) {
            alert('Could not start course. No videos found.');
        }
    };

    if (loading) {
        return (
            <div className="p-8 animate-pulse max-w-3xl">
                <div className="h-10 bg-[var(--color-border)] rounded w-3/4 mb-6"></div>
                <div className="h-4 bg-[var(--color-surface-hover)] rounded w-full mb-2"></div>
                <div className="h-4 bg-[var(--color-surface-hover)] rounded w-full mb-2"></div>
                <div className="h-4 bg-[var(--color-surface-hover)] rounded w-2/3 mb-10"></div>
                <div className="h-24 bg-[var(--color-surface)] rounded-xl w-full border border-[var(--color-border)]"></div>
            </div>
        );
    }

    if (error || !subject) {
        return (
            <div className="p-8">
                <div className="bg-[var(--color-error-light)] text-[var(--color-error)] p-4 rounded-lg border border-[rgba(239,68,68,0.2)] inline-block">
                    {error || 'Subject not found'}
                </div>
            </div>
        );
    }

    const isStarted = progress && progress.percent_complete > 0;
    const isCompleted = progress && progress.percent_complete === 100;

    return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] animate-fade-in pb-20 pt-24">
            {/* Premium Subject Hero Banner */}
            <div className="relative w-full overflow-hidden bg-[#0a0a0e] border-y border-[var(--color-border)] mb-12">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-[-20%] right-[10%] w-[40%] h-[150%] bg-[var(--color-accent)] blur-[100px] rounded-full mix-blend-screen opacity-50 transform rotate-12"></div>
                </div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>

                <div className="relative z-10 max-w-[1000px] mx-auto px-6 md:px-12 py-16 md:py-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
                        <span className="text-white/80 text-xs font-bold tracking-widest uppercase">Course Overview</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 drop-shadow-md">{subject.title}</h1>
                    <p className="text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed max-w-3xl font-light">
                        {subject.description || 'No description provided for this course.'}
                    </p>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 md:px-12">
                {progress && progress.total_videos > 0 && (
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 md:p-10 mb-8 max-w-3xl shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent opacity-50 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Your Progress</h2>
                                    <p className="text-[var(--color-text-secondary)] font-medium">
                                        <span className="text-[var(--color-text)] font-bold">{progress.completed_videos}</span> of {progress.total_videos} lessons completed
                                    </p>
                                </div>
                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[#a855f7]">
                                    {progress.percent_complete}%
                                </div>
                            </div>

                            <div className="w-full bg-[var(--color-bg)] h-4 rounded-full overflow-hidden border border-[var(--color-border)] shadow-inner mb-10 flex">
                                <div
                                    className="bg-gradient-to-r from-[var(--color-accent)] to-[#a855f7] h-full transition-all duration-1000 ease-out rounded-full relative"
                                    style={{ width: `${progress.percent_complete}%` }}
                                >
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/30 rounded-full"></div>
                                </div>
                            </div>

                            <button
                                onClick={handleStartContinue}
                                className="group/btn relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-text)] text-[var(--color-surface)] hover:bg-[var(--color-text-secondary)] rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl w-full sm:w-auto"
                            >
                                {isCompleted ? 'Review Course' : isStarted ? 'Continue Learning' : 'Start Course'}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-1 transition-transform">
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {(!progress || progress.total_videos === 0) && (
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-12 text-center max-w-3xl shadow-sm">
                        <div className="w-16 h-16 bg-[var(--color-surface-hover)] rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--color-text-muted)]">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                <line x1="16" x2="16" y1="2" y2="6" />
                                <line x1="8" x2="8" y1="2" y2="6" />
                                <line x1="3" x2="21" y1="10" y2="10" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Content Coming Soon</h3>
                        <p className="text-[var(--color-text-secondary)] mb-2">Videos are currently being added to this course.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
