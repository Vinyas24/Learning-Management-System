import { Router } from 'express';
import { getStats } from './gamification.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/stats', getStats);

export default router;
