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
        <header className="header">
            <div className="header-inner">
                <Link href="/" className="header-logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    <span>LearnFlow</span>
                </Link>

                <nav className="header-nav">
                    {isAuthenticated ? (
                        <>
                            <span className="header-user">{user?.name}</span>
                            <button onClick={handleLogout} className="btn btn-ghost">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="btn btn-ghost">
                                Sign In
                            </Link>
                            <Link href="/register" className="btn btn-primary">
                                Get Started
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
