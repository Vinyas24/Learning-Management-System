export interface User {
    id: number;
    email: string;
    password_hash: string;
    name: string;
    role: 'student' | 'instructor' | 'admin';
    xp: number;
    current_streak: number;
    longest_streak: number;
    last_active_date: Date | null;
    created_at: Date;
    updated_at: Date;
}

export type UserPublic = Omit<User, 'password_hash'>;
