import { Request, Response, NextFunction } from 'express';
import * as progressService from './progress.service';

// ── GET /api/progress/subjects/:subjectId (auth) ─────────────────
export const getSubjectProgress = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const subjectId = parseInt(req.params.subjectId as string);
        if (isNaN(subjectId)) {
            res.status(400).json({ success: false, error: { message: 'Invalid subject ID' } });
            return;
        }

        const progress = await progressService.getSubjectProgress(req.user!.id, subjectId);

        res.json({ success: true, data: progress });
    } catch (error) {
        next(error);
    }
};

// ── GET /api/progress/videos/:videoId (auth) ─────────────────────
export const getVideoProgress = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const videoId = parseInt(req.params.videoId as string);
        if (isNaN(videoId)) {
            res.status(400).json({ success: false, error: { message: 'Invalid video ID' } });
            return;
        }

        const progress = await progressService.getVideoProgress(req.user!.id, videoId);

        res.json({ success: true, data: progress });
    } catch (error) {
        next(error);
    }
};

// ── POST /api/progress/videos/:videoId (auth) ────────────────────
export const updateVideoProgress = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const videoId = parseInt(req.params.videoId as string);
        if (isNaN(videoId)) {
            res.status(400).json({ success: false, error: { message: 'Invalid video ID' } });
            return;
        }

        const { last_position_seconds, is_completed } = req.body;

        if (last_position_seconds === undefined || typeof last_position_seconds !== 'number') {
            res.status(400).json({
                success: false,
                error: { message: 'last_position_seconds is required and must be a number' },
            });
            return;
        }

        const result = await progressService.updateVideoProgress(
            req.user!.id,
            videoId,
            last_position_seconds,
            is_completed
        );

        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};
