export interface Quiz {
    id: number;
    section_id: number;
    title: string;
    passing_score: number;
    created_at: Date;
    updated_at: Date;
}

export interface Question {
    id: number;
    quiz_id: number;
    question_text: string;
    options: string[]; // Typed as array, stored as JSON in DB
    correct_answer: string;
    order_index: number;
    created_at: Date;
    updated_at: Date;
}

export interface QuizResult {
    id: number;
    user_id: number;
    quiz_id: number;
    score: number;
    passed: boolean;
    created_at: Date;
    updated_at: Date;
}
