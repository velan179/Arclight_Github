const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { errorResponse } = require('../utils/response');
const { ERROR_CODES } = require('../config/constants');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(
      res,
      ERROR_CODES.UNAUTHORIZED,
      'Authentication token required. Format: Bearer <token>',
      401
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return errorResponse(
      res,
      ERROR_CODES.UNAUTHORIZED,
      'Invalid or expired authentication token',
      401
    );
  }
};

module.exports = auth;
