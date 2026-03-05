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
        <div style={{ animationName: 'fadeIn', animationDuration: '0.3s' }}>
            <VideoProgressBar />

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{
                    fontSize: '12px', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.08em', color: '#9ca3af',
                }}>
                    {subjectTitle}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                </svg>
                <span style={{
                    fontSize: '12px', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    background: 'linear-gradient(135deg, #f97316, #ec4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    {sectionTitle}
                </span>
            </div>

            {/* Title */}
            <h1 style={{
                fontSize: 'clamp(22px, 3vw, 32px)',
                fontWeight: 900,
                color: '#111827',
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
                margin: '0 0 24px',
            }}>
                {title}
            </h1>

            {/* Lesson details card */}
            {description && (
                <div style={{
                    background: '#f9fafb',
                    border: '1px solid #f3f4f6',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start',
                }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                        background: 'linear-gradient(135deg, #f97316, #ec4899)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(249,115,22,0.25)',
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f97316', marginBottom: '6px' }}>
                            About this Lesson
                        </div>
                        <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                            {description}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
