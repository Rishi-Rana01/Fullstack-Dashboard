import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { registerValidator, loginValidator } from '../validators/auth.validator';

const router = Router();

// ── Auth Routes ────────────────────────────────────────────────────────────
// POST /api/auth/register  — Create a new account
router.post('/register', registerValidator, register);

// POST /api/auth/login     — Authenticate and receive a JWT
router.post('/login', loginValidator, login);

// GET  /api/auth/me        — Get the current authenticated user's profile
router.get('/me', authenticate, getMe);

export default router;
