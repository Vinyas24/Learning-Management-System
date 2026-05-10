import db from '../../config/db';

export const getDashboardStats = async (instructorId: number) => {
    // Total courses authored by this instructor
    const subjects = await db('subjects').where({ instructor_id: instructorId });
    const totalCourses = subjects.length;

    // Get subject ids
    const subjectIds = subjects.map(s => s.id);

    let totalEnrolledStudents = 0;
    
    if (subjectIds.length > 0) {
        // Enrolled students are those who have watched at least one video in these subjects
        // Find sections
        const sections = await db('sections').whereIn('subject_id', subjectIds).select('id');
        const sectionIds = sections.map(s => s.id);

        if (sectionIds.length > 0) {
            const videos = await db('videos').whereIn('section_id', sectionIds).select('id');
            const videoIds = videos.map(v => v.id);

            if (videoIds.length > 0) {
                const result = await db('video_progress')
                    .whereIn('video_id', videoIds)
                    .countDistinct('user_id as count')
                    .first();
                
                totalEnrolledStudents = Number(result?.count || 0);
            }
        }
    }

    // Average rating / completion could go here in the future
    return {
        totalCourses,
        totalEnrolledStudents
    };
};
