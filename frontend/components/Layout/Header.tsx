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
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid #f3f4f6',
            boxShadow: '0 1px 20px rgba(0,0,0,0.05)',
        }}>
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '0 32px',
                height: '68px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{
                        width: '38px', height: '38px',
                        background: 'linear-gradient(135deg, #f97316, #ec4899)',
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(249,115,22,0.3)',
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '20px', color: '#111827', letterSpacing: '-0.5px' }}>
                        LearnFlow
                    </span>
                </Link>

                {/* Nav */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {isAuthenticated ? (
                        <>
                            <Link href="/profile" style={{
                                padding: '8px 18px', borderRadius: '99px',
                                fontSize: '14px', fontWeight: 600, color: '#6b7280',
                                textDecoration: 'none', transition: 'all 0.2s',
                            }}>
                                {user?.name?.split(' ')[0]}
                            </Link>
                            <button onClick={handleLogout} style={{
                                padding: '8px 20px', borderRadius: '99px',
                                fontSize: '14px', fontWeight: 700, color: '#374151',
                                background: '#f9fafb', border: '1px solid #e5e7eb',
                                cursor: 'pointer',
                            }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" style={{
                                padding: '8px 18px', borderRadius: '99px',
                                fontSize: '14px', fontWeight: 600, color: '#6b7280',
                                textDecoration: 'none',
                            }}>
                                Sign In
                            </Link>
                            <Link href="/register" style={{
                                padding: '10px 24px', borderRadius: '99px',
                                fontSize: '14px', fontWeight: 700, color: 'white',
                                background: 'linear-gradient(135deg, #f97316, #ec4899)',
                                textDecoration: 'none',
                                boxShadow: '0 4px 15px rgba(249,115,22,0.4)',
                            }}>
                                Get Started
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
