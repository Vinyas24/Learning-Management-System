import { Request, Response, NextFunction } from 'express';
import * as videoService from './video.service';

// ── GET /api/videos/:videoId (auth) ──────────────────────────────
export const getVideo = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const videoId = parseInt(req.params.videoId);
        if (isNaN(videoId)) {
            res.status(400).json({ success: false, error: { message: 'Invalid video ID' } });
            return;
        }

        const video = await videoService.getVideo(videoId, req.user!.id);

        res.json({ success: true, data: video });
    } catch (error) {
        next(error);
    }
};
