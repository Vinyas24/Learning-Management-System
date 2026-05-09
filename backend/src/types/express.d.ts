declare namespace Express {
    interface Request {
        user?: {
            id: number;
            role: 'student' | 'instructor' | 'admin';
        };
    }
}
