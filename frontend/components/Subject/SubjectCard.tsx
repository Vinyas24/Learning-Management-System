import Link from 'next/link';

interface SubjectCardProps {
    id: number;
    title: string;
    slug: string;
    description: string | null;
}

export default function SubjectCard({ id, title, description }: SubjectCardProps) {
    return (
        <Link href={`/subjects/${id}`} className="group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 hover:border-[var(--color-accent)]/50 transition-all hover:-translate-y-1 hover:shadow-2xl overflow-hidden block h-full flex flex-col">
            {/* Subtle Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>

            <div className="relative z-10 flex-grow flex flex-col">
                <div className="w-12 h-12 bg-[var(--color-surface-hover)] rounded-xl flex items-center justify-center border border-[var(--color-border)] shadow-inner text-[var(--color-accent)] group-hover:scale-110 transition-transform duration-300 mb-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--color-accent)] transition-colors pr-4">
                    {title}
                </h3>

                <p className="text-[var(--color-text-secondary)] text-sm md:text-base leading-relaxed mb-6 flex-grow">
                    {description || 'No description available for this course.'}
                </p>

                <div className="pt-6 border-t border-[var(--color-border)] flex flex-row items-center justify-between mt-auto">
                    <span className="text-sm font-bold tracking-widest uppercase text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors">Course Outline</span>
                    <span className="w-8 h-8 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center group-hover:bg-[var(--color-accent-light)] group-hover:text-[var(--color-accent)] transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}
