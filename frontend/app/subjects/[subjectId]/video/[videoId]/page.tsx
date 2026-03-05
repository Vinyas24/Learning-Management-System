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
        <div style={{ padding: '24px 24px 48px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Video Player Section */}
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
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
            <div style={{
                background: 'rgba(255,251,245,0.88)',
                backdropFilter: 'blur(14px)',
                borderRadius: '20px',
                border: '1.5px solid rgba(249,115,22,0.1)',
                padding: '28px 32px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}>
                <VideoMeta
                    title={video.title}
                    description={video.description}
                    sectionTitle={video.section?.title || 'Unknown Section'}
                    subjectTitle={video.subject?.title || 'Unknown Subject'}
                />

                {/* Navigation */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginTop: '28px', paddingTop: '24px',
                    borderTop: '1px solid #f3f4f6',
                    gap: '12px',
                }}>
                    <button
                        onClick={() => video.prevVideoId && router.push(`/subjects/${subjectId}/video/${video.prevVideoId}`)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '12px 24px', borderRadius: '99px',
                            background: 'rgba(255,251,245,0.85)', border: '1.5px solid rgba(249,115,22,0.15)',
                            fontSize: '14px', fontWeight: 700, color: '#374151',
                            cursor: video.prevVideoId ? 'pointer' : 'default',
                            opacity: video.prevVideoId ? 1 : 0,
                            pointerEvents: video.prevVideoId ? 'auto' : 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            transition: 'all 0.2s',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        Previous
                    </button>

                    <button
                        onClick={() => video.nextVideoId && router.push(`/subjects/${subjectId}/video/${video.nextVideoId}`)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '14px 32px', borderRadius: '99px',
                            background: 'linear-gradient(135deg, #f97316, #ec4899)',
                            border: 'none',
                            fontSize: '15px', fontWeight: 800, color: 'white',
                            cursor: video.nextVideoId ? 'pointer' : 'default',
                            opacity: video.nextVideoId ? 1 : 0,
                            pointerEvents: video.nextVideoId ? 'auto' : 'none',
                            boxShadow: '0 8px 24px rgba(249,115,22,0.35)',
                            transition: 'all 0.2s',
                        }}
                    >
                        Next Lesson
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
