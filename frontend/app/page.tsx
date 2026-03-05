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
  pagination: {
    total: number;
  };
}

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await apiClient<SubjectsResponse>('/api/subjects');
        setSubjects(res.data);
      } catch (err) {
        setError('Failed to load subjects. Ensure backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] animate-fade-in pb-20 pt-24">

      {/* Premium Hero Banner */}
      <div className="relative w-full overflow-hidden border-b border-[var(--color-border)] bg-[#0a0a0e]">
        {/* Abstract Glowing Backgrounds */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[160%] bg-[var(--color-accent)] blur-[150px] rounded-full mix-blend-screen mix-blend-plus-lighter opacity-40 transform -rotate-12 animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-[-30%] left-[-10%] w-[50%] h-[150%] bg-[#a855f7] blur-[150px] rounded-full mix-blend-screen mix-blend-plus-lighter opacity-30 transform rotate-12"></div>
        </div>
        {/* Textures and grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)', backgroundSize: '48px 48px', opacity: 0.1 }}></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] flex-shrink-0"></span>
            <span className="text-white/80 text-xs font-bold tracking-widest uppercase">Premium Learning Paths</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight drop-shadow-md">
            Master your craft with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-[#a855f7]">structured curriculums</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Explore expertly researched video courses designed to guide you step-by-step from foundational concepts to advanced techniques.
          </p>

          <div className="flex items-center justify-center gap-4">
            <a href="#courses" className="px-8 py-4 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[#a855f7] text-white font-bold text-lg shadow-lg shadow-indigo-500/25 hover:scale-105 hover:shadow-indigo-500/40 transition-all">
              Start Exploring
            </a>
            <a href="/profile" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 backdrop-blur-sm transition-all">
              My Profile
            </a>
          </div>
        </div>
      </div>

      {/* Course Grid Section */}
      <div id="courses" className="max-w-[1200px] mx-auto px-6 md:px-12 mt-20 pt-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 mb-2">
              <span className="w-1.5 h-8 bg-[var(--color-accent)] rounded-full inline-block"></span>
              Available Courses
            </h2>
            <p className="text-[var(--color-text-secondary)]">Begin your journey by selecting a learning path below.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl h-80 opacity-60"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-[var(--color-error-light)] text-[var(--color-error)] p-6 rounded-2xl border border-[rgba(239,68,68,0.2)] shadow-sm max-w-2xl">
            <div className="font-semibold mb-1">Could not load subjects</div>
            <div className="text-sm opacity-90">{error}</div>
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-text-secondary)] bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] shadow-sm">
            <p className="text-lg">No subjects are currently published. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} {...subject} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
