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
            <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] animate-fade-in pb-20">
                {/* Premium Hero Banner */}
                <div className="relative w-full h-64 md:h-80 overflow-hidden bg-[#0a0a0e] border-b border-[var(--color-border)]">
                    {/* Abstract Gradient Background */}
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-[var(--color-accent)] blur-[120px] rounded-full mix-blend-screen mix-blend-plus-lighter opacity-50 transform rotate-12"></div>
                        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[150%] bg-[#a855f7] blur-[120px] rounded-full mix-blend-screen mix-blend-plus-lighter opacity-40 transform -rotate-12"></div>
                    </div>
                    {/* Grid Overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.1 }}></div>

                    {/* Content Container aligned at bottom left */}
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 md:pb-10 max-w-[1200px] mx-auto flex flex-col md:flex-row items-end gap-6 z-10">
                        <div className="relative">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[var(--color-accent)] to-[#a855f7] rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 border-4 border-[var(--color-surface)] rotate-[-3deg] hover:rotate-0 transition-transform duration-300 ease-out">
                                <span className="text-4xl md:text-6xl font-black text-white mix-blend-overlay opacity-90 tracking-tighter shadow-sm">
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 pb-1 md:pb-2">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 filter drop-shadow-md">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">{user?.name}</span>
                            </h1>
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full mt-1">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
                                <p className="text-white/80 font-mono text-sm tracking-wide">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="max-w-[1200px] mx-auto px-6 md:px-12 mt-12">
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-[var(--color-accent)] rounded-full inline-block"></span>
                                Continue Learning
                            </h2>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
                                {[1, 2].map(i => (
                                    <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl h-48 opacity-60"></div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="bg-[var(--color-error-light)] text-[var(--color-error)] p-6 rounded-2xl border border-[rgba(239,68,68,0.2)] shadow-sm">
                                <div className="font-semibold mb-1">Could not load progress</div>
                                <div className="text-sm opacity-90">{error}</div>
                            </div>
                        ) : enrolledSubjects.length === 0 ? (
                            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-12 text-center shadow-lg shadow-black/5">
                                <div className="w-20 h-20 bg-[var(--color-surface-hover)] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-muted)]">
                                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">No Courses Started</h3>
                                <p className="text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">You haven&apos;t enrolled in or started any learning paths yet. Browse the curriculum to begin.</p>
                                <Link href="/" className="btn bg-[var(--color-text)] text-[var(--color-surface)] hover:bg-[var(--color-text-secondary)] px-8 py-3 rounded-full font-bold shadow-md transition-all hover:scale-105">
                                    Explore Courses
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                                {enrolledSubjects.map(item => (
                                    <Link
                                        key={item.id}
                                        href={item.progress.last_video_id ? `/subjects/${item.id}/video/${item.progress.last_video_id}` : `/subjects/${item.id}`}
                                        className="group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 hover:border-[var(--color-accent)]/50 transition-all hover:-translate-y-1 hover:shadow-2xl overflow-hidden block"
                                    >
                                        {/* Subtle Hover Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-12 h-12 bg-[var(--color-surface-hover)] rounded-xl flex items-center justify-center border border-[var(--color-border)] shadow-inner text-[var(--color-accent)] group-hover:scale-110 transition-transform duration-300">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                                        <path d="M7 7h10" />
                                                        <path d="M7 12h10" />
                                                        <path d="M7 17h10" />
                                                    </svg>
                                                </div>
                                                <div className="bg-[var(--color-bg)] text-[var(--color-text-secondary)] px-3 py-1.5 rounded-full text-xs font-bold tracking-wider font-mono border border-[var(--color-border)] group-hover:bg-[var(--color-accent-light)] group-hover:text-[var(--color-accent)] group-hover:border-[var(--color-accent)]/20 transition-colors">
                                                    {item.progress.percent_complete}% COMPLETED
                                                </div>
                                            </div>

                                            <h3 className="text-xl md:text-2xl font-bold mb-8 group-hover:text-[var(--color-accent)] transition-colors pr-8">
                                                {item.title}
                                            </h3>

                                            <div className="flex justify-between items-end text-sm text-[var(--color-text-secondary)] mb-3">
                                                <span className="font-medium tracking-wide flex items-center gap-2">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="m11 17 2 2a1 1 0 1 0 3-3" />
                                                        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-7.38 7.38a6 6 0 1 0 8.5 8.5l3.22-3.22" />
                                                    </svg>
                                                    {item.progress.completed_videos} / {item.progress.total_videos} Lessons Tracked
                                                </span>
                                            </div>

                                            <div className="w-full bg-[var(--color-bg)] h-3 rounded-full overflow-hidden border border-[var(--color-border)] shadow-inner flex mb-1">
                                                <div
                                                    className="bg-gradient-to-r from-[var(--color-accent)] to-[#a855f7] h-full transition-all duration-[1.5s] ease-out rounded-full relative"
                                                    style={{ width: `${item.progress.percent_complete}%` }}
                                                >
                                                    {/* Shiny inner highlight on progress bar */}
                                                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AuthGuard>
    );
}
