import { Router } from 'express';
import { listSubjects, getSubject, getSubjectTree, getFirstVideo, getInstructorSubjects, createSubject, updateSubject, deleteSubject } from './subject.controller';
import { authMiddleware, requireRole } from '../../middleware/authMiddleware';

const router = Router();

// Instructor routes
const instructorMiddleware = [authMiddleware, requireRole(['instructor', 'admin'])];

router.get('/instructor/list', instructorMiddleware, getInstructorSubjects);
router.post('/', instructorMiddleware, createSubject);
router.put('/:subjectId', instructorMiddleware, updateSubject);
router.delete('/:subjectId', instructorMiddleware, deleteSubject);

// Public routes
router.get('/', listSubjects);
router.get('/:subjectId', getSubject);

// Auth-required routes
router.get('/:subjectId/tree', authMiddleware, getSubjectTree);
router.get('/:subjectId/first-video', authMiddleware, getFirstVideo);

export default router;
