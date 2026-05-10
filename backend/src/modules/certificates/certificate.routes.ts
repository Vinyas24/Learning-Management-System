import { Router } from 'express';
import { claimCertificate, downloadCertificate } from './certificate.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/:subjectId/claim', claimCertificate);
router.get('/:subjectId/download', downloadCertificate);

export default router;
