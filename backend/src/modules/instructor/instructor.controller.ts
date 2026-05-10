import { Request, Response, NextFunction } from 'express';
import * as instructorService from './instructor.service';

// ── GET /api/instructor/stats (auth: instructor) ─────────────────
export const getStats = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const stats = await instructorService.getDashboardStats(req.user!.id);
        res.json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};
