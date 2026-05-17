import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import errorMiddleware from './middlewares/error.middleware';

const app: Application = express();

// CORS
app.use(cors({
  origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  credentials: true,
}));

// Request logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Smart Leads API is running.' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Global error handler (must be last)
app.use(errorMiddleware);

export default app;
