import { Request, Response, NextFunction } from 'express';
import * as subjectService from './subject.service';

// ── GET /api/subjects (public) ───────────────────────────────────
export const listSubjects = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 10));
        const q = req.query.q as string | undefined;

        const result = await subjectService.listSubjects(page, pageSize, q);

        res.json({
            success: true,
            data: result.subjects,
            pagination: {
                page,
                pageSize,
                total: result.total,
                totalPages: Math.ceil(result.total / pageSize),
            },
        });
    } catch (error) {
        next(error);
    }
};

// ── GET /api/subjects/:subjectId (public/auth) ───────────────────
export const getSubject = async (
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

        const subject = await subjectService.getSubject(subjectId);

        res.json({ success: true, data: subject });
    } catch (error) {
        next(error);
    }
};

// ── GET /api/subjects/:subjectId/tree (auth) ─────────────────────
export const getSubjectTree = async (
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

        const tree = await subjectService.getSubjectTree(subjectId, req.user!.id);

        res.json({ success: true, data: tree });
    } catch (error) {
        next(error);
    }
};

// ── GET /api/subjects/:subjectId/first-video (auth) ──────────────
export const getFirstVideo = async (
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

        const result = await subjectService.getFirstVideo(subjectId, req.user!.id);

        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

// ── GET /api/subjects/instructor/list (auth: instructor) ─────────
export const getInstructorSubjects = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const subjects = await subjectService.getInstructorSubjects(req.user!.id);
        res.json({ success: true, data: subjects });
    } catch (error) {
        next(error);
    }
};

// ── POST /api/subjects (auth: instructor) ────────────────────────
export const createSubject = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { title, slug, description, image_url } = req.body;
        if (!title || !slug) {
            res.status(400).json({ success: false, error: { message: 'Title and slug are required' } });
            return;
        }

        const subjectId = await subjectService.createSubject(req.user!.id, { title, slug, description, image_url });
        res.status(201).json({ success: true, data: { id: subjectId } });
    } catch (error) {
        next(error);
    }
};

// ── PUT /api/subjects/:subjectId (auth: instructor) ──────────────
export const updateSubject = async (
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

        const { title, slug, description, image_url, is_published } = req.body;

        await subjectService.updateSubject(req.user!.id, req.user!.role, subjectId, { title, slug, description, image_url, is_published });
        res.json({ success: true, message: 'Subject updated successfully' });
    } catch (error) {
        next(error);
    }
};

// ── DELETE /api/subjects/:subjectId (auth: instructor) ───────────
export const deleteSubject = async (
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

        await subjectService.deleteSubject(req.user!.id, req.user!.role, subjectId);
        res.json({ success: true, message: 'Subject deleted successfully' });
    } catch (error) {
        next(error);
    }
};
