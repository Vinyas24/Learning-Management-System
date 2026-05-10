import db from '../../config/db';
import * as progressRepo from './progress.repository';
import { createApiError } from '../../middleware/errorHandler';

import { recordActivity } from '../gamification/gamification.service';

// ── Get video progress ───────────────────────────────────────────
export const getVideoProgress = async (userId: number, videoId: number) => {
    const progress = await progressRepo.findByUserAndVideo(userId, videoId);

    return {
        last_position_seconds: progress?.last_position_seconds ?? 0,
        is_completed: progress?.is_completed ?? false,
    };
};

// ── Update video progress (upsert) ──────────────────────────────
export const updateVideoProgress = async (
    userId: number,
    videoId: number,
    lastPositionSeconds: number,
    isCompleted?: boolean
) => {
    // Validate the video exists
    const video = await db('videos').where({ id: videoId }).first();
    if (!video) {
        throw createApiError('Video not found', 404);
    }

    // Cap position to duration if known
    let cappedPosition = Math.max(0, lastPositionSeconds);
    if (video.duration_seconds && cappedPosition > video.duration_seconds) {
        cappedPosition = video.duration_seconds;
    }

    const { newlyCompleted } = await progressRepo.upsert(userId, videoId, cappedPosition, isCompleted);

    if (newlyCompleted) {
        await recordActivity(userId, 10); // +10 XP for video completion
    }

    return { success: true };
};

// ── Get subject progress ─────────────────────────────────────────
export const getSubjectProgress = async (userId: number, subjectId: number) => {
    // Validate subject exists
    const subject = await db('subjects').where({ id: subjectId }).first();
    if (!subject) {
        throw createApiError('Subject not found', 404);
    }

    return progressRepo.getSubjectProgress(userId, subjectId);
};

// ── Get global resume video ──────────────────────────────────────────
export const getGlobalResume = async (userId: number) => {
    return progressRepo.getGlobalResume(userId);
};
