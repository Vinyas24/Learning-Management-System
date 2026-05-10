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
    is_published: boolean;
}

interface InstructorStats {
    totalCourses: number;
    totalEnrolledStudents: number;
}

export default function InstructorDashboard() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<InstructorStats | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const statsRes = await apiClient<{ data: InstructorStats }>('/api/instructor/stats');
                const subjectsRes = await apiClient<{ data: Subject[] }>('/api/subjects/instructor/list');
                
                setStats(statsRes.data);
                setSubjects(subjectsRes.data);
            } catch (error) {
                console.error("Failed to fetch instructor data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && (user.role === 'instructor' || user.role === 'admin')) {
            fetchData();
        }
    }, [user]);

    return (
        <AuthGuard allowedRoles={['instructor', 'admin']}>
            <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', paddingTop: '100px', paddingBottom: '60px' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <div>
                            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', letterSpacing: '-1px' }}>
                                Instructor Dashboard
                            </h1>
                            <p style={{ color: '#6b7280', fontSize: '16px', marginTop: '8px' }}>
                                Welcome back, {user?.name}. Manage your courses and students.
                            </p>
                        </div>
                        <Link href="/instructor/courses/create" style={{
                            padding: '12px 24px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #f97316, #ec4899)',
                            color: 'white', fontWeight: 700, textDecoration: 'none',
                            boxShadow: '0 10px 25px rgba(249,115,22,0.3)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            display: 'inline-flex', alignItems: 'center', gap: '8px'
                        }}>
                            <span>+ Create New Course</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>Loading your dashboard...</div>
                    ) : (
                        <>
                            {/* Quick Stats Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: '24px',
                                marginBottom: '48px',
                            }}>
                                <div style={{
                                    background: 'white', borderRadius: '24px', padding: '32px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                                    border: '1px solid #f3f4f6', position: 'relative', overflow: 'hidden'
                                }}>
                                    <div style={{ color: '#6b7280', fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Total Courses</div>
                                    <div style={{ fontSize: '48px', fontWeight: 800, color: '#111827', letterSpacing: '-2px' }}>
                                        {stats?.totalCourses || 0}
                                    </div>
                                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '100px', opacity: 0.03, pointerEvents: 'none' }}>📚</div>
                                </div>
                                <div style={{
                                    background: 'white', borderRadius: '24px', padding: '32px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                                    border: '1px solid #f3f4f6', position: 'relative', overflow: 'hidden'
                                }}>
                                    <div style={{ color: '#6b7280', fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Enrolled Students</div>
                                    <div style={{ fontSize: '48px', fontWeight: 800, color: '#f97316', letterSpacing: '-2px' }}>
                                        {stats?.totalEnrolledStudents || 0}
                                    </div>
                                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '100px', opacity: 0.03, pointerEvents: 'none' }}>👥</div>
                                </div>
                            </div>

                            {/* Authored Courses */}
                            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '24px' }}>
                                Your Courses
                            </h2>
                            {subjects.length === 0 ? (
                                <div style={{
                                    background: 'white', borderRadius: '24px', padding: '60px 40px',
                                    textAlign: 'center', border: '1px dashed #e5e7eb'
                                }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
                                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Ready to share your knowledge?</h3>
                                    <p style={{ color: '#6b7280', marginBottom: '24px' }}>Create your first course to start teaching students around the world.</p>
                                </div>
                            ) : (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                    gap: '24px',
                                }}>
                                    {subjects.map((subject) => (
                                        <Link key={subject.id} href={`/instructor/courses/${subject.id}/manage`} style={{ textDecoration: 'none' }}>
                                            <div style={{
                                                background: 'white', borderRadius: '24px', padding: '24px',
                                                boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                                                border: '1px solid #f3f4f6', transition: 'all 0.3s',
                                                cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.03)';
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>
                                                        {subject.title}
                                                    </h3>
                                                    <span style={{
                                                        padding: '4px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 700,
                                                        background: subject.is_published ? '#ecfdf5' : '#fff7ed',
                                                        color: subject.is_published ? '#10b981' : '#f97316',
                                                    }}>
                                                        {subject.is_published ? 'Published' : 'Draft'}
                                                    </span>
                                                </div>
                                                <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', margin: 0, flex: 1 }}>
                                                    {subject.description || 'No description provided.'}
                                                </p>
                                                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: 600 }}>Manage Curriculum &rarr;</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}
