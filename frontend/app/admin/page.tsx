'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/apiClient';
import AuthGuard from '@/components/Auth/AuthGuard';
import Link from 'next/link';

interface PlatformStats {
    totalUsers: number;
    totalStudents: number;
    totalInstructors: number;
    totalCourses: number;
    totalVideos: number;
    totalCertificates: number;
}

interface UserRow {
    id: number;
    name: string;
    email: string;
    role: string;
    xp: number;
    current_streak: number;
    created_at: string;
}

interface InstructorRow {
    id: number;
    name: string;
    email: string;
    totalCourses: number;
    totalStudents: number;
    created_at: string;
}

interface CourseRow {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    instructor_name: string | null;
    instructor_email: string | null;
    enrolledStudents: number;
    created_at: string;
}

type Tab = 'overview' | 'instructors' | 'users' | 'courses';

const StatCard = ({ label, value, emoji, color }: { label: string; value: number; emoji: string; color: string }) => (
    <div style={{
        background: 'white', borderRadius: '20px', padding: '28px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #f3f4f6',
        position: 'relative', overflow: 'hidden'
    }}>
        <div style={{ color: '#6b7280', fontSize: '13px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: '44px', fontWeight: 800, color, letterSpacing: '-2px' }}>{value.toLocaleString()}</div>
        <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', fontSize: '80px', opacity: 0.05 }}>{emoji}</div>
    </div>
);

const Badge = ({ published }: { published: boolean }) => (
    <span style={{
        padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700,
        background: published ? '#ecfdf5' : '#fff7ed',
        color: published ? '#059669' : '#f97316'
    }}>
        {published ? 'Published' : 'Draft'}
    </span>
);

const RoleBadge = ({ role }: { role: string }) => {
    const colors: Record<string, { bg: string; text: string }> = {
        admin: { bg: '#fef2f2', text: '#dc2626' },
        instructor: { bg: '#fff7ed', text: '#f97316' },
        student: { bg: '#eff6ff', text: '#3b82f6' },
    };
    const c = colors[role] || colors.student;
    return (
        <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, background: c.bg, color: c.text }}>
            {role}
        </span>
    );
};

