import { Request, Response, NextFunction } from 'express';
import { getUserGamificationStats } from './gamification.service';

export const getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const stats = await getUserGamificationStats(req.user!.id);
        res.json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};
