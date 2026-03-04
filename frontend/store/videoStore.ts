'use client';

import { create } from 'zustand';

interface VideoState {
    currentVideoId: number | null;
    subjectId: number | null;
    currentTime: number;
    duration: number;
    isPlaying: boolean;
    isCompleted: boolean;
    nextVideoId: number | null;
    prevVideoId: number | null;
    setVideo: (data: Partial<VideoState>) => void;
    reset: () => void;
}

const initialState = {
    currentVideoId: null,
    subjectId: null,
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    isCompleted: false,
    nextVideoId: null,
    prevVideoId: null,
};

export const useVideoStore = create<VideoState>((set) => ({
    ...initialState,
    setVideo: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set(initialState),
}));
