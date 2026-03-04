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
import videoRoutes from './modules/videos/video.routes';

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
app.use('/api/videos', videoRoutes);
// Future route mounts (added in subsequent phases):
// app.use('/api/progress', progressRoutes);

// ── Error Handler (must be last) ────────────────────────────────
app.use(errorHandler);

export default app;
