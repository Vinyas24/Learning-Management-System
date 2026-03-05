'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/apiClient';
import AuthGuard from '@/components/Auth/AuthGuard';

interface Subject {
    id: number;
    title: string;
    slug: string;
    description: string | null;
}

interface SubjectProgress {
    total_videos: number;
    completed_videos: number;
    percent_complete: number;
    last_video_id: number | null;
}

interface EnrolledSubject extends Subject {
    progress: SubjectProgress;
}

export default function ProfilePage() {
    const { user } = useAuthStore();
    const [enrolledSubjects, setEnrolledSubjects] = useState<EnrolledSubject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                // 1. Fetch all subjects
                const subjectsRes = await apiClient<{ data: Subject[] }>('/api/subjects');
                const allSubjects = subjectsRes.data;

                // 2. Fetch progress for all subjects concurrently
                const progressPromises = allSubjects.map(subject =>
                    apiClient<{ data: SubjectProgress }>(`/api/progress/subjects/${subject.id}`)
                        .then(res => ({ subject, progress: res.data }))
                        .catch(() => ({ subject, progress: null }))
                );

                const results = await Promise.all(progressPromises);

                // 3. Filter only subjects where the user has some progress or enrollment
                // Currently, "enrolled" means they watched at least one video (progress > 0)
                // Adjust logic if you have explicit explicit enrollment records
                const activeSubjects = results
                    .filter(r => r.progress && (r.progress.percent_complete > 0 || r.progress.last_video_id !== null))
                    .map(r => ({ ...r.subject, progress: r.progress! }));

                setEnrolledSubjects(activeSubjects);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to load profile data';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfileData();
        }
    }, [user]);

    return (
        <AuthGuard>
            <div className="max-w-[1000px] mx-auto p-6 md:p-8 animate-fade-in">
                <header className="mb-12 border-b border-[var(--color-border)] pb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">My Profile</h1>
                    <p className="text-[var(--color-text-secondary)]">
                        Welcome back, <span className="text-[var(--color-text)] font-semibold">{user?.name}</span>
                    </p>
                    <p className="text-[var(--color-text-muted)] text-sm mt-1">{user?.email}</p>
                </header>

                <section>
                    <h2 className="text-2xl font-bold tracking-tight mb-6">Continue Learning</h2>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                            {[1, 2].map(i => (
                                <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl h-40"></div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="bg-[var(--color-error-light)] text-[var(--color-error)] p-4 rounded-lg border border-[rgba(239,68,68,0.2)]">
                            {error}
                        </div>
                    ) : enrolledSubjects.length === 0 ? (
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 text-center">
                            <p className="text-[var(--color-text-secondary)] mb-4">You haven&apos;t started any courses yet.</p>
                            <Link href="/" className="btn btn-primary inline-flex">
                                Explore Courses
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {enrolledSubjects.map(item => (
                                <Link
                                    key={item.id}
                                    href={item.progress.last_video_id ? `/subjects/${item.id}/video/${item.progress.last_video_id}` : `/subjects/${item.id}`}
                                    className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-accent)] transition-all hover:-translate-y-1 hover:shadow-lg group block"
                                >
                                    <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                                        {item.title}
                                    </h3>

                                    <div className="flex justify-between items-end text-xs text-[var(--color-text-secondary)] mb-2 mt-4">
                                        <span className="font-medium tracking-wide">{item.progress.completed_videos} / {item.progress.total_videos} lessons</span>
                                        <span className="font-bold text-sm text-[var(--color-text)]">{item.progress.percent_complete}%</span>
                                    </div>

                                    <div className="w-full bg-[var(--color-border)] h-2.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-[var(--color-accent)] h-full transition-all duration-500 ease-out rounded-full"
                                            style={{ width: `${item.progress.percent_complete}%` }}
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </AuthGuard>
    );
}
