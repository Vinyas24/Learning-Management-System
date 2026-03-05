'use client';

import { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeProps, YouTubePlayer } from 'react-youtube';
import { useVideoStore } from '@/store/videoStore';
import { sendProgress } from '@/lib/progress';

interface VideoPlayerProps {
    videoId: number;
    youtubeUrl: string;
    initialPosition: number;
    onComplete: () => void;
}

function extractYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export default function VideoPlayer({
    videoId,
    youtubeUrl,
    initialPosition,
    onComplete
}: VideoPlayerProps) {
    const { setVideo } = useVideoStore();
    const playerRef = useRef<YouTubePlayer | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [ytId, setYtId] = useState<string | null>(null);

    useEffect(() => {
        const id = extractYouTubeId(youtubeUrl);
        setYtId(id);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [youtubeUrl]);

    const startProgressTracking = (player: YouTubePlayer) => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(async () => {
            const currentTime = await player.getCurrentTime();
            setVideo({ currentTime, isPlaying: true });

            // Debounced network call
            sendProgress(videoId, { last_position_seconds: currentTime });
        }, 2000);
    };

    const stopProgressTracking = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setVideo({ isPlaying: false });
    };

    const onReady: YouTubeProps['onReady'] = (event) => {
        playerRef.current = event.target;
        // Seek to last saved position and set duration
        event.target.seekTo(initialPosition, true);
        setVideo({ duration: event.target.getDuration() });
    };

    const onStateChange: YouTubeProps['onStateChange'] = (event) => {
        // 1 = Playing, 2 = Paused, 0 = Ended
        if (event.data === 1) {
            startProgressTracking(event.target);
        } else {
            stopProgressTracking();

            if (event.data === 0) {
                onComplete();
            }
        }
    };

    if (!ytId) {
        return (
            <div className="video-player-error">
                Invalid YouTube URL: {youtubeUrl}
            </div>
        );
    }

    const opts: YouTubeProps['opts'] = {
        width: '100%',
        height: '100%',
        playerVars: {
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
        },
    };

    return (
        <div className="video-player-wrapper">
            <YouTube
                videoId={ytId}
                opts={opts}
                onReady={onReady}
                onStateChange={onStateChange}
                className="youtube-container"
                iframeClassName="youtube-iframe"
            />
        </div>
    );
}
