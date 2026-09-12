/**
 * Unified API Response Utility for ResolveFlow
 * Ensures 100% contract adherence across all endpoints.
 */

const successResponse = (res, data = {}, message = 'Operation completed successfully', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

const errorResponse = (res, code = 'INTERNAL_SERVER_ERROR', message = 'An error occurred', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
};

module.exports = {
  successResponse,
  errorResponse
};
