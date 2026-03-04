'use client';

import Link from 'next/link';

interface VideoRef {
    id: number;
    title: string;
    order_index: number;
    is_completed: boolean;
    locked: boolean;
}

interface SectionItemProps {
    sectionId: number;
    title: string;
    videos: VideoRef[];
    subjectId: number;
    activeVideoId?: number;
}

export default function SectionItem({ title, videos, subjectId, activeVideoId }: SectionItemProps) {
    return (
        <div className="section-item">
            <h4 className="section-title">{title}</h4>
            <div className="section-videos">
                {videos.map((video) => {
                    const isActive = video.id === activeVideoId;
                    const isLocked = video.locked;
                    const isCompleted = video.is_completed;

                    return (
                        <Link
                            key={video.id}
                            href={isLocked ? '#' : `/subjects/${subjectId}/video/${video.id}`}
                            className={`video-nav-item ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                            aria-disabled={isLocked}
                            tabIndex={isLocked ? -1 : 0}
                        >
                            <div className="nav-icon">
                                {isLocked ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                ) : isCompleted ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="nav-status-completed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                ) : isActive ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="nav-status-active" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <circle cx="12" cy="12" r="4" fill="currentColor" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="nav-status-pending" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <polygon points="10 8 16 12 10 16 10 8" />
                                    </svg>
                                )}
                            </div>
                            <span className="nav-title">{video.title}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
