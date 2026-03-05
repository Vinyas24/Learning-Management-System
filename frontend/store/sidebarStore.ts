'use client';

import { create } from 'zustand';

interface Video {
    id: number;
    title: string;
    order_index: number;
    is_completed: boolean;
    locked: boolean;
}

interface Section {
    id: number;
    title: string;
    order_index: number;
    videos: Video[];
}

interface SidebarState {
    tree: Section[];
    loading: boolean;
    error: string | null;
    setTree: (tree: Section[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    markVideoCompleted: (videoId: number, nextVideoId?: number | null) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
    tree: [],
    loading: false,
    error: null,

    setTree: (tree) => set({ tree, loading: false, error: null }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error, loading: false }),

    markVideoCompleted: (videoId, nextVideoId) =>
        set((state) => ({
            tree: state.tree.map((section) => ({
                ...section,
                videos: section.videos.map((v) => {
                    if (v.id === videoId) return { ...v, is_completed: true };
                    if (nextVideoId && v.id === nextVideoId) return { ...v, locked: false };
                    return v;
                }),
            })),
        })),
}));
