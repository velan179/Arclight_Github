const { errorResponse } = require('../utils/response');
const { ERROR_CODES } = require('../config/constants');

const notFound = (req, res) => {
  return errorResponse(
    res,
    ERROR_CODES.NOT_FOUND,
    `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`,
    404
  );
};

module.exports = notFound;
