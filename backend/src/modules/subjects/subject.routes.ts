import { Router } from 'express';
import { listSubjects, getSubject, getSubjectTree, getFirstVideo } from './subject.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', listSubjects);
router.get('/:subjectId', getSubject);

// Auth-required routes
router.get('/:subjectId/tree', authMiddleware, getSubjectTree);
router.get('/:subjectId/first-video', authMiddleware, getFirstVideo);

export default router;
