/**
 * errorHandler.js — Global Express error middleware.
 * Must be registered LAST in app.js (after all routes).
 */

import { sendError } from '../utils/response.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return sendError(res, 'VALIDATION_ERROR', err.message, 422);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern ?? {})[0] ?? 'field';
    return sendError(res, 'CONFLICT', `Duplicate value for ${field}`, 409);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'UNAUTHORIZED', 'Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'UNAUTHORIZED', 'Token expired', 401);
  }

  // Generic / unhandled
  const status = err.status ?? err.statusCode ?? 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'An unexpected error occurred'
      : err.message ?? 'An unexpected error occurred';

  return sendError(res, 'INTERNAL_ERROR', message, status);
}

export default errorHandler;
