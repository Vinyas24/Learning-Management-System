'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/apiClient';
import AuthGuard from '@/components/Auth/AuthGuard';

interface Video {
    id: number;
    title: string;
    order_index: number;
}

interface Section {
    id: number;
    title: string;
    order_index: number;
    videos: Video[];
    quiz: { id: number } | null;
}

interface SubjectTree {
    id: number;
    title: string;
    sections: Section[];
}

interface QuizQuestion {
    id: number;
    question_text: string;
    options: string[];
    correct_answer: string;
    order_index: number;
}

interface InstructorQuiz {
    id: number;
    title: string;
    passing_score: number;
    questions: QuizQuestion[];
}

export default function ManageCoursePage({ params }: { params: Promise<{ subjectId: string }> }) {
    const { subjectId } = React.use(params);
    const router = useRouter();
    const [tree, setTree] = useState<SubjectTree | null>(null);
    const [loading, setLoading] = useState(true);

    const [isAddingSection, setIsAddingSection] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState('');

    const [addingVideoToSection, setAddingVideoToSection] = useState<number | null>(null);
    const [newVideoTitle, setNewVideoTitle] = useState('');
    const [newVideoUrl, setNewVideoUrl] = useState('');

    const [addingQuizToSection, setAddingQuizToSection] = useState<number | null>(null);
    const [newQuizTitle, setNewQuizTitle] = useState('');

    const [managingQuizId, setManagingQuizId] = useState<number | null>(null);
    const [activeQuizData, setActiveQuizData] = useState<InstructorQuiz | null>(null);
    const [newQuestionText, setNewQuestionText] = useState('');
    const [newQuestionOptions, setNewQuestionOptions] = useState<string[]>(['', '', '', '']);
    const [newQuestionCorrectAnswer, setNewQuestionCorrectAnswer] = useState<string>('');

    useEffect(() => {
        fetchTree();
    }, [subjectId]);

    const fetchTree = async () => {
        try {
            const res = await apiClient<{ data: SubjectTree }>(`/api/subjects/${subjectId}/tree`);
            setTree(res.data);
        } catch (error) {
            console.error("Failed to fetch curriculum tree", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSection = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const order_index = tree ? tree.sections.length : 0;
            await apiClient('/api/sections', {
                method: 'POST',
                body: JSON.stringify({ subject_id: parseInt(subjectId), title: newSectionTitle, order_index })
            });
            setNewSectionTitle('');
            setIsAddingSection(false);
            fetchTree();
        } catch (error) {
            alert('Failed to add section');
        }
    };

    const handleAddVideo = async (e: React.FormEvent, sectionId: number, currentVideosLength: number) => {
        e.preventDefault();
        try {
            await apiClient('/api/videos', {
                method: 'POST',
                body: JSON.stringify({ section_id: sectionId, title: newVideoTitle, youtube_url: newVideoUrl, order_index: currentVideosLength })
            });
            setNewVideoTitle('');
            setNewVideoUrl('');
            setAddingVideoToSection(null);
            fetchTree();
        } catch (error) {
            alert('Failed to add video');
        }
    };

    const handleAddQuiz = async (e: React.FormEvent, sectionId: number) => {
        e.preventDefault();
        try {
            await apiClient('/api/quizzes', {
                method: 'POST',
                body: JSON.stringify({ sectionId, title: newQuizTitle, passingScore: 50 })
            });
            setNewQuizTitle('');
            setAddingQuizToSection(null);
            fetchTree();
        } catch (error) {
            alert('Failed to add quiz');
        }
    };

    const handlePublishToggle = async () => {
        try {
            await apiClient(`/api/subjects/${subjectId}`, {
                method: 'PUT',
                body: JSON.stringify({ is_published: true })
            });
            alert('Course is now published!');
        } catch (error) {
            alert('Failed to publish course');
        }
    };

    const handleManageQuiz = async (quizId: number) => {
        if (managingQuizId === quizId) {
            setManagingQuizId(null);
            setActiveQuizData(null);
            return;
        }
        setManagingQuizId(quizId);
        setActiveQuizData(null);
        try {
            const res = await apiClient<{ data: InstructorQuiz }>(`/api/quizzes/${quizId}/instructor`);
            setActiveQuizData(res.data);
        } catch (error) {
            console.error(error);
            alert('Failed to load quiz details');
        }
    };

    const handleAddQuestion = async (e: React.FormEvent, quizId: number) => {
        e.preventDefault();
        if (!newQuestionCorrectAnswer) {
            alert('Please select a correct answer');
            return;
        }
        try {
            const orderIndex = activeQuizData ? activeQuizData.questions.length : 0;
            await apiClient(`/api/quizzes/${quizId}/questions`, {
                method: 'POST',
                body: JSON.stringify({
                    questionText: newQuestionText,
                    options: newQuestionOptions,
                    correctAnswer: newQuestionCorrectAnswer,
                    orderIndex
                })
            });
            
            // Refresh quiz data
            setNewQuestionText('');
            setNewQuestionOptions(['', '', '', '']);
            setNewQuestionCorrectAnswer('');
            handleManageQuiz(quizId); // re-fetch
        } catch (error) {
            console.error(error);
            alert('Failed to add question');
        }
    };

    if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading curriculum...</div>;
    if (!tree) return <div style={{ padding: '60px', textAlign: 'center' }}>Course not found</div>;

    return (
        <AuthGuard allowedRoles={['instructor', 'admin']}>
            <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', paddingTop: '100px', paddingBottom: '60px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 32px' }}>
                    
                    <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Link href="/instructor" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                                &larr; Back to Dashboard
                            </Link>
                            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginTop: '16px', letterSpacing: '-1px' }}>
                                Manage Curriculum
                            </h1>
                            <p style={{ color: '#6b7280', fontSize: '16px', marginTop: '4px' }}>
                                {tree.title}
                            </p>
                        </div>
                        <button onClick={handlePublishToggle} style={{
                            padding: '10px 20px', borderRadius: '12px',
                            background: '#10b981', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
                        }}>
                            Publish Course
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {tree.sections.map((section) => (
                            <div key={section.id} style={{
                                background: 'white', borderRadius: '16px', padding: '24px',
                                border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
                                        Section {section.order_index + 1}: {section.title}
                                    </h3>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                                    {section.videos.map((video) => (
                                        <div key={video.id} style={{
                                            background: '#f9fafb', borderRadius: '8px', padding: '12px 16px',
                                            display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #f3f4f6'
                                        }}>
                                            <span style={{ fontSize: '20px' }}>▶️</span>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>{video.title}</span>
                                        </div>
                                    ))}
                                    
                                    {section.quiz && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{
                                                background: '#fff7ed', borderRadius: '8px', padding: '12px 16px',
                                                display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #fed7aa'
                                            }}>
                                                <span style={{ fontSize: '20px' }}>📝</span>
                                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#9a3412' }}>Module Assessment (Quiz)</span>
                                                <button 
                                                    onClick={() => handleManageQuiz(section.quiz!.id)}
                                                    style={{ marginLeft: 'auto', background: '#f97316', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                                >
                                                    {managingQuizId === section.quiz.id ? 'Close Builder' : 'Manage Questions'}
                                                </button>
                                            </div>

                                            {managingQuizId === section.quiz.id && activeQuizData && (
                                                <div style={{ background: '#fffaf5', border: '1px solid #fed7aa', borderRadius: '8px', padding: '16px' }}>
                                                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#9a3412', marginBottom: '12px', margin: 0 }}>Existing Questions ({activeQuizData.questions.length})</h4>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                                        {activeQuizData.questions.map((q, idx) => (
                                                            <div key={q.id} style={{ background: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                                                <p style={{ fontWeight: 600, fontSize: '14px', color: '#111827', margin: '0 0 8px 0' }}>{idx + 1}. {q.question_text}</p>
                                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                                                    {q.options.map((opt, oIdx) => (
                                                                        <div key={oIdx} style={{ 
                                                                            fontSize: '13px', padding: '6px 8px', borderRadius: '4px',
                                                                            background: opt === q.correct_answer ? '#dcfce7' : '#f3f4f6',
                                                                            color: opt === q.correct_answer ? '#166534' : '#4b5563',
                                                                            border: opt === q.correct_answer ? '1px solid #bbf7d0' : '1px solid transparent'
                                                                        }}>
                                                                            {opt} {opt === q.correct_answer && '✓'}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {activeQuizData.questions.length === 0 && <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>No questions added yet.</p>}
                                                    </div>

                                                    <form onSubmit={(e) => handleAddQuestion(e, section.quiz!.id)} style={{ background: 'white', padding: '16px', borderRadius: '6px', border: '1px dashed #fed7aa' }}>
                                                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '12px', margin: 0 }}>Add New Question</h4>
                                                        <input type="text" placeholder="Question Text" value={newQuestionText} onChange={e => setNewQuestionText(e.target.value)} required style={{ width: '100%', padding: '8px 12px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                                                        
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                                            {[0, 1, 2, 3].map((i) => (
                                                                <input 
                                                                    key={i} type="text" placeholder={`Option ${i + 1}`} required 
                                                                    value={newQuestionOptions[i]} 
                                                                    onChange={e => {
                                                                        const newOpts = [...newQuestionOptions];
                                                                        newOpts[i] = e.target.value;
                                                                        setNewQuestionOptions(newOpts);
                                                                    }}
                                                                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} 
                                                                />
                                                            ))}
                                                        </div>

                                                        <div style={{ marginBottom: '16px' }}>
                                                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#4b5563', display: 'block', marginBottom: '4px' }}>Correct Answer:</label>
                                                            <select 
                                                                value={newQuestionCorrectAnswer} 
                                                                onChange={e => setNewQuestionCorrectAnswer(e.target.value)} 
                                                                required
                                                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', background: 'white' }}
                                                            >
                                                                <option value="" disabled>Select correct option...</option>
                                                                {newQuestionOptions.map((opt, i) => opt.trim() !== '' && (
                                                                    <option key={i} value={opt}>{opt}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <button type="submit" style={{ background: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                                                            Save Question
                                                        </button>
                                                    </form>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button 
                                        onClick={() => setAddingVideoToSection(section.id)}
                                        style={{ background: '#f3f4f6', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#4b5563', cursor: 'pointer' }}
                                    >
                                        + Add Video
                                    </button>
                                    {!section.quiz && (
                                        <button 
                                            onClick={() => setAddingQuizToSection(section.id)}
                                            style={{ background: '#f3f4f6', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#4b5563', cursor: 'pointer' }}
                                        >
                                            + Add Quiz
                                        </button>
                                    )}
                                </div>

                                {/* Add Video Form Inline */}
                                {addingVideoToSection === section.id && (
                                    <form onSubmit={(e) => handleAddVideo(e, section.id, section.videos.length)} style={{ marginTop: '16px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                                        <input type="text" placeholder="Video Title" value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} required style={{ width: '100%', padding: '8px 12px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                                        <input type="url" placeholder="YouTube URL" value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} required style={{ width: '100%', padding: '8px 12px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Save Video</button>
                                            <button type="button" onClick={() => setAddingVideoToSection(null)} style={{ background: 'transparent', color: '#6b7280', border: 'none', padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                        </div>
                                    </form>
                                )}

                                {/* Add Quiz Form Inline */}
                                {addingQuizToSection === section.id && (
                                    <form onSubmit={(e) => handleAddQuiz(e, section.id)} style={{ marginTop: '16px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                                        <input type="text" placeholder="Quiz Title" value={newQuizTitle} onChange={e => setNewQuizTitle(e.target.value)} required style={{ width: '100%', padding: '8px 12px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button type="submit" style={{ background: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Create Empty Quiz</button>
                                            <button type="button" onClick={() => setAddingQuizToSection(null)} style={{ background: 'transparent', color: '#6b7280', border: 'none', padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        ))}

                        {/* Add Section Button/Form */}
                        {!isAddingSection ? (
                            <button onClick={() => setIsAddingSection(true)} style={{
                                padding: '20px', background: 'transparent', border: '2px dashed #d1d5db',
                                borderRadius: '16px', color: '#6b7280', fontSize: '16px', fontWeight: 600,
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}>
                                + Add New Section
                            </button>
                        ) : (
                            <form onSubmit={handleAddSection} style={{
                                background: 'white', borderRadius: '16px', padding: '24px',
                                border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                            }}>
                                <input 
                                    type="text" 
                                    placeholder="Section Title e.g., 'Introduction'" 
                                    value={newSectionTitle} 
                                    onChange={e => setNewSectionTitle(e.target.value)} 
                                    required 
                                    style={{ width: '100%', padding: '12px 16px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} 
                                />
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="submit" style={{ background: '#111827', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Save Section</button>
                                    <button type="button" onClick={() => setIsAddingSection(false)} style={{ background: 'transparent', color: '#6b7280', border: 'none', padding: '10px 20px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
