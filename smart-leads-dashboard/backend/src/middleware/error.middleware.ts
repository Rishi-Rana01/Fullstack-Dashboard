import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { sendError } from '../utils/apiResponse.utils';


export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; 
    Error.captureStackTrace(this, this.constructor);
  }
}


export const errorHandler = (

  error: any, 
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', error);
  }
  if (error instanceof MongooseError.ValidationError) {
    const errors = Object.values(error.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    sendError(res, 400, 'Validation failed.', errors);
    return;
  }

  if (error instanceof MongooseError.CastError) {
    sendError(res, 400, `Invalid value for field: ${error.path}`);
    return;
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue as Record<string, unknown>)[0];
    sendError(res, 409, `A record with that ${field} already exists.`);
    return;
  }

  if (error.name === 'JsonWebTokenError') {
    sendError(res, 401, 'Invalid authentication token.');
    return;
  }

  if (error.name === 'TokenExpiredError') {
    sendError(res, 401, 'Session expired. Please log in again.');
    return;
  }

  if (error instanceof AppError) {
    sendError(res, error.statusCode, error.message);
    return;
  }
  const message =
    process.env.NODE_ENV === 'development'
      ? (error as Error).message
      : 'An unexpected internal server error occurred.';

  sendError(res, 500, message);
};
