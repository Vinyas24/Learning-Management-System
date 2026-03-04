import db from '../../config/db';
import * as videoRepo from './video.repository';
import * as sectionRepo from '../../modules/sections/section.repository';
import { flattenSubjectVideos, getPrevNextVideoIds } from '../../utils/ordering';
import { createApiError } from '../../middleware/errorHandler';

// ── Get Video with Navigation (auth) ─────────────────────────────
export const getVideo = async (videoId: number, userId: number) => {
    const video = await videoRepo.findById(videoId);
    if (!video) {
        throw createApiError('Video not found', 404);
    }

    // Get the section to find the subject
    const section = await db('sections').where({ id: video.section_id }).first();
    if (!section) {
        throw createApiError('Section not found', 404);
    }

    // Get the subject
    const subject = await db('subjects').where({ id: section.subject_id }).first();
    if (!subject) {
        throw createApiError('Subject not found', 404);
    }

    // Build the flat ordering for this subject
    const sections = await sectionRepo.findBySubjectId(section.subject_id);
    const sectionIds = sections.map((s) => s.id);
    const allVideos = await videoRepo.findBySectionIds(sectionIds);

    const sectionsWithVideos = sections.map((s) => ({
        id: s.id,
        order_index: s.order_index,
        videos: allVideos
            .filter((v) => v.section_id === s.id)
            .map((v) => ({ id: v.id, order_index: v.order_index })),
    }));

    const flatList = flattenSubjectVideos(sectionsWithVideos);
    const { prevId, nextId } = getPrevNextVideoIds(flatList, videoId);

    // Check lock status
    let locked = false;
    let unlockReason: string | null = null;

    if (prevId !== null) {
        const prevProgress = await db('video_progress')
            .where({ user_id: userId, video_id: prevId })
            .first();

        if (!prevProgress || !prevProgress.is_completed) {
            locked = true;
            unlockReason = 'Complete the previous video to unlock this one';
        }
    }

    return {
        id: video.id,
        title: video.title,
        description: video.description,
        youtube_url: video.youtube_url,
        order_index: video.order_index,
        duration_seconds: video.duration_seconds,
        section_id: section.id,
        section_title: section.title,
        subject_id: subject.id,
        subject_title: subject.title,
        previous_video_id: prevId,
        next_video_id: nextId,
        locked,
        unlock_reason: unlockReason,
    };
};
