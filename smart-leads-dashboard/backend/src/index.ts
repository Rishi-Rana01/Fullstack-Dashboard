import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import { errorHandler } from './middleware/error.middleware';


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT ?? 5000;
const FRONTEND_URL = (process.env.FRONTEND_URL ?? 'http://localhost:5173').trim().replace(/\/+$/, '');

app.use(helmet());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);


app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// ── 404 Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'The requested resource was not found.',
  });
});


app.use(errorHandler);


const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(
      `🚀 Server running in ${process.env.NODE_ENV ?? 'development'} mode on port ${PORT}`
    );
    console.log(`🔒 CORS origin: ${JSON.stringify(FRONTEND_URL)}`);
  });
};

startServer().catch((err: Error) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});

export default app;
