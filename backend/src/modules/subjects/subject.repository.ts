import db from '../../config/db';

export interface SubjectRow {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    is_published: boolean;
    instructor_id: number | null;
    image_url: string | null;
    created_at: Date;
    updated_at: Date;
}

export const findAll = async (
    page: number,
    pageSize: number,
    q?: string
): Promise<{ subjects: SubjectRow[]; total: number }> => {
    const query = db('subjects').where('is_published', true);

    if (q && q.trim()) {
        query.andWhere((builder) => {
            builder
                .where('title', 'like', `%${q.trim()}%`)
                .orWhere('description', 'like', `%${q.trim()}%`);
        });
    }

    const countResult = await query.clone().count('* as total').first();
    const total = Number(countResult?.total || 0);

    const subjects = await query
        .select('*')
        .orderBy('created_at', 'desc')
        .limit(pageSize)
        .offset((page - 1) * pageSize);

    return { subjects, total };
};

export const findById = async (id: number): Promise<SubjectRow | undefined> => {
    return db('subjects').where({ id }).first();
};

export const findBySlug = async (slug: string): Promise<SubjectRow | undefined> => {
    return db('subjects').where({ slug }).first();
};

export const findByInstructorId = async (instructorId: number): Promise<SubjectRow[]> => {
    return db('subjects')
        .where({ instructor_id: instructorId })
        .orderBy('created_at', 'desc');
};

export const createSubject = async (
    data: Omit<SubjectRow, 'id' | 'created_at' | 'updated_at'>
): Promise<number> => {
    const [id] = await db('subjects').insert(data);
    return id;
};

export const updateSubject = async (
    id: number,
    data: Partial<Omit<SubjectRow, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> => {
    const updated = await db('subjects').where({ id }).update(data);
    return updated > 0;
};

export const deleteSubject = async (id: number): Promise<boolean> => {
    const deleted = await db('subjects').where({ id }).delete();
    return deleted > 0;
};
