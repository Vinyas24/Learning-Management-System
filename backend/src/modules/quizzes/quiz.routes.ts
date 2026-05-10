import { Router } from 'express';
import { createQuiz, createQuestion, getSectionQuiz, submitQuiz, getInstructorQuiz } from './quiz.controller';
import { authMiddleware, requireRole } from '../../middleware/authMiddleware';

const router = Router();

// Instructor routes
router.post('/', authMiddleware, requireRole(['instructor', 'admin']), createQuiz);
router.post('/:quizId/questions', authMiddleware, requireRole(['instructor', 'admin']), createQuestion);
router.get('/:quizId/instructor', authMiddleware, requireRole(['instructor', 'admin']), getInstructorQuiz);

// Student routes
router.get('/section/:sectionId', authMiddleware, getSectionQuiz);
router.post('/:quizId/submit', authMiddleware, submitQuiz);

export default router;
