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
    <div className="max-w-[1200px] mx-auto p-6 md:p-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Explore Courses</h1>
        <p className="text-color-text-secondary text-lg">
          Discover a structured path to mastery across various subjects.
        </p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-[var(--color-error-light)] text-[var(--color-error)] p-4 rounded-lg border border-[rgba(239,68,68,0.2)]">
          {error}
        </div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-secondary)] bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
          <p>No subjects are currently published.</p>
        </div>
      ) : (
        <div className="subject-grid">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} {...subject} />
          ))}
        </div>
      )}
    </div>
  );
}
