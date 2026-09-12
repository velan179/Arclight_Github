const { errorResponse } = require('../utils/response');
const { ERROR_CODES } = require('../config/constants');
const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error(`Unhandled Request Error: ${err.message}`, {
    path: req.originalUrl,
    method: req.method
  });

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || ERROR_CODES.INTERNAL_SERVER_ERROR;
  const message = err.message || 'An unexpected internal error occurred';

  return errorResponse(res, errorCode, message, statusCode);
};

module.exports = errorHandler;
