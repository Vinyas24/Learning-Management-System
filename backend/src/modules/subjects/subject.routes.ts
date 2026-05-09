import { Router } from 'express';
import { listSubjects, getSubject, getSubjectTree, getFirstVideo } from './subject.controller';
import { authMiddleware, requireRole } from '../../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', listSubjects);
router.get('/:subjectId', getSubject);

// Auth-required routes
router.get('/:subjectId/tree', authMiddleware, getSubjectTree);
router.get('/:subjectId/first-video', authMiddleware, getFirstVideo);

// Instructor routes (Scaffold)
router.post('/', authMiddleware, requireRole(['instructor', 'admin']), (req, res) => {
    res.status(501).json({ success: false, message: 'Not implemented yet' });
});

export default router;
