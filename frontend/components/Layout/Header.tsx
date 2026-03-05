'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { logoutUser } from '@/lib/auth';

export default function Header() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();

    const handleLogout = async () => {
        await logoutUser();
        router.push('/login');
    };

    return (
        <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 pointer-events-none">
            <div className="max-w-[1200px] mx-auto pointer-events-auto">
                <div className="bg-[var(--color-surface)]/80 backdrop-blur-xl border border-[var(--color-border)]/50 rounded-full px-6 py-3 flex items-center justify-between shadow-lg shadow-black/5">

                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-accent)] to-[#a855f7] rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                            </svg>
                        </div>
                        <span className="font-bold text-lg tracking-tight text-[var(--color-text)]">LearnFlow</span>
                    </Link>

                    <nav className="flex items-center gap-1 md:gap-3">
                        {isAuthenticated ? (
                            <>
                                <Link href="/profile" className="px-4 py-2 rounded-full text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-all">
                                    <span className="hidden md:inline mr-1">Profile:</span> {user?.name?.split(' ')[0]}
                                </Link>
                                <button onClick={handleLogout} className="px-5 py-2 rounded-full text-sm font-bold bg-[var(--color-surface-hover)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all shadow-sm shrink-0">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="px-5 py-2 rounded-full text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-all">
                                    Sign In
                                </Link>
                                <Link href="/register" className="px-6 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-[var(--color-accent)] to-[#a855f7] text-white shadow-md hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-105 transition-all shrink-0">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
