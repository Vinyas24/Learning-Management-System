import db from '../../config/db';
import * as subjectRepo from './subject.repository';
import * as sectionRepo from '../../modules/sections/section.repository';
import * as videoRepo from '../../modules/videos/video.repository';
import { flattenSubjectVideos, getPrevNextVideoIds } from '../../utils/ordering';
import { createApiError } from '../../middleware/errorHandler';

// ── List Subjects (public) ───────────────────────────────────────
export const listSubjects = async (page: number, pageSize: number, q?: string) => {
    return subjectRepo.findAll(page, pageSize, q);
};

// ── Get Subject by ID (public) ───────────────────────────────────
export const getSubject = async (subjectId: number) => {
    const subject = await subjectRepo.findById(subjectId);
    if (!subject) {
        throw createApiError('Subject not found', 404);
    }
    return subject;
};

// ── Get Subject Tree (auth) ──────────────────────────────────────
// Returns sections with videos, each video annotated with is_completed and locked
export const getSubjectTree = async (subjectId: number, userId: number) => {
    const subject = await subjectRepo.findById(subjectId);
    if (!subject) {
        throw createApiError('Subject not found', 404);
    }

    const sections = await sectionRepo.findBySubjectId(subjectId);
    const sectionIds = sections.map((s) => s.id);
    const videos = await videoRepo.findBySectionIds(sectionIds);

    // Get user's completion status for all videos in this subject
    const videoIds = videos.map((v) => v.id);
    const progressRows = videoIds.length > 0
        ? await db('video_progress')
            .whereIn('video_id', videoIds)
            .andWhere('user_id', userId)
            .select('video_id', 'is_completed')
        : [];

    const completionMap = new Map<number, boolean>();
    for (const row of progressRows) {
        completionMap.set(row.video_id, row.is_completed);
    }

    // Build sections with videos for ordering
    const sectionsWithVideos = sections.map((section) => ({
        id: section.id,
        order_index: section.order_index,
        videos: videos
            .filter((v) => v.section_id === section.id)
            .map((v) => ({ id: v.id, order_index: v.order_index })),
    }));

    // Flatten to get global ordering
    const flatList = flattenSubjectVideos(sectionsWithVideos);

    // Build the tree response
    const tree = sections.map((section) => {
        const sectionVideos = videos
            .filter((v) => v.section_id === section.id)
            .sort((a, b) => a.order_index - b.order_index)
            .map((video) => {
                const isCompleted = completionMap.get(video.id) || false;

                // Determine if locked: previous video in global order must be completed
                const { prevId } = getPrevNextVideoIds(flatList, video.id);
                const locked = prevId !== null && !completionMap.get(prevId);

                return {
                    id: video.id,
                    title: video.title,
                    order_index: video.order_index,
                    duration_seconds: video.duration_seconds,
                    is_completed: isCompleted,
                    locked,
                };
            });

        return {
            id: section.id,
            title: section.title,
            order_index: section.order_index,
            videos: sectionVideos,
        };
    });

    return {
        id: subject.id,
        title: subject.title,
        sections: tree,
    };
};

// ── Get First Video (auth) ───────────────────────────────────────
// Returns the first unlocked video in the subject
export const getFirstVideo = async (subjectId: number, userId: number) => {
    const tree = await getSubjectTree(subjectId, userId);

    for (const section of tree.sections) {
        for (const video of section.videos) {
            if (!video.locked) {
                return { videoId: video.id };
            }
        }
    }

    // All completed or no videos — return the very first video
    const firstSection = tree.sections[0];
    if (firstSection && firstSection.videos[0]) {
        return { videoId: firstSection.videos[0].id };
    }

    throw createApiError('No videos found in this subject', 404);
};
