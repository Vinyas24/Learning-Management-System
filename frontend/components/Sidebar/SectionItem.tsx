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
    activeQuizSectionId?: number;
    quiz?: { id: number; passed: boolean } | null;
}

export default function SectionItem({ title, sectionId, videos, subjectId, activeVideoId, activeQuizSectionId, quiz }: SectionItemProps) {
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

                {quiz && (
                    <Link
                        href={`/subjects/${subjectId}/quiz/${sectionId}`}
                        className={`video-nav-item ${activeQuizSectionId === sectionId ? 'active' : ''}`}
                    >
                        <div className="nav-icon">
                            {quiz.passed ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="nav-status-completed" style={{ color: '#22c55e' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="nav-status-pending" style={{ color: '#f97316' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            )}
                        </div>
                        <span className="nav-title" style={{ fontWeight: 800 }}>{title} Quiz</span>
                    </Link>
                )}
            </div>
        </div>
    );
}
