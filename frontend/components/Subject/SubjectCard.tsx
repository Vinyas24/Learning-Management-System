import Link from 'next/link';

interface SubjectCardProps {
    id: number;
    title: string;
    slug: string;
    description: string | null;
}

export default function SubjectCard({ id, title, description }: SubjectCardProps) {
    return (
        <Link href={`/subjects/${id}`} className="subject-card group">
            <div className="subject-card-content">
                <h3 className="subject-card-title">{title}</h3>
                <p className="subject-card-desc">
                    {description || 'No description available for this subject.'}
                </p>
                <div className="subject-card-footer">
                    <span className="subject-card-link">
                        View Course
                        <svg
                            className="subject-card-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}
