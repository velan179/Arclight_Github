/**
 * notFound.js — 404 handler for unmatched routes.
 * Must be registered AFTER all routes, BEFORE errorHandler.
 */

import { sendError } from '../utils/response.js';

export function notFound(req, res) {
  return sendError(
    res,
    'NOT_FOUND',
    `Route not found: ${req.method} ${req.path}`,
    404
  );
}

export default notFound;
