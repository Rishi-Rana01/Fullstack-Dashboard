import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { sendError } from '../utils/apiResponse.utils';

// ── Custom Application Error ───────────────────────────────────────────────
// Allows controllers to throw typed errors with a specific HTTP status code.
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Marks it as a known, handled error
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized Express error-handling middleware.
 * Must be registered LAST — after all routes and other middleware.
 * Catches errors forwarded via next(error) from any controller.
 */
export const errorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any, // Express error middleware requires `any` for the error param
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log full error in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', error);
  }

  // ── Mongoose Validation Error (e.g., required fields missing) ────────────
  if (error instanceof MongooseError.ValidationError) {
    const errors = Object.values(error.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    sendError(res, 400, 'Validation failed.', errors);
    return;
  }

  // ── Mongoose CastError (e.g., invalid ObjectId format) ───────────────────
  if (error instanceof MongooseError.CastError) {
    sendError(res, 400, `Invalid value for field: ${error.path}`);
    return;
  }

  // ── MongoDB Duplicate Key Error (e.g., email already registered) ─────────
  // error.code 11000 is the MongoDB duplicate key error code
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue as Record<string, unknown>)[0];
    sendError(res, 409, `A record with that ${field} already exists.`);
    return;
  }

  // ── JWT Errors (handled in auth middleware but caught here as fallback) ───
  if (error.name === 'JsonWebTokenError') {
    sendError(res, 401, 'Invalid authentication token.');
    return;
  }

  if (error.name === 'TokenExpiredError') {
    sendError(res, 401, 'Session expired. Please log in again.');
    return;
  }

  // ── Known Operational AppError ────────────────────────────────────────────
  if (error instanceof AppError) {
    sendError(res, error.statusCode, error.message);
    return;
  }

  // ── Unhandled / Unknown Errors ────────────────────────────────────────────
  // Never expose internal error details to the client in production
  const message =
    process.env.NODE_ENV === 'development'
      ? (error as Error).message
      : 'An unexpected internal server error occurred.';

  sendError(res, 500, message);
};
