import { Router } from 'express';
import { getVideo } from './video.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.get('/:videoId', authMiddleware, getVideo);

export default router;
