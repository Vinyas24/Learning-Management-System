import { Router } from 'express';
import { createQuiz, createQuestion, getSectionQuiz, submitQuiz } from './quiz.controller';
import { authMiddleware, requireRole } from '../../middleware/authMiddleware';

const router = Router();

// Instructor routes
router.post('/', authMiddleware, requireRole(['instructor', 'admin']), createQuiz);
router.post('/:quizId/questions', authMiddleware, requireRole(['instructor', 'admin']), createQuestion);

// Student routes
router.get('/section/:sectionId', authMiddleware, getSectionQuiz);
router.post('/:quizId/submit', authMiddleware, submitQuiz);

export default router;
