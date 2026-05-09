import { Router } from 'express';
import { getSubjectProgress, getVideoProgress, updateVideoProgress, getGlobalResume } from './progress.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

// All progress routes require auth
router.use(authMiddleware);

router.get('/subjects/:subjectId', getSubjectProgress);
router.get('/resume', getGlobalResume);
router.get('/videos/:videoId', getVideoProgress);
router.post('/videos/:videoId', updateVideoProgress);

export default router;
