'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { sendProgress, flushProgress } from '@/lib/progress';
import { useSidebarStore } from '@/store/sidebarStore';
import VideoPlayer from '@/components/Video/VideoPlayer';
import VideoMeta from '@/components/Video/VideoMeta';

interface VideoDetails {
    id: number;
    title: string;
    description: string | null;
    youtube_url: string;
    locked: boolean;
    section: {
        id: number;
        title: string;
    };
    subject: {
        id: number;
        title: string;
    };
    nextVideoId: number | null;
    prevVideoId: number | null;
}

interface VideoProgressData {
    last_position_seconds: number;
    is_completed: boolean;
}

export default function VideoPage() {
    const params = useParams();
    const router = useRouter();
    const subjectId = Number(params.subjectId);
    const videoId = Number(params.videoId);

    const [video, setVideo] = useState<VideoDetails | null>(null);
    const [initialPosition, setInitialPosition] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { markVideoCompleted } = useSidebarStore();

    useEffect(() => {
        if (isNaN(subjectId) || isNaN(videoId)) return;

        const fetchVideoData = async () => {
            try {
                setLoading(true);
                const [videoRes, progressRes] = await Promise.all([
                    apiClient<{ data: VideoDetails }>(`/api/videos/${videoId}`),
                    apiClient<{ data: VideoProgressData }>(`/api/progress/videos/${videoId}`).catch(() => ({
                        data: { last_position_seconds: 0, is_completed: false }
                    }))
                ]);

                if (videoRes.data.locked) {
                    setError('This lesson is locked. Please complete prior lessons to unlock it.');
                    setLoading(false);
                    return;
                }

                setVideo(videoRes.data);
                setInitialPosition(progressRes.data.last_position_seconds || 0);

            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to load video';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchVideoData();

        // Cleanup logic for debouncer when leaving the page
        return () => {
            flushProgress();
        };
    }, [subjectId, videoId]);

    const handleVideoComplete = async () => {
        // 1. Immediately send completion network call
        sendProgress(videoId, { last_position_seconds: 0, is_completed: true });

        // 2. Optimistically update local sidebar state to show the green checkmark AND unlock the next video
        markVideoCompleted(videoId, video?.nextVideoId);

        // 3. Auto-advance if there is a next video
        if (video?.nextVideoId) {
            router.push(`/subjects/${subjectId}/video/${video.nextVideoId}`);
        }
    };

    if (loading) {
        return (
            <div className="p-6 md:p-8 animate-pulse max-w-5xl mx-auto">
                <div className="aspect-video bg-[var(--color-surface)] rounded-xl mb-8 w-full border border-[var(--color-border)]"></div>
                <div className="h-4 bg-[var(--color-surface-hover)] rounded w-1/4 mb-4"></div>
                <div className="h-8 bg-[var(--color-surface-hover)] rounded w-2/3 mb-6"></div>
                <div className="h-24 bg-[var(--color-surface)] rounded-lg w-full border border-[var(--color-border)]"></div>
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[50vh]">
                <div className="bg-[var(--color-surface)] p-8 rounded-xl border border-[var(--color-border)] text-center max-w-md w-full shadow-lg">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-error-light)] text-[var(--color-error)] flex items-center justify-center mx-auto mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-[var(--color-text)]">Content Locked</h2>
                    <p className="text-[var(--color-text-secondary)] mb-6 text-sm leading-relaxed">
                        {error || 'Video not found or locked.'}
                    </p>
                    <button onClick={() => router.push(`/subjects/${subjectId}`)} className="btn btn-primary w-full">
                        Back to Course Overview
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 md:pb-12 pt-24 max-w-[1200px] mx-auto animate-fade-in">
            {/* Video Player Section */}
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden shadow-sm mb-6">
                <div className="aspect-video w-full bg-black relative">
                    <VideoPlayer
                        videoId={videoId}
                        youtubeUrl={video.youtube_url}
                        initialPosition={initialPosition}
                        onComplete={handleVideoComplete}
                    />
                </div>
            </div>

            {/* Video Details & Pagination Section */}
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 md:p-8 shadow-sm">
                <VideoMeta
                    title={video.title}
                    description={video.description}
                    sectionTitle={video.section?.title || 'Unknown Section'}
                    subjectTitle={video.subject?.title || 'Unknown Subject'}
                />

                <div className="flex justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
                    <button
                        onClick={() => video.prevVideoId && router.push(`/subjects/${subjectId}/video/${video.prevVideoId}`)}
                        className={`btn btn-ghost px-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] ${!video.prevVideoId ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 opacity-70">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        Previous
                    </button>

                    <button
                        onClick={() => video.nextVideoId && router.push(`/subjects/${subjectId}/video/${video.nextVideoId}`)}
                        className={`btn bg-[var(--color-accent-light)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm ${!video.nextVideoId ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                        Next Lesson
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1.5">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
