export interface User {
    id: number;
    email: string;
    password_hash: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export type UserPublic = Omit<User, 'password_hash'>;
