import db from '../../config/db';

export interface VideoProgressRow {
    id: number;
    user_id: number;
    video_id: number;
    last_position_seconds: number;
    is_completed: boolean;
    completed_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

// ── Get progress for a single video ──────────────────────────────
export const findByUserAndVideo = async (
    userId: number,
    videoId: number
): Promise<VideoProgressRow | undefined> => {
    return db('video_progress')
        .where({ user_id: userId, video_id: videoId })
        .first();
};

// ── Upsert video progress ────────────────────────────────────────
export const upsert = async (
    userId: number,
    videoId: number,
    lastPositionSeconds: number,
    isCompleted?: boolean
): Promise<void> => {
    const existing = await findByUserAndVideo(userId, videoId);

    if (existing) {
        const update: Record<string, unknown> = {
            last_position_seconds: lastPositionSeconds,
            updated_at: new Date(),
        };

        if (isCompleted === true && !existing.is_completed) {
            update.is_completed = true;
            update.completed_at = new Date();
        }

        await db('video_progress')
            .where({ user_id: userId, video_id: videoId })
            .update(update);
    } else {
        await db('video_progress').insert({
            user_id: userId,
            video_id: videoId,
            last_position_seconds: lastPositionSeconds,
            is_completed: isCompleted || false,
            completed_at: isCompleted ? new Date() : null,
        });
    }
};

// ── Get subject-level progress aggregation ───────────────────────
export const getSubjectProgress = async (
    userId: number,
    subjectId: number
): Promise<{
    total_videos: number;
    completed_videos: number;
    percent_complete: number;
    last_video_id: number | null;
    last_position_seconds: number | null;
}> => {
    // Get all video IDs in this subject
    const videos = await db('videos')
        .join('sections', 'videos.section_id', 'sections.id')
        .where('sections.subject_id', subjectId)
        .select('videos.id as video_id');

    const totalVideos = videos.length;
    if (totalVideos === 0) {
        return {
            total_videos: 0,
            completed_videos: 0,
            percent_complete: 0,
            last_video_id: null,
            last_position_seconds: null,
        };
    }

    const videoIds = videos.map((v) => v.video_id);

    // Count completed
    const completedResult = await db('video_progress')
        .whereIn('video_id', videoIds)
        .andWhere('user_id', userId)
        .andWhere('is_completed', true)
        .count('* as count')
        .first();

    const completedVideos = Number(completedResult?.count || 0);

    // Get most recently updated progress (last watched video)
    const lastProgress = await db('video_progress')
        .whereIn('video_id', videoIds)
        .andWhere('user_id', userId)
        .orderBy('updated_at', 'desc')
        .first();

    return {
        total_videos: totalVideos,
        completed_videos: completedVideos,
        percent_complete: totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0,
        last_video_id: lastProgress?.video_id || null,
        last_position_seconds: lastProgress?.last_position_seconds || null,
    };
};
