import { Response } from 'express';

// ── Generic API Response Shape ─────────────────────────────────────────────
// Using a generic type T allows full type-safety for the data payload
// without resorting to `any`.

interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: unknown[]; // Validation error details — unknown is safer than any
}

/**
 * Sends a standardized success JSON response.
 * @param res     Express Response object
 * @param statusCode HTTP status code (2xx)
 * @param message  Human-readable success message
 * @param data     Optional payload to return to the client
 */
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): Response<SuccessResponse<T | undefined>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  } as SuccessResponse<T | undefined>);
};

/**
 * Sends a standardized error JSON response.
 * @param res       Express Response object
 * @param statusCode HTTP status code (4xx / 5xx)
 * @param message   Human-readable error message
 * @param errors    Optional array of validation or field-level errors
 */
export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: unknown[]
): Response<ErrorResponse> => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && errors.length > 0 && { errors }),
  } as ErrorResponse);
};
