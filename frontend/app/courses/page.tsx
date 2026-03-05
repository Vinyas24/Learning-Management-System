'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import SubjectCard from '@/components/Subject/SubjectCard';

interface Subject {
    id: number;
    title: string;
    slug: string;
    description: string | null;
}

interface SubjectsResponse {
    data: Subject[];
    pagination: { total: number };
}

export default function CoursesPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await apiClient<SubjectsResponse>('/api/subjects');
                setSubjects(res.data);
            } catch {
                setError('Failed to load courses. Ensure the backend is running.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: 'transparent', paddingBottom: '80px' }}>

            {/* ── Page Header ── */}
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
                position: 'relative', overflow: 'hidden',
                padding: '48px 48px 52px',
            }}>
                <div style={{ position: 'absolute', top: '-30%', right: '5%', width: '40%', height: '200%', background: '#f97316', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.07, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-30%', left: '-5%', width: '35%', height: '200%', background: '#818cf8', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.09, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '99px', padding: '5px 16px', marginBottom: '20px',
                    }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)' }}>
                            📚 Learning Catalog
                        </span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: 'white', letterSpacing: '-1px', margin: '0 0 12px', lineHeight: 1.1 }}>
                        All Courses
                    </h1>
                    <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', margin: 0, maxWidth: '520px' }}>
                        Choose a structured learning path and start mastering your craft today.
                    </p>
                </div>
            </div>

            {/* ── Course Grid ── */}
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px 0' }}>

                {/* Section title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
                    <div style={{ width: '5px', height: '36px', background: 'linear-gradient(180deg, #f97316, #ec4899)', borderRadius: '99px', flexShrink: 0 }} />
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#111827', margin: 0 }}>
                            {loading ? 'Loading…' : `${subjects.length} Course${subjects.length !== 1 ? 's' : ''} Available`}
                        </h2>
                        <p style={{ fontSize: '14px', color: '#9ca3af', margin: '4px 0 0', fontWeight: 500 }}>
                            Login required to unlock video content
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gap: '28px' }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{ background: 'white', borderRadius: '24px', height: '300px', border: '1px solid #f3f4f6' }} />
                        ))}
                    </div>
                ) : error ? (
                    <div style={{ background: '#fff1f2', color: '#e11d48', padding: '28px 32px', borderRadius: '20px', border: '1px solid #fecdd3' }}>
                        <strong style={{ display: 'block', marginBottom: '6px' }}>Could not load courses</strong>
                        <span style={{ fontSize: '14px', opacity: 0.8 }}>{error}</span>
                    </div>
                ) : subjects.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f3f4f6', padding: '64px 40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚧</div>
                        <p style={{ fontSize: '18px', color: '#6b7280', margin: 0, fontWeight: 600 }}>No courses published yet. Check back soon!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gap: '28px' }}>
                        {subjects.map(subject => (
                            <SubjectCard key={subject.id} {...subject} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
