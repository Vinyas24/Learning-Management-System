'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '@/lib/auth';

export default function RegisterPage() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<'student' | 'instructor'>('student');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const user = await registerUser(name, email, password, selectedRole);
            if (user.role === 'instructor' || user.role === 'admin') {
                router.push('/instructor');
            } else {
                router.push('/profile');
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Registration failed';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const roleCardStyle = (active: boolean, accent: string): React.CSSProperties => ({
        flex: 1,
        padding: '16px',
        borderRadius: '12px',
        border: `2px solid ${active ? accent : '#e5e7eb'}`,
        background: active ? `${accent}10` : 'white',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s',
        outline: 'none',
    });

    return (
        <div className="auth-page">
            <div className="auth-card animate-fade-in">
                <div className="auth-header">
                    <h1>Create your account</h1>
                    <p>Join LearnFlow today</p>
                </div>

                {/* Role Toggle */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
                    <button
                        type="button"
                        style={roleCardStyle(selectedRole === 'student', '#6366f1')}
                        onClick={() => setSelectedRole('student')}
                    >
                        <div style={{ fontSize: '28px', marginBottom: '6px' }}>🎓</div>
                        <div style={{
                            fontSize: '14px', fontWeight: 700,
                            color: selectedRole === 'student' ? '#6366f1' : '#6b7280'
                        }}>
                            I&apos;m a Student
                        </div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                            Learn from courses
                        </div>
                    </button>

                    <button
                        type="button"
                        style={roleCardStyle(selectedRole === 'instructor', '#f97316')}
                        onClick={() => setSelectedRole('instructor')}
                    >
                        <div style={{ fontSize: '28px', marginBottom: '6px' }}>📚</div>
                        <div style={{
                            fontSize: '14px', fontWeight: 700,
                            color: selectedRole === 'instructor' ? '#f97316' : '#6b7280'
                        }}>
                            Become an Instructor
                        </div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                            Create &amp; teach courses
                        </div>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                            autoFocus
                            autoComplete="name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            required
                            minLength={6}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={loading}
                        style={{
                            background: selectedRole === 'instructor'
                                ? 'linear-gradient(135deg, #f97316, #ec4899)'
                                : undefined
                        }}
                    >
                        {loading
                            ? 'Creating account…'
                            : selectedRole === 'instructor'
                                ? '🚀 Create Instructor Account'
                                : 'Create Account'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{' '}
                    <Link href="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
