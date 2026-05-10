import { Request, Response, NextFunction } from 'express';
import * as sectionService from './section.service';

// ── POST /api/sections (auth: instructor) ────────────────────────
export const createSection = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { subject_id, title, order_index } = req.body;
        if (!subject_id || !title) {
            res.status(400).json({ success: false, error: { message: 'subject_id and title are required' } });
            return;
        }

        const sectionId = await sectionService.createSection(req.user!.id, req.user!.role, {
            subject_id: parseInt(subject_id),
            title,
            order_index: parseInt(order_index) || 0
        });
        res.status(201).json({ success: true, data: { id: sectionId } });
    } catch (error) {
        next(error);
    }
};

// ── PUT /api/sections/:sectionId (auth: instructor) ──────────────
export const updateSection = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const sectionId = parseInt(req.params.sectionId as string);
        if (isNaN(sectionId)) {
            res.status(400).json({ success: false, error: { message: 'Invalid section ID' } });
            return;
        }

        const { title, order_index } = req.body;

        await sectionService.updateSection(req.user!.id, req.user!.role, sectionId, { 
            title, 
            order_index: order_index !== undefined ? parseInt(order_index) : undefined 
        });
        res.json({ success: true, message: 'Section updated successfully' });
    } catch (error) {
        next(error);
    }
};

// ── DELETE /api/sections/:sectionId (auth: instructor) ───────────
export const deleteSection = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const sectionId = parseInt(req.params.sectionId as string);
        if (isNaN(sectionId)) {
            res.status(400).json({ success: false, error: { message: 'Invalid section ID' } });
            return;
        }

        await sectionService.deleteSection(req.user!.id, req.user!.role, sectionId);
        res.json({ success: true, message: 'Section deleted successfully' });
    } catch (error) {
        next(error);
    }
};
