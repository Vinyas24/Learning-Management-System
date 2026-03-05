'use client';

import VideoProgressBar from './VideoProgressBar';

interface VideoMetaProps {
    title: string;
    description: string | null;
    sectionTitle: string;
    subjectTitle: string;
}

export default function VideoMeta({ title, description, sectionTitle, subjectTitle }: VideoMetaProps) {
    return (
        <div className="video-meta animate-fade-in">
            <VideoProgressBar />

            <div className="breadcrumbs mt-4 mb-3 text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">
                {subjectTitle} <span className="text-[var(--color-border)] mx-1">/</span> {sectionTitle}
            </div>

            <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-6">{title}</h1>

            <div className="video-description">
                <h3 className="text-[0.7rem] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Lesson Details</h3>
                <p className="text-[var(--color-text-secondary)] text-[0.9rem] leading-relaxed whitespace-pre-wrap">
                    {description || 'No additional details provided for this lesson.'}
                </p>
            </div>
        </div>
    );
}
