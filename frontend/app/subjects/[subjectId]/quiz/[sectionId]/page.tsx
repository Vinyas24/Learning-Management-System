'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getQuizBySection, submitQuiz, Quiz } from '@/lib/quiz';

export default function QuizPage() {
    const params = useParams();
    const router = useRouter();
    const subjectId = Number(params.subjectId);
    const sectionId = Number(params.sectionId);

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isNaN(sectionId)) return;
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const data = await getQuizBySection(sectionId);
                setQuiz(data);
                if (data?.result) {
                    setResult(data.result);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load quiz');
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [sectionId]);

    const handleOptionSelect = (questionId: number, option: string) => {
        if (result) return; // Cannot edit if already submitted and viewing result
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = async () => {
        if (!quiz) return;
        if (Object.keys(answers).length < quiz.questions.length) {
            alert('Please answer all questions before submitting.');
            return;
        }

        try {
            setSubmitting(true);
            const res = await submitQuiz(quiz.id, answers);
            setResult(res);
        } catch (err: any) {
            alert(err.message || 'Submission failed');
        } finally {
            setSubmitting(false);
            router.refresh();
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ background: '#f3f4f6', borderRadius: '12px', height: i === 1 ? '48px' : '80px', marginBottom: '16px', width: i === 1 ? '60%' : '100%' }} />
                ))}
            </div>
        );
    }

    if (error || !quiz) {
        return (
            <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ background: '#fff1f2', color: '#e11d48', padding: '20px 24px', borderRadius: '16px', border: '1px solid #fecdd3', fontSize: '15px', fontWeight: 600 }}>
                    {error || 'No quiz available for this module.'}
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
            {/* ── Hero Banner ── */}
            <div style={{
                position: 'relative',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
                overflow: 'hidden',
                padding: '48px 48px 52px',
            }}>
                <div style={{ position: 'absolute', top: '-30%', right: '5%', width: '45%', height: '200%', background: '#f97316', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.08, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '99px', padding: '5px 16px', marginBottom: '20px',
                    }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)' }}>Module Quiz</span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 900, color: 'white', letterSpacing: '-1px', lineHeight: 1.1, margin: '0 0 12px' }}>
                        {quiz.title}
                    </h1>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                        Passing score: <strong style={{ color: 'white' }}>{quiz.passing_score}%</strong>
                    </p>
                </div>
            </div>

            {/* ── Content ── */}
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 32px 0' }}>
                
                {/* Result Card */}
                {result && (
                    <div style={{
                        background: result.passed ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                        border: `1px solid ${result.passed ? '#bbf7d0' : '#fecaca'}`,
                        borderRadius: '24px',
                        padding: '32px',
                        marginBottom: '40px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, color: result.passed ? '#15803d' : '#b91c1c', margin: '0 0 12px' }}>
                            {result.passed ? '🎉 You Passed!' : '❌ Keep Trying!'}
                        </h2>
                        <p style={{ fontSize: '18px', color: result.passed ? '#166534' : '#991b1b', margin: '0 0 24px' }}>
                            Your score: <strong>{result.score}%</strong>
                        </p>
                        
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                            {!result.passed && (
                                <button 
                                    onClick={() => { setResult(null); setAnswers({}); }}
                                    style={{
                                        padding: '12px 24px', borderRadius: '12px', border: '1px solid #fca5a5',
                                        background: 'white', color: '#b91c1c', fontWeight: 700, cursor: 'pointer',
                                    }}
                                >
                                    Retake Quiz
                                </button>
                            )}
                            {result.passed && (
                                <button 
                                    onClick={() => router.push(`/subjects/${subjectId}`)}
                                    style={{
                                        padding: '14px 32px', borderRadius: '12px', border: 'none',
                                        background: '#15803d', color: 'white', fontWeight: 700, cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(21,128,61,0.3)'
                                    }}
                                >
                                    Continue Course
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Questions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {quiz.questions.map((q, idx) => (
                        <div key={q.id} style={{
                            background: 'white', borderRadius: '20px', padding: '32px',
                            border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                        }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 20px', lineHeight: 1.5 }}>
                                <span style={{ color: '#9ca3af', marginRight: '12px' }}>{idx + 1}.</span>
                                {q.question_text}
                            </h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {q.options.map(opt => {
                                    const isSelected = answers[q.id] === opt;
                                    return (
                                        <label 
                                            key={opt} 
                                            style={{
                                                display: 'flex', alignItems: 'center', padding: '16px 20px',
                                                border: `2px solid ${isSelected ? '#f97316' : '#f3f4f6'}`,
                                                background: isSelected ? '#fff7ed' : 'white',
                                                borderRadius: '12px', cursor: result ? 'default' : 'pointer',
                                                transition: 'all 0.2s',
                                                opacity: result ? 0.7 : 1,
                                            }}
                                        >
                                            <input 
                                                type="radio" 
                                                name={`question-${q.id}`} 
                                                value={opt}
                                                checked={isSelected}
                                                onChange={() => handleOptionSelect(q.id, opt)}
                                                disabled={!!result}
                                                style={{ width: '18px', height: '18px', accentColor: '#f97316', marginRight: '16px' }}
                                            />
                                            <span style={{ fontSize: '16px', color: '#374151', fontWeight: isSelected ? 600 : 500 }}>
                                                {opt}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {!result && (
                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                            onClick={handleSubmit} 
                            disabled={submitting}
                            style={{
                                padding: '18px 40px',
                                borderRadius: '16px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #f97316, #ec4899)',
                                color: 'white',
                                fontSize: '17px',
                                fontWeight: 800,
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                opacity: submitting ? 0.7 : 1,
                                boxShadow: '0 8px 24px rgba(249,115,22,0.3)',
                            }}
                        >
                            {submitting ? 'Submitting...' : 'Submit Quiz'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
