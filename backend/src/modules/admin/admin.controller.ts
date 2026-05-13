import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service';

export const getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await adminService.getPlatformStats();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await adminService.getAllUsers();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const getInstructors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await adminService.getAllInstructors();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const getCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await adminService.getAllCourses();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};
