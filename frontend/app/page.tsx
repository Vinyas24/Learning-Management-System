'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import SubjectCard from '@/components/Subject/SubjectCard';

interface Subject {
  id: number;
  title: string;
  slug: string;
  description: string | null;
}

interface SubjectsResponse {
  data: Subject[];
  pagination: { total: number };
}

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient<SubjectsResponse>('/api/subjects');
        setSubjects(res.data);
      } catch {
        setError('Failed to load subjects. Ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ background: 'transparent', minHeight: '100vh', fontFamily: 'inherit' }}>

      {/* Background is provided globally by layout.tsx */}

      {/* ══════════ HERO ══════════ */}
      <section style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '80px 40px 100px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '32px',
        }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)',
            border: '1px solid #000000ff', borderRadius: '99px',
            padding: '8px 20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <span style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: '#f97316', display: 'inline-block',
              boxShadow: '0 0 10px rgba(249,115,22,0.6)',
            }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Trusted by +50k Students Worldwide
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(40px, 7vw, 80px)',
            fontWeight: 900,
            color: '#111827',
            lineHeight: 1.08,
            letterSpacing: '-2px',
            margin: 0,
            maxWidth: '900px',
          }}>
            Learn Anything,{' '}
            <br />
            Anywhere{' '}
            <span style={{
              background: 'linear-gradient(135deg, #f97316, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Easily
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#6b7280',
            lineHeight: 1.7,
            maxWidth: '680px',
            margin: 0,
          }}>
            Access high-quality lessons and interactive resources from top educators, empowering you to achieve your learning goals at your own pace.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#courses" style={{
              padding: '16px 36px', borderRadius: '99px',
              background: '#111827', color: 'white',
              fontSize: '17px', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              transition: 'all 0.2s',
              display: 'inline-block',
            }}>
              Join Free Course →
            </a>
          </div>

          {/* Social proof */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '16px',
            background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 0, 0, 0.9)',
            borderRadius: '99px', padding: '8px 28px 8px 8px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.07)',
          }}>
            <div style={{ display: 'flex', marginLeft: '4px' }}>
              {[
                { bg: '#dbeafe', emoji: '👱' },
                { bg: '#fce7f3', emoji: '👩' },
                { bg: '#dcfce7', emoji: '🧔' },
              ].map((a, i) => (
                <div key={i} style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: a.bg, border: '3px solid white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', marginLeft: i === 0 ? 0 : '-12px',
                  zIndex: 3 - i, position: 'relative', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}>
                  {a.emoji}
                </div>
              ))}
            </div>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>
              Join <strong>100k+</strong> Developers &nbsp;·&nbsp;{' '}
              <span style={{ color: '#f97316', cursor: 'pointer' }}>Start Your Coding Journey →</span>
            </span>
          </div>
        </div>
      </section>

      {/* ══════════ COURSES ══════════ */}
      <section id="courses" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 40px 100px',
        }}>
          {/* Divider */}
          <div style={{ borderTop: '1px solid #000000ff', paddingTop: '64px', marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              <div style={{ width: '6px', height: '44px', background: 'linear-gradient(180deg, #f97316, #ec4899)', borderRadius: '99px', flexShrink: 0 }} />
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-1px' }}>
                Available Courses
              </h2>
            </div>
            <p style={{ fontSize: '17px', color: '#6b7280', margin: 0, paddingLeft: '22px' }}>
              Select a learning path below. Login is required to unlock video content.
            </p>
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: '#f9fafb', borderRadius: '24px', height: '300px', border: '1px solid #000000ff' }} />
              ))}
            </div>
          ) : error ? (
            <div style={{ background: '#fff1f2', color: '#e11d48', padding: '32px', borderRadius: '20px', border: '1px solid #000000ff' }}>
              <strong style={{ display: 'block', fontSize: '18px', marginBottom: '8px' }}>Could not load subjects</strong>
              <span style={{ fontSize: '15px', opacity: 0.9 }}>{error}</span>
            </div>
          ) : subjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 40px', background: 'white', borderRadius: '24px', border: '1px solid #f3f4f6' }}>
              <p style={{ fontSize: '18px', color: '#6b7280', margin: 0 }}>No subjects published yet. Check back soon!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
              {subjects.map(subject => (
                <SubjectCard key={subject.id} {...subject} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
