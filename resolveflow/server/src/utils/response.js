/**
 * response.js — Shared response helpers.
 * All API responses must use these helpers to ensure
 * a consistent response envelope across all modules.
 *
 * Success:  { success: true,  data: {},    message: "..." }
 * Error:    { success: false, error: { code, message } }
 */

/**
 * Send a successful response.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {string} [message]
 * @param {number} [status]
 */
export function sendSuccess(res, data = {}, message = 'Operation completed successfully', status = 200) {
  return res.status(status).json({
    success: true,
    data,
    message,
  });
}

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} code
 * @param {string} message
 * @param {number} [status]
 */
export function sendError(res, code, message, status = 500) {
  return res.status(status).json({
    success: false,
    error: { code, message },
  });
}

/**
 * Common error shortcuts
 */
export const errors = {
  notFound: (res, resource = 'Resource') =>
    sendError(res, 'NOT_FOUND', `${resource} not found`, 404),

  unauthorized: (res) =>
    sendError(res, 'UNAUTHORIZED', 'Authentication required', 401),

  forbidden: (res) =>
    sendError(res, 'FORBIDDEN', 'You do not have permission for this action', 403),

  validation: (res, message) =>
    sendError(res, 'VALIDATION_ERROR', message, 422),

  conflict: (res, message) =>
    sendError(res, 'CONFLICT', message, 409),

  internal: (res, message = 'An unexpected error occurred') =>
    sendError(res, 'INTERNAL_ERROR', message, 500),
};

export default { sendSuccess, sendError, errors };
