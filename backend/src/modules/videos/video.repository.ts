import db from '../../config/db';

export interface VideoRow {
    id: number;
    section_id: number;
    title: string;
    description: string | null;
    youtube_url: string;
    order_index: number;
    duration_seconds: number | null;
    created_at: Date;
    updated_at: Date;
}

export const findBySectionId = async (sectionId: number): Promise<VideoRow[]> => {
    return db('videos')
        .where({ section_id: sectionId })
        .orderBy('order_index', 'asc');
};

export const findById = async (videoId: number): Promise<VideoRow | undefined> => {
    return db('videos').where({ id: videoId }).first();
};

export const findBySectionIds = async (sectionIds: number[]): Promise<VideoRow[]> => {
    if (sectionIds.length === 0) return [];
    return db('videos')
        .whereIn('section_id', sectionIds)
        .orderBy('section_id', 'asc')
        .orderBy('order_index', 'asc');
};
