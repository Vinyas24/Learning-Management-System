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
        <div className="p-6 md:p-8 max-w-4xl">
            <header className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight mb-4">{subject.title}</h1>
                <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed whitespace-pre-wrap">
                    {subject.description || 'No description provided.'}
                </p>
            </header>

            {progress && progress.total_videos > 0 && (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 mb-8 max-w-2xl">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h2 className="text-lg font-semibold mb-1">Your Progress</h2>
                            <p className="text-[var(--color-text-secondary)] text-sm">
                                {progress.completed_videos} of {progress.total_videos} lessons completed
                            </p>
                        </div>
                        <div className="text-2xl font-bold text-[var(--color-accent)]">
                            {progress.percent_complete}%
                        </div>
                    </div>

                    <div className="w-full bg-[var(--color-bg)] h-3 rounded-full overflow-hidden mb-6">
                        <div
                            className="bg-[var(--color-accent)] h-full transition-all duration-500 ease-out"
                            style={{ width: `${progress.percent_complete}%` }}
                        />
                    </div>

                    <button
                        onClick={handleStartContinue}
                        className="btn btn-primary"
                    >
                        {isCompleted ? 'Review Course' : isStarted ? 'Continue Learning' : 'Start Course'}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            )}

            {(!progress || progress.total_videos === 0) && (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 text-center max-w-2xl">
                    <p className="text-[var(--color-text-secondary)] mb-4">This course is coming soon. Videos are currently being added.</p>
                </div>
            )}
        </div>
    );
}
