import { config } from './config';

interface FetchOptions extends RequestInit {
    skipAuth?: boolean;
}

let accessToken: string | null = null;
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

async function refreshAccessToken(): Promise<string | null> {
    try {
        const res = await fetch(`${config.API_BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        accessToken = data.accessToken;
        return accessToken;
    } catch {
        return null;
    }
}

export async function apiClient<T = unknown>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { skipAuth = false, headers: customHeaders, ...fetchOptions } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(customHeaders as Record<string, string>),
    };

    if (!skipAuth && accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    let res = await fetch(`${config.API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
        credentials: 'include',
    });

    // On 401, attempt refresh (only once)
    if (res.status === 401 && !skipAuth) {
        if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshAccessToken();
        }

        const newToken = await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;

        if (newToken) {
            headers['Authorization'] = `Bearer ${newToken}`;
            res = await fetch(`${config.API_BASE_URL}${endpoint}`, {
                ...fetchOptions,
                headers,
                credentials: 'include',
            });
        } else {
            // Refresh failed — clear auth and redirect
            accessToken = null;
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            throw new Error('Session expired. Please log in again.');
        }
    }

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Request failed: ${res.status}`);
    }

    return res.json();
}
