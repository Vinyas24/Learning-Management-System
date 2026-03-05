import Link from 'next/link';

interface SubjectCardProps {
    id: number;
    title: string;
    slug: string;
    description: string | null;
}

const CARD_COLORS = [
    { bg: '#fff7ed', icon: '#f97316', border: '#000000ff' },
    { bg: '#eff6ff', icon: '#3b82f6', border: '#000000ff' },
    { bg: '#fdf4ff', icon: '#a855f7', border: '#000000ff' },
    { bg: '#f0fdf4', icon: '#22c55e', border: '#000000ff' },
    { bg: '#fff1f2', icon: '#f43f5e', border: '#000000ff' },
    { bg: '#fefce8', icon: '#eab308', border: '#000000ff' },
];

function getCardColor(id: number) {
    return CARD_COLORS[id % CARD_COLORS.length];
}

export default function SubjectCard({ id, title, description }: SubjectCardProps) {
    const colors = getCardColor(id);

    return (
        <Link href={`/subjects/${id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <div style={{
                background: 'rgba(255,251,245,0.82)',
                backdropFilter: 'blur(12px)',
                border: '1.5px solid #000000ff',
                borderRadius: '24px',
                padding: '32px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'all 0.25s ease',
                boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
            }}
                onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = colors.border;
                    el.style.transform = 'translateY(-6px)';
                    el.style.boxShadow = `0 20px 40px -10px ${colors.icon}30`;
                }}
                onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = '#000000ff';
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = '0 1px 8px rgba(0,0,0,0.04)';
                }}>
                {/* Icon */}
                <div style={{
                    width: '56px', height: '56px',
                    borderRadius: '16px',
                    background: colors.bg,
                    border: `1.5px solid ${colors.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={colors.icon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>
                </div>

                {/* Title */}
                <h3 style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#111827',
                    lineHeight: 1.3,
                    margin: 0,
                }}>
                    {title}
                </h3>

                {/* Description */}
                <p style={{
                    fontSize: '15px',
                    color: '#6b7280',
                    lineHeight: 1.65,
                    margin: 0,
                    flexGrow: 1,
                }}>
                    {description || 'No description available for this course.'}
                </p>

                {/* Footer */}
                <div style={{
                    paddingTop: '16px',
                    borderTop: '1px solid #000000ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af' }}>
                        Course Outline
                    </span>
                    <span style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontSize: '12px', fontWeight: 700, color: '#9ca3af',
                        background: '#f9fafb', border: '1px solid #f3f4f6',
                        padding: '6px 12px', borderRadius: '99px',
                    }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        Login to unlock
                    </span>
                </div>
            </div>
        </Link>
    );
}
