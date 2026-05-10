import { Request, Response, NextFunction } from 'express';
import * as videoService from './video.service';

// ── GET /api/videos/:videoId (auth) ──────────────────────────────
export const getVideo = async (
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

        const video = await videoService.getVideo(videoId, req.user!.id);

        res.json({ success: true, data: video });
    } catch (error) {
        next(error);
    }
};

// ── POST /api/videos (auth: instructor) ──────────────────────────
export const createVideo = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { section_id, title, description, youtube_url, order_index, duration_seconds } = req.body;
        if (!section_id || !title || !youtube_url) {
            res.status(400).json({ success: false, error: { message: 'section_id, title, and youtube_url are required' } });
            return;
        }

        const videoId = await videoService.createVideo(req.user!.id, req.user!.role, {
            section_id: parseInt(section_id),
            title,
            description,
            youtube_url,
            order_index: parseInt(order_index) || 0,
            duration_seconds: duration_seconds ? parseInt(duration_seconds) : undefined
        });
        res.status(201).json({ success: true, data: { id: videoId } });
    } catch (error) {
        next(error);
    }
};

// ── PUT /api/videos/:videoId (auth: instructor) ──────────────────
export const updateVideo = async (
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

        const { title, description, youtube_url, order_index, duration_seconds } = req.body;

        await videoService.updateVideo(req.user!.id, req.user!.role, videoId, { 
            title, 
            description, 
            youtube_url, 
            order_index: order_index !== undefined ? parseInt(order_index) : undefined,
            duration_seconds: duration_seconds !== undefined ? parseInt(duration_seconds) : undefined
        });
        res.json({ success: true, message: 'Video updated successfully' });
    } catch (error) {
        next(error);
    }
};

// ── DELETE /api/videos/:videoId (auth: instructor) ───────────────
export const deleteVideo = async (
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

        await videoService.deleteVideo(req.user!.id, req.user!.role, videoId);
        res.json({ success: true, message: 'Video deleted successfully' });
    } catch (error) {
        next(error);
    }
};
