import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/user.model';
import { signToken } from '../utils/jwt.utils';
import { sendResponse, sendError } from '../utils/apiResponse.utils';
import { RegisterDTO, LoginDTO } from '../types/user.types';

// ── Auth Controller ────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Creates a new user account. Hashing is handled by the User model pre-save hook.
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 400, 'Validation failed.', errors.array());
      return;
    }

    const { name, email, password, role } = req.body as RegisterDTO;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(res, 409, 'An account with that email address already exists.');
      return;
    }

    const user = await User.create({ name, email, password, role });

    const token = signToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    sendResponse(res, 201, 'Account created successfully.', {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error); 
  }
};

/**
 * POST /api/auth/login
 * Authenticates an existing user and returns a JWT.
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 400, 'Validation failed.', errors.array());
      return;
    }

    const { email, password } = req.body as LoginDTO;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      sendError(res, 401, 'Invalid email or password.');
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      sendError(res, 401, 'Invalid email or password.');
      return;
    }

    const token = signToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    sendResponse(res, 200, 'Login successful.', {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile (requires valid JWT).
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      sendError(res, 404, 'User not found.');
      return;
    }

    sendResponse(res, 200, 'User profile retrieved.', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};
