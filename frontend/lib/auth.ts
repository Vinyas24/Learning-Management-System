import { apiClient } from './apiClient';
import { useAuthStore } from '@/store/authStore';

interface AuthResponse {
    user: {
        id: number;
        name: string;
        email: string;
    };
    accessToken: string;
}

export async function loginUser(email: string, password: string): Promise<void> {
    const data = await apiClient<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        skipAuth: true,
    });

    useAuthStore.getState().login(data.user, data.accessToken);
}

export async function registerUser(
    name: string,
    email: string,
    password: string
): Promise<void> {
    const data = await apiClient<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        skipAuth: true,
    });

    useAuthStore.getState().login(data.user, data.accessToken);
}

export async function logoutUser(): Promise<void> {
    try {
        await apiClient('/api/auth/logout', { method: 'POST' });
    } catch {
        // Logout even if API fails
    } finally {
        useAuthStore.getState().logout();
    }
}
