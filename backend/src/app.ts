import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/security';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import healthRoutes from './modules/health/health.routes';
import authRoutes from './modules/auth/auth.routes';
import subjectRoutes from './modules/subjects/subject.routes';
import sectionRoutes from './modules/sections/section.routes';
import videoRoutes from './modules/videos/video.routes';
import progressRoutes from './modules/progress/progress.routes';
import quizRoutes from './modules/quizzes/quiz.routes';
import certificateRoutes from './modules/certificates/certificate.routes';
import gamificationRoutes from './modules/gamification/gamification.routes';
import instructorRoutes from './modules/instructor/instructor.routes';

const app = express();

// ── Core Middleware ──────────────────────────────────────────────
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// ── API Routes ──────────────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/instructor', instructorRoutes);

// ── Error Handler (must be last) ────────────────────────────────
app.use(errorHandler);

export default app;
