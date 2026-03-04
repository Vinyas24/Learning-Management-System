import db from '../../config/db';

export interface SectionRow {
    id: number;
    subject_id: number;
    title: string;
    order_index: number;
    created_at: Date;
    updated_at: Date;
}

export const findBySubjectId = async (subjectId: number): Promise<SectionRow[]> => {
    return db('sections')
        .where({ subject_id: subjectId })
        .orderBy('order_index', 'asc');
};
