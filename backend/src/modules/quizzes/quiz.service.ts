import * as quizRepository from './quiz.repository';
import * as sectionRepo from '../../modules/sections/section.repository';
import * as subjectRepo from '../../modules/subjects/subject.repository';
import { createApiError } from '../../middleware/errorHandler';

export const createQuiz = async (instructorId: number, userRole: string, sectionId: number, title: string, passingScore: number) => {
    const section = await sectionRepo.findById(sectionId);
    if (!section) throw createApiError('Section not found', 404);

    const subject = await subjectRepo.findById(section.subject_id);
    if (!subject) throw createApiError('Subject not found', 404);

    if (userRole !== 'admin' && subject.instructor_id !== instructorId) {
        throw createApiError('Unauthorized to add quizzes to this section', 403);
    }

    return quizRepository.createQuiz({ section_id: sectionId, title, passing_score: passingScore });
};

export const createQuestion = async (instructorId: number, userRole: string, quizId: number, questionText: string, options: string[], correctAnswer: string, orderIndex: number) => {
    const quiz = await quizRepository.getQuizById(quizId);
    if (!quiz) throw createApiError('Quiz not found', 404);

    const section = await sectionRepo.findById(quiz.section_id);
    if (!section) throw createApiError('Section not found', 404);

    const subject = await subjectRepo.findById(section.subject_id);
    if (!subject) throw createApiError('Subject not found', 404);

    if (userRole !== 'admin' && subject.instructor_id !== instructorId) {
        throw createApiError('Unauthorized to add questions to this quiz', 403);
    }

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

export const getQuizForInstructor = async (instructorId: number, userRole: string, quizId: number) => {
    const quiz = await quizRepository.getQuizById(quizId);
    if (!quiz) throw createApiError('Quiz not found', 404);

    const section = await sectionRepo.findById(quiz.section_id);
    if (!section) throw createApiError('Section not found', 404);

    const subject = await subjectRepo.findById(section.subject_id);
    if (!subject) throw createApiError('Subject not found', 404);

    if (userRole !== 'admin' && subject.instructor_id !== instructorId) {
        throw createApiError('Unauthorized to view this quiz', 403);
    }

    const questions = await quizRepository.getQuestionsByQuizId(quiz.id);
    
    return {
        ...quiz,
        questions // Do not strip correct_answer so the instructor can see it
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

    if (passed) {
        const { recordActivity } = await import('../gamification/gamification.service');
        await recordActivity(userId, 50);
    }

    return {
        score: scorePercentage,
        passed,
        totalQuestions: questions.length,
        correctAnswers: correctCount
    };
};
