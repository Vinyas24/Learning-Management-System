import { apiClient } from './apiClient';

const DEBOUNCE_MS = 5000;

interface ProgressPayload {
    last_position_seconds: number;
    is_completed?: boolean;
}

let isThrottled = false;
let pendingPayload: ProgressPayload | null = null;
let pendingVideoId: number | null = null;

export function sendProgress(videoId: number, payload: ProgressPayload): void {
    if (payload.is_completed) {
        apiClient(`/api/progress/videos/${videoId}`, {
            method: 'POST',
            body: JSON.stringify(payload),
        }).catch(console.error);
        return;
    }

    pendingPayload = payload;
    pendingVideoId = videoId;

    if (!isThrottled) {
        isThrottled = true;
        setTimeout(() => {
            if (pendingPayload && pendingVideoId) {
                apiClient(`/api/progress/videos/${pendingVideoId}`, {
                    method: 'POST',
                    body: JSON.stringify(pendingPayload),
                }).catch(console.error);
                pendingPayload = null;
                pendingVideoId = null;
            }
            isThrottled = false;
        }, DEBOUNCE_MS);
    }
}

export function flushProgress(): void {
    if (pendingPayload && pendingVideoId) {
        apiClient(`/api/progress/videos/${pendingVideoId}`, {
            method: 'POST',
            body: JSON.stringify(pendingPayload),
        }).catch(console.error);
        pendingPayload = null;
        pendingVideoId = null;
    }
}

export async function getGlobalResume() {
    const response = await apiClient<{
        success: boolean;
        data: { video_id: number; subject_id: number; last_position_seconds: number } | null;
    }>('/api/progress/resume');
    return response.data;
}
