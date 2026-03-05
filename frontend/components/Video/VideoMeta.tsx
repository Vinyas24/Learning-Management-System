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

            <div className="breadcrumbs mb-5 text-[0.75rem] font-bold tracking-[0.15em] uppercase text-[var(--color-text-muted)]">
                {subjectTitle} <span className="text-[var(--color-border)] mx-2">/</span> {sectionTitle}
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-8 leading-snug">{title}</h1>

            <div className="video-description pt-6 border-t border-[var(--color-surface-hover)]">
                <h3 className="text-[0.8rem] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">Lesson Details</h3>
                <p className="text-[var(--color-text-secondary)] text-base leading-loose whitespace-pre-wrap max-w-4xl">
                    {description || 'No additional details provided for this lesson.'}
                </p>
            </div>
        </div>
    );
}
