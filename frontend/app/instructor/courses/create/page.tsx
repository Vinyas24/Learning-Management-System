'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import AuthGuard from '@/components/Auth/AuthGuard';
import Link from 'next/link';

export default function CreateCoursePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateSlug = (text: string) => {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const slug = generateSlug(title);
        
        try {
            const res = await apiClient<{ data: { id: number } }>('/api/subjects', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    slug,
                    description,
                    image_url: imageUrl || undefined
                })
            });

            if (res.data && res.data.id) {
                router.push(`/instructor/courses/${res.data.id}/manage`);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthGuard allowedRoles={['instructor', 'admin']}>
            <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', paddingTop: '100px', paddingBottom: '60px' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 32px' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <Link href="/instructor" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                            &larr; Back to Dashboard
                        </Link>
                    </div>

                    <div style={{
                        background: 'white', borderRadius: '24px', padding: '40px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                        border: '1px solid #f3f4f6'
                    }}>
                        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginBottom: '8px', letterSpacing: '-1px' }}>
                            Create a New Course
                        </h1>
                        <p style={{ color: '#6b7280', marginBottom: '32px' }}>
                            Start by giving your course a title and description. You can add videos and quizzes later.
                        </p>

                        {error && (
                            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', fontWeight: 600 }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                    Course Title
                                </label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Advanced TypeScript Patterns"
                                    required
                                    style={{
                                        width: '100%', padding: '14px 16px', borderRadius: '12px',
                                        border: '1px solid #d1d5db', fontSize: '16px',
                                        outline: 'none', transition: 'border-color 0.2s',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                {title && (
                                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                                        Slug: {generateSlug(title)}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                    Description (Optional)
                                </label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What will students learn in this course?"
                                    rows={4}
                                    style={{
                                        width: '100%', padding: '14px 16px', borderRadius: '12px',
                                        border: '1px solid #d1d5db', fontSize: '16px',
                                        outline: 'none', transition: 'border-color 0.2s',
                                        boxSizing: 'border-box', resize: 'vertical'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                    Cover Image URL (Optional)
                                </label>
                                <input 
                                    type="url" 
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    style={{
                                        width: '100%', padding: '14px 16px', borderRadius: '12px',
                                        border: '1px solid #d1d5db', fontSize: '16px',
                                        outline: 'none', transition: 'border-color 0.2s',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading || !title}
                                style={{
                                    marginTop: '16px', padding: '16px', borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #f97316, #ec4899)',
                                    color: 'white', fontWeight: 700, fontSize: '16px',
                                    border: 'none', cursor: loading || !title ? 'not-allowed' : 'pointer',
                                    opacity: loading || !title ? 0.7 : 1,
                                    boxShadow: '0 10px 25px rgba(249,115,22,0.3)',
                                    transition: 'transform 0.2s'
                                }}
                            >
                                {loading ? 'Creating...' : 'Create Course & Add Curriculum'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
