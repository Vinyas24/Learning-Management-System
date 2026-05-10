import { Router } from 'express';
import { createSection, updateSection, deleteSection } from './section.controller';
import { authMiddleware, requireRole } from '../../middleware/authMiddleware';

const router = Router();

const instructorMiddleware = [authMiddleware, requireRole(['instructor', 'admin'])];

router.post('/', instructorMiddleware, createSection);
router.put('/:sectionId', instructorMiddleware, updateSection);
router.delete('/:sectionId', instructorMiddleware, deleteSection);

export default router;
