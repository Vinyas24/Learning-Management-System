import db from '../../config/db';
import * as videoRepo from './video.repository';
import * as sectionRepo from '../../modules/sections/section.repository';
import * as subjectRepo from '../../modules/subjects/subject.repository';
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
        section: {
            id: section.id,
            title: section.title,
        },
        subject: {
            id: subject.id,
            title: subject.title,
        },
        prevVideoId: prevId,
        nextVideoId: nextId,
        locked,
        unlock_reason: unlockReason,
    };
};

// ── Instructor Video Management ────────────────────────────────────
export const createVideo = async (
    instructorId: number,
    userRole: string,
    data: { section_id: number; title: string; description?: string; youtube_url: string; order_index: number; duration_seconds?: number }
) => {
    const section = await sectionRepo.findById(data.section_id);
    if (!section) throw createApiError('Section not found', 404);

    const subject = await subjectRepo.findById(section.subject_id);
    if (!subject) throw createApiError('Subject not found', 404);

    if (userRole !== 'admin' && subject.instructor_id !== instructorId) {
        throw createApiError('Unauthorized to add videos to this section', 403);
    }

    const newVideo = {
        section_id: data.section_id,
        title: data.title,
        description: data.description || null,
        youtube_url: data.youtube_url,
        order_index: data.order_index,
        duration_seconds: data.duration_seconds || null
    };

    const id = await videoRepo.createVideo(newVideo);
    return id;
};

export const updateVideo = async (
    instructorId: number,
    userRole: string,
    videoId: number,
    data: { title?: string; description?: string; youtube_url?: string; order_index?: number; duration_seconds?: number }
) => {
    const video = await videoRepo.findById(videoId);
    if (!video) throw createApiError('Video not found', 404);

    const section = await sectionRepo.findById(video.section_id);
    if (!section) throw createApiError('Section not found', 404);

    const subject = await subjectRepo.findById(section.subject_id);
    if (!subject) throw createApiError('Subject not found', 404);

    if (userRole !== 'admin' && subject.instructor_id !== instructorId) {
        throw createApiError('Unauthorized to update this video', 403);
    }

    const updateData: any = { ...data };
    await videoRepo.updateVideo(videoId, updateData);
    return true;
};

export const deleteVideo = async (
    instructorId: number,
    userRole: string,
    videoId: number
) => {
    const video = await videoRepo.findById(videoId);
    if (!video) throw createApiError('Video not found', 404);

    const section = await sectionRepo.findById(video.section_id);
    if (!section) throw createApiError('Section not found', 404);

    const subject = await subjectRepo.findById(section.subject_id);
    if (!subject) throw createApiError('Subject not found', 404);

    if (userRole !== 'admin' && subject.instructor_id !== instructorId) {
        throw createApiError('Unauthorized to delete this video', 403);
    }

    await videoRepo.deleteVideo(videoId);
    return true;
};
