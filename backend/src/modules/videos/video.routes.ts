import { Router } from 'express';
import { getVideo, createVideo, updateVideo, deleteVideo } from './video.controller';
import { authMiddleware, requireRole } from '../../middleware/authMiddleware';

const router = Router();

router.get('/:videoId', authMiddleware, getVideo);

const instructorMiddleware = [authMiddleware, requireRole(['instructor', 'admin'])];

router.post('/', instructorMiddleware, createVideo);
router.put('/:videoId', instructorMiddleware, updateVideo);
router.delete('/:videoId', instructorMiddleware, deleteVideo);

export default router;
