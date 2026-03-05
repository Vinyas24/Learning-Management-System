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

            <div className="breadcrumbs mb-3 text-sm font-medium tracking-wide" style={{ color: 'var(--color-accent)' }}>
                {subjectTitle} <span className="text-[var(--color-border)] mx-2">/</span> {sectionTitle}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{title}</h1>

            <div className="video-description">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">Lesson Details</h3>
                <p className="text-[var(--color-text)] leading-relaxed whitespace-pre-wrap">
                    {description || 'No additional details provided for this lesson.'}
                </p>
            </div>
        </div>
    );
}
