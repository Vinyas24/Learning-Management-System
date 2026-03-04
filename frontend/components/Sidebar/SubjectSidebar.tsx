'use client';

import { useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import { apiClient } from '@/lib/apiClient';
import SectionItem from './SectionItem';

interface SubjectTreeResponse {
    data: {
        id: number;
        title: string;
        sections: {
            id: number;
            title: string;
            order_index: number;
            videos: {
                id: number;
                title: string;
                order_index: number;
                is_completed: boolean;
                locked: boolean;
            }[];
        }[];
    };
}

export default function SubjectSidebar() {
    const params = useParams();
    const pathname = usePathname();
    const subjectId = Number(params.subjectId);
    const activeVideoId = pathname.includes('/video/')
        ? Number(pathname.split('/video/')[1])
        : undefined;

    const { tree, loading, error, setTree, setLoading, setError } = useSidebarStore();

    useEffect(() => {
        if (isNaN(subjectId)) return;

        const fetchTree = async () => {
            setLoading(true);
            try {
                const res = await apiClient<SubjectTreeResponse>(`/api/subjects/${subjectId}/tree`);
                setTree(res.data.sections);
            } catch (err) {
                setError('Failed to load course structure');
            }
        };

        fetchTree();
    }, [subjectId, setTree, setLoading, setError]);

    if (loading) {
        return (
            <aside className="sidebar">
                <div className="animate-pulse flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="mb-6">
                            <div className="h-4 bg-[var(--color-border)] rounded w-1/3 mb-4 ml-2"></div>
                            <div className="h-10 bg-[var(--color-surface-hover)] rounded w-full mb-2"></div>
                            <div className="h-10 bg-[var(--color-surface-hover)] rounded w-full"></div>
                        </div>
                    ))}
                </div>
            </aside>
        );
    }

    if (error) {
        return (
            <aside className="sidebar flex items-center justify-center p-4">
                <p className="text-[var(--color-error)] text-sm text-center">{error}</p>
            </aside>
        );
    }

    return (
        <aside className="sidebar">
            {tree.map((section) => (
                <SectionItem
                    key={section.id}
                    sectionId={section.id}
                    title={section.title}
                    videos={section.videos}
                    subjectId={subjectId}
                    activeVideoId={activeVideoId}
                />
            ))}
        </aside>
    );
}