export default function AdminDashboard() {
    const { user } = useAuthStore();
    const [tab, setTab] = useState<Tab>('overview');
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [users, setUsers] = useState<UserRow[]>([]);
    const [instructors, setInstructors] = useState<InstructorRow[]>([]);
    const [courses, setCourses] = useState<CourseRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [statsRes, usersRes, instructorsRes, coursesRes] = await Promise.all([
                    apiClient<{ data: PlatformStats }>('/api/admin/stats'),
                    apiClient<{ data: UserRow[] }>('/api/admin/users'),
                    apiClient<{ data: InstructorRow[] }>('/api/admin/instructors'),
                    apiClient<{ data: CourseRow[] }>('/api/admin/courses'),
                ]);
                setStats(statsRes.data);
                setUsers(usersRes.data);
                setInstructors(instructorsRes.data);
                setCourses(coursesRes.data);
            } catch (e) {
                console.error('Admin fetch error:', e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const tabStyle = (active: boolean): React.CSSProperties => ({
        padding: '10px 20px', borderRadius: '10px', fontWeight: 600, fontSize: '14px',
        cursor: 'pointer', border: 'none',
        background: active ? '#111827' : 'transparent',
        color: active ? 'white' : '#6b7280',
        transition: 'all 0.2s',
    });

    const thStyle: React.CSSProperties = {
        padding: '12px 16px', textAlign: 'left', fontSize: '12px',
        fontWeight: 700, color: '#6b7280', textTransform: 'uppercase',
        letterSpacing: '0.05em', borderBottom: '1px solid #f3f4f6'
    };

    const tdStyle: React.CSSProperties = {
        padding: '14px 16px', fontSize: '14px', color: '#374151',
        borderBottom: '1px solid #f9fafb'
    };

    return (
        <AuthGuard allowedRoles={['admin']}>
            <div style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '100px', paddingBottom: '60px' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>

                    {/* Header */}
                    <div style={{ marginBottom: '36px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '28px' }}>🛡️</span>
                            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', letterSpacing: '-1px', margin: 0 }}>
                                Admin Panel
                            </h1>
                        </div>
                        <p style={{ color: '#6b7280', fontSize: '15px', marginLeft: '40px' }}>
                            Platform overview — Welcome, {user?.name}
                        </p>
                    </div>

                    {/* Tab Bar */}
                    <div style={{ display: 'flex', gap: '8px', background: '#f3f4f6', padding: '6px', borderRadius: '14px', marginBottom: '32px', width: 'fit-content' }}>
                        {(['overview', 'instructors', 'users', 'courses'] as Tab[]).map(t => (
                            <button key={t} style={tabStyle(tab === t)} onClick={() => setTab(t)}>
                                {t === 'overview' ? '📊 Overview' : t === 'instructors' ? '👨‍🏫 Instructors' : t === 'users' ? '👥 All Users' : '📚 Courses'}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af', fontSize: '16px' }}>Loading platform data…</div>
                    ) : (
                        <>
                            {/* OVERVIEW TAB */}
                            {tab === 'overview' && stats && (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                                        <StatCard label="Total Users" value={stats.totalUsers} emoji="👤" color="#111827" />
                                        <StatCard label="Students" value={stats.totalStudents} emoji="🎓" color="#6366f1" />
                                        <StatCard label="Instructors" value={stats.totalInstructors} emoji="📚" color="#f97316" />
                                        <StatCard label="Courses" value={stats.totalCourses} emoji="🏫" color="#10b981" />
                                        <StatCard label="Videos" value={stats.totalVideos} emoji="▶️" color="#3b82f6" />
                                        <StatCard label="Certificates Issued" value={stats.totalCertificates} emoji="🏆" color="#ec4899" />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f3f4f6' }}>
                                            <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#111827', marginBottom: '16px' }}>Quick Navigation</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {[
                                                    { label: '👨‍🏫 Manage Instructors', tab: 'instructors' as Tab },
                                                    { label: '👥 Manage Users', tab: 'users' as Tab },
                                                    { label: '📚 Manage Courses', tab: 'courses' as Tab },
                                                ].map(item => (
                                                    <button key={item.tab} onClick={() => setTab(item.tab)} style={{
                                                        padding: '12px 16px', borderRadius: '10px', background: '#f9fafb',
                                                        border: '1px solid #e5e7eb', textAlign: 'left', cursor: 'pointer',
                                                        fontSize: '14px', fontWeight: 600, color: '#374151'
                                                    }}>
                                                        {item.label} →
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f3f4f6' }}>
                                            <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#111827', marginBottom: '16px' }}>Platform Health</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {[
                                                    { label: 'Published Courses', value: courses.filter(c => c.is_published).length, total: stats.totalCourses },
                                                    { label: 'Active Instructors', value: instructors.filter(i => i.totalCourses > 0).length, total: stats.totalInstructors },
                                                ].map(item => (
                                                    <div key={item.label}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>
                                                            <span>{item.label}</span>
                                                            <span>{item.value} / {item.total}</span>
                                                        </div>
                                                        <div style={{ height: '8px', borderRadius: '4px', background: '#f3f4f6' }}>
                                                            <div style={{ height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg, #6366f1, #ec4899)', width: item.total > 0 ? `${Math.round((item.value / item.total) * 100)}%` : '0%', transition: 'width 0.5s' }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* INSTRUCTORS TAB */}
                            {tab === 'instructors' && (
                                <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>All Instructors ({instructors.length})</h2>
                                    </div>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead style={{ background: '#f9fafb' }}>
                                            <tr>
                                                <th style={thStyle}>Name</th>
                                                <th style={thStyle}>Email</th>
                                                <th style={thStyle}>Courses</th>
                                                <th style={thStyle}>Students</th>
                                                <th style={thStyle}>Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {instructors.map(inst => (
                                                <tr key={inst.id} style={{ transition: 'background 0.15s' }}
                                                    onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                                                    onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
                                                    <td style={{ ...tdStyle, fontWeight: 600 }}>{inst.name}</td>
                                                    <td style={{ ...tdStyle, color: '#6b7280' }}>{inst.email}</td>
                                                    <td style={tdStyle}><span style={{ fontWeight: 700, color: '#f97316' }}>{inst.totalCourses}</span></td>
                                                    <td style={tdStyle}><span style={{ fontWeight: 700, color: '#6366f1' }}>{inst.totalStudents}</span></td>
                                                    <td style={{ ...tdStyle, color: '#9ca3af' }}>{new Date(inst.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                            {instructors.length === 0 && (
                                                <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>No instructors yet</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* USERS TAB */}
                            {tab === 'users' && (
                                <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>All Users ({users.length})</h2>
                                    </div>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead style={{ background: '#f9fafb' }}>
                                            <tr>
                                                <th style={thStyle}>Name</th>
                                                <th style={thStyle}>Email</th>
                                                <th style={thStyle}>Role</th>
                                                <th style={thStyle}>XP</th>
                                                <th style={thStyle}>Streak</th>
                                                <th style={thStyle}>Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(u => (
                                                <tr key={u.id}
                                                    onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                                                    onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
                                                    <td style={{ ...tdStyle, fontWeight: 600 }}>{u.name}</td>
                                                    <td style={{ ...tdStyle, color: '#6b7280' }}>{u.email}</td>
                                                    <td style={tdStyle}><RoleBadge role={u.role} /></td>
                                                    <td style={tdStyle}><span style={{ fontWeight: 700 }}>{u.xp} XP</span></td>
                                                    <td style={tdStyle}>{u.current_streak > 0 ? `🔥 ${u.current_streak}` : '—'}</td>
                                                    <td style={{ ...tdStyle, color: '#9ca3af' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* COURSES TAB */}
                            {tab === 'courses' && (
                                <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>All Courses ({courses.length})</h2>
                                    </div>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead style={{ background: '#f9fafb' }}>
                                            <tr>
                                                <th style={thStyle}>Title</th>
                                                <th style={thStyle}>Instructor</th>
                                                <th style={thStyle}>Status</th>
                                                <th style={thStyle}>Students</th>
                                                <th style={thStyle}>Created</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.map(c => (
                                                <tr key={c.id}
                                                    onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                                                    onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
                                                    <td style={{ ...tdStyle, fontWeight: 600 }}>
                                                        <Link href={`/subjects/${c.id}`} style={{ color: '#111827', textDecoration: 'none' }}>
                                                            {c.title}
                                                        </Link>
                                                    </td>
                                                    <td style={{ ...tdStyle, color: '#6b7280' }}>{c.instructor_name || '—'}</td>
                                                    <td style={tdStyle}><Badge published={c.is_published} /></td>
                                                    <td style={tdStyle}><span style={{ fontWeight: 700, color: '#6366f1' }}>{c.enrolledStudents}</span></td>
                                                    <td style={{ ...tdStyle, color: '#9ca3af' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                            {courses.length === 0 && (
                                                <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>No courses yet</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}
