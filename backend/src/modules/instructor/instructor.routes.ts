import { Router } from 'express';
import { getStats } from './instructor.controller';
import { authMiddleware, requireRole } from '../../middleware/authMiddleware';

const router = Router();

const instructorMiddleware = [authMiddleware, requireRole(['instructor', 'admin'])];

router.get('/stats', instructorMiddleware, getStats);

export default router;
