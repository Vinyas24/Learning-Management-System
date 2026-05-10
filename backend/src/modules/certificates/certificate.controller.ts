import { Request, Response, NextFunction } from 'express';
import * as certificateService from './certificate.service';

export const claimCertificate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const subjectId = parseInt(req.params.subjectId as string);
        if (isNaN(subjectId)) {
            res.status(400).json({ success: false, error: { message: 'Invalid subject ID' } });
            return;
        }

        const cert = await certificateService.claimCertificate(req.user!.id, subjectId);
        res.json({ success: true, data: cert });
    } catch (error) {
        next(error);
    }
};

export const downloadCertificate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const subjectId = parseInt(req.params.subjectId as string);
        if (isNaN(subjectId)) {
            res.status(400).json({ success: false, error: { message: 'Invalid subject ID' } });
            return;
        }

        await certificateService.generateCertificatePDF(req.user!.id, subjectId, res);
    } catch (error) {
        next(error);
    }
};
