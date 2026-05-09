import { Request, Response, NextFunction } from 'express';
import * as quizService from './quiz.service';

export const createQuiz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { sectionId, title, passingScore } = req.body;
        const quizId = await quizService.createQuiz(sectionId, title, passingScore || 50);
        res.status(201).json({ success: true, data: { quizId } });
    } catch (error) {
        next(error);
    }
};

export const createQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const quizId = parseInt(req.params.quizId);
        const { questionText, options, correctAnswer, orderIndex } = req.body;
        const questionId = await quizService.createQuestion(quizId, questionText, options, correctAnswer, orderIndex);
        res.status(201).json({ success: true, data: { questionId } });
    } catch (error) {
        next(error);
    }
};

export const getSectionQuiz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const sectionId = parseInt(req.params.sectionId);
        const userId = req.user!.id;
        const quiz = await quizService.getQuizForSection(sectionId, userId);
        res.json({ success: true, data: quiz }); // if null, data is null, which is handled by frontend
    } catch (error) {
        next(error);
    }
};

export const submitQuiz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const quizId = parseInt(req.params.quizId);
        const userId = req.user!.id;
        const { answers } = req.body; // Map<number, string> expected from frontend
        
        const result = await quizService.submitQuiz(quizId, userId, answers);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};
