import db from '../../config/db';
import { Quiz, Question, QuizResult } from './quiz.model';

export const createQuiz = async (quizData: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>): Promise<number> => {
    const [id] = await db('quizzes').insert(quizData);
    return id;
};

export const createQuestion = async (questionData: Omit<Question, 'id' | 'created_at' | 'updated_at'>): Promise<number> => {
    const [id] = await db('questions').insert({
        ...questionData,
        options: JSON.stringify(questionData.options),
    });
    return id;
};

export const getQuizBySectionId = async (sectionId: number): Promise<Quiz | undefined> => {
    return db('quizzes').where({ section_id: sectionId }).first();
};

export const getQuizById = async (quizId: number): Promise<Quiz | undefined> => {
    return db('quizzes').where({ id: quizId }).first();
};

export const getQuestionsByQuizId = async (quizId: number): Promise<Question[]> => {
    const rows = await db('questions').where({ quiz_id: quizId }).orderBy('order_index', 'asc');
    return rows.map((row: any) => ({
        ...row,
        options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
    }));
};

export const saveQuizResult = async (resultData: Omit<QuizResult, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
    const existing = await db('quiz_results').where({ user_id: resultData.user_id, quiz_id: resultData.quiz_id }).first();
    if (existing) {
        // If they already passed, maybe we don't downgrade their pass status, but let's just update for now
        await db('quiz_results')
            .where({ id: existing.id })
            .update({ score: resultData.score, passed: resultData.passed, updated_at: new Date() });
    } else {
        await db('quiz_results').insert(resultData);
    }
};

export const getQuizResult = async (userId: number, quizId: number): Promise<QuizResult | undefined> => {
    return db('quiz_results').where({ user_id: userId, quiz_id: quizId }).first();
};
