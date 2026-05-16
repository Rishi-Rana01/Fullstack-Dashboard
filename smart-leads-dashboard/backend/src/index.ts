import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import { errorHandler } from './middleware/error.middleware';

// Load environment variables from .env file before any other config reads
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT ?? 5000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';

// ── Security Middleware ────────────────────────────────────────────────────
// helmet sets security-relevant HTTP headers
app.use(helmet());

// CORS: only allow requests from the configured frontend origin
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, // Allow cookies/Authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Request Parsing ────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // Limit JSON body size to prevent DoS
app.use(express.urlencoded({ extended: true }));

// ── HTTP Request Logging ───────────────────────────────────────────────────
// Use 'dev' format in development, 'combined' in production
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Health Check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// ── 404 Handler ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'The requested resource was not found.',
  });
});

// ── Centralized Error Handler ──────────────────────────────────────────────
// Must be the LAST middleware registered — after all routes
app.use(errorHandler);

// ── Server Bootstrap ───────────────────────────────────────────────────────
const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(
      `🚀 Server running in ${process.env.NODE_ENV ?? 'development'} mode on port ${PORT}`
    );
  });
};

startServer().catch((err: Error) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});

export default app;
