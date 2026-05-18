import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { registerValidator, loginValidator } from '../validators/auth.validator';

const router = Router();

// rate limiting

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,                   
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 minutes.',
  },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5,                    
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many accounts created from this IP. Please try again later.',
  },
});

// POST /api/auth/register  — Create a new account
router.post('/register', registerLimiter, registerValidator, register);

// POST /api/auth/login     — Authenticate and receive a JWT
router.post('/login', loginLimiter, loginValidator, login);

// GET  /api/auth/me        — Get the current authenticated user's profile
router.get('/me', authenticate, getMe);

export default router;
