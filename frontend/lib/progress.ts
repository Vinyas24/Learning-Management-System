import { apiClient } from './apiClient';

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_MS = 5000;

interface ProgressPayload {
    last_position_seconds: number;
    is_completed?: boolean;
}

/**
 * Send progress update, debounced to avoid excessive API calls.
 * Completion events bypass the debounce and send immediately.
 */
export function sendProgress(videoId: number, payload: ProgressPayload): void {
    if (payload.is_completed) {
        // Completion is sent immediately
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
        }
        apiClient(`/api/progress/videos/${videoId}`, {
            method: 'POST',
            body: JSON.stringify(payload),
        }).catch(console.error);
        return;
    }

    // Debounced position update
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
        apiClient(`/api/progress/videos/${videoId}`, {
            method: 'POST',
            body: JSON.stringify(payload),
        }).catch(console.error);
        debounceTimer = null;
    }, DEBOUNCE_MS);
}

/**
 * Flush any pending debounced progress update immediately.
 */
export function flushProgress(): void {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
    }
}
