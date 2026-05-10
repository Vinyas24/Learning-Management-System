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

export const findById = async (id: number): Promise<SectionRow | undefined> => {
    return db('sections').where({ id }).first();
};

export const createSection = async (data: Omit<SectionRow, 'id' | 'created_at' | 'updated_at'>): Promise<number> => {
    const [id] = await db('sections').insert(data);
    return id;
};

export const updateSection = async (id: number, data: Partial<Omit<SectionRow, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> => {
    const updated = await db('sections').where({ id }).update(data);
    return updated > 0;
};

export const deleteSection = async (id: number): Promise<boolean> => {
    const deleted = await db('sections').where({ id }).delete();
    return deleted > 0;
};
