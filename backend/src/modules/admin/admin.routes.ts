import { Router } from 'express';
import { getStats, getUsers, getInstructors, getCourses } from './admin.controller';
import { authMiddleware, requireRole } from '../../middleware/authMiddleware';

const router = Router();

// All admin routes require admin role
router.use(authMiddleware, requireRole(['admin']));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/instructors', getInstructors);
router.get('/courses', getCourses);

export default router;
