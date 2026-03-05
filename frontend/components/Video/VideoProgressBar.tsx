'use client';

import { useVideoStore } from '@/store/videoStore';

export default function VideoProgressBar() {
    const { currentTime, duration } = useVideoStore();

    // Guard against divide by zero or NaN showing up visually
    const safeDuration = duration > 0 ? duration : 1;
    const percentComplete = Math.min((currentTime / safeDuration) * 100, 100);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="video-progress-container mb-8">
            <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mb-2 font-mono tracking-wider">
                <span>{formatTime(currentTime)}</span>
                <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
            </div>
            <div className="w-full bg-[var(--color-border)] h-1.5 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[var(--color-accent)] transition-all duration-300 ease-out"
                    style={{ width: `${percentComplete}%` }}
                />
            </div>
        </div>
    );
}
