import * as sectionRepo from './section.repository';
import * as subjectRepo from '../subjects/subject.repository';
import { createApiError } from '../../middleware/errorHandler';

export const createSection = async (
    instructorId: number,
    userRole: string,
    data: { subject_id: number; title: string; order_index: number }
) => {
    const subject = await subjectRepo.findById(data.subject_id);
    if (!subject) throw createApiError('Subject not found', 404);

    if (userRole !== 'admin' && subject.instructor_id !== instructorId) {
        throw createApiError('Unauthorized to add sections to this subject', 403);
    }

    const id = await sectionRepo.createSection(data);
    return id;
};

export const updateSection = async (
    instructorId: number,
    userRole: string,
    sectionId: number,
    data: { title?: string; order_index?: number }
) => {
    const section = await sectionRepo.findById(sectionId);
    if (!section) throw createApiError('Section not found', 404);

    const subject = await subjectRepo.findById(section.subject_id);
    if (!subject) throw createApiError('Subject not found', 404);

    if (userRole !== 'admin' && subject.instructor_id !== instructorId) {
        throw createApiError('Unauthorized to update this section', 403);
    }

    await sectionRepo.updateSection(sectionId, data);
    return true;
};

export const deleteSection = async (
    instructorId: number,
    userRole: string,
    sectionId: number
) => {
    const section = await sectionRepo.findById(sectionId);
    if (!section) throw createApiError('Section not found', 404);

    const subject = await subjectRepo.findById(section.subject_id);
    if (!subject) throw createApiError('Subject not found', 404);

    if (userRole !== 'admin' && subject.instructor_id !== instructorId) {
        throw createApiError('Unauthorized to delete this section', 403);
    }

    await sectionRepo.deleteSection(sectionId);
    return true;
};
