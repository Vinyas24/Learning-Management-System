import * as quizRepository from './quiz.repository';
import { createApiError } from '../../middleware/errorHandler';

export const createQuiz = async (sectionId: number, title: string, passingScore: number) => {
    return quizRepository.createQuiz({ section_id: sectionId, title, passing_score: passingScore });
};

export const createQuestion = async (quizId: number, questionText: string, options: string[], correctAnswer: string, orderIndex: number) => {
    if (!options.includes(correctAnswer)) {
        throw createApiError('Correct answer must be one of the provided options', 400);
    }
    return quizRepository.createQuestion({
        quiz_id: quizId,
        question_text: questionText,
        options,
        correct_answer: correctAnswer,
        order_index: orderIndex
    });
};

export const getQuizForSection = async (sectionId: number, userId: number) => {
    const quiz = await quizRepository.getQuizBySectionId(sectionId);
    if (!quiz) return null;

    const questions = await quizRepository.getQuestionsByQuizId(quiz.id);
    const result = await quizRepository.getQuizResult(userId, quiz.id);

    // Strip out correct_answer for the student view
    const safeQuestions = questions.map(q => {
        const { correct_answer, ...safeQ } = q;
        return safeQ;
    });

    return {
        ...quiz,
        questions: safeQuestions,
        result: result || null
    };
};

export const submitQuiz = async (quizId: number, userId: number, answers: Record<number, string>) => {
    const quiz = await quizRepository.getQuizById(quizId);
    if (!quiz) throw createApiError('Quiz not found', 404);

    const questions = await quizRepository.getQuestionsByQuizId(quizId);
    if (questions.length === 0) {
        throw createApiError('Quiz has no questions', 400);
    }

    const existingResult = await quizRepository.getQuizResult(userId, quizId);
    if (existingResult?.passed) {
        throw createApiError('You have already passed this quiz and cannot submit it again.', 400);
    }
    
    let correctCount = 0;
    for (const q of questions) {
        if (answers[q.id] === q.correct_answer) {
            correctCount++;
        }
    }

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercentage >= quiz.passing_score;

    await quizRepository.saveQuizResult({
        user_id: userId,
        quiz_id: quizId,
        score: scorePercentage,
        passed
    });

    return {
        score: scorePercentage,
        passed,
        totalQuestions: questions.length,
        correctAnswers: correctCount
    };
};
