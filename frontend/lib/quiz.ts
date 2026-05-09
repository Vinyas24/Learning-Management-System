import { apiClient } from './apiClient';

export interface Question {
    id: number;
    question_text: string;
    options: string[];
    order_index: number;
}

export interface Quiz {
    id: number;
    section_id: number;
    title: string;
    passing_score: number;
    questions: Question[];
    result: {
        id: number;
        score: number;
        passed: boolean;
    } | null;
}

export async function getQuizBySection(sectionId: number): Promise<Quiz | null> {
    const response = await apiClient<{ success: boolean; data: Quiz | null }>(`/api/quizzes/section/${sectionId}`);
    return response.data;
}

export async function submitQuiz(quizId: number, answers: Record<number, string>) {
    const response = await apiClient<{
        success: boolean;
        data: { score: number; passed: boolean; totalQuestions: number; correctAnswers: number };
    }>(`/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers })
    });
    return response.data;
}
