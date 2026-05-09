'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAccessToken } from '@/lib/apiClient';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (user: User, accessToken: string) => void;
    logout: () => void;
    setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,

            login: (user, accessToken) => {
                setAccessToken(accessToken);
                set({ user, accessToken, isAuthenticated: true });
            },

            logout: () => {
                setAccessToken(null);
                set({ user: null, accessToken: null, isAuthenticated: false });
            },

            setToken: (token) => {
                setAccessToken(token);
                set({ accessToken: token });
            },
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                if (state?.accessToken) {
                    setAccessToken(state.accessToken);
                }
            },
        }
    )
);
