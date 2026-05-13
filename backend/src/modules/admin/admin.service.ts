import db from '../../config/db';

export const getPlatformStats = async () => {
    const [totalUsers, totalStudents, totalInstructors, totalCourses, totalVideos, totalCertificates] =
        await Promise.all([
            db('users').count('id as count').first(),
            db('users').where({ role: 'student' }).count('id as count').first(),
            db('users').where({ role: 'instructor' }).count('id as count').first(),
            db('subjects').count('id as count').first(),
            db('videos').count('id as count').first(),
            db('certificates').count('id as count').first(),
        ]);

    return {
        totalUsers: Number(totalUsers?.count || 0),
        totalStudents: Number(totalStudents?.count || 0),
        totalInstructors: Number(totalInstructors?.count || 0),
        totalCourses: Number(totalCourses?.count || 0),
        totalVideos: Number(totalVideos?.count || 0),
        totalCertificates: Number(totalCertificates?.count || 0),
    };
};

export const getAllUsers = async () => {
    return db('users')
        .select('id', 'name', 'email', 'role', 'xp', 'current_streak', 'created_at')
        .orderBy('created_at', 'desc');
};

export const getAllInstructors = async () => {
    const instructors = await db('users')
        .where({ role: 'instructor' })
        .select('id', 'name', 'email', 'created_at');

    const result = await Promise.all(
        instructors.map(async (inst) => {
            const subjects = await db('subjects')
                .where({ instructor_id: inst.id })
                .select('id');

            const subjectIds = subjects.map((s) => s.id);
            let totalStudents = 0;

            if (subjectIds.length > 0) {
                const sections = await db('sections').whereIn('subject_id', subjectIds).select('id');
                const sectionIds = sections.map((s) => s.id);

                if (sectionIds.length > 0) {
                    const videos = await db('videos').whereIn('section_id', sectionIds).select('id');
                    const videoIds = videos.map((v) => v.id);

                    if (videoIds.length > 0) {
                        const res = await db('video_progress')
                            .whereIn('video_id', videoIds)
                            .countDistinct('user_id as count')
                            .first();
                        totalStudents = Number(res?.count || 0);
                    }
                }
            }

            return {
                ...inst,
                totalCourses: subjectIds.length,
                totalStudents,
            };
        })
    );

    return result;
};

export const getAllCourses = async () => {
    const subjects = await db('subjects')
        .leftJoin('users', 'subjects.instructor_id', 'users.id')
        .select(
            'subjects.id',
            'subjects.title',
            'subjects.slug',
            'subjects.is_published',
            'subjects.created_at',
            'users.name as instructor_name',
            'users.email as instructor_email'
        )
        .orderBy('subjects.created_at', 'desc');

    const result = await Promise.all(
        subjects.map(async (s) => {
            const sections = await db('sections').where({ subject_id: s.id }).select('id');
            const sectionIds = sections.map((sec) => sec.id);
            let enrolledStudents = 0;

            if (sectionIds.length > 0) {
                const videos = await db('videos').whereIn('section_id', sectionIds).select('id');
                const videoIds = videos.map((v) => v.id);
                if (videoIds.length > 0) {
                    const res = await db('video_progress')
                        .whereIn('video_id', videoIds)
                        .countDistinct('user_id as count')
                        .first();
                    enrolledStudents = Number(res?.count || 0);
                }
            }

            return { ...s, enrolledStudents };
        })
    );

    return result;
};
