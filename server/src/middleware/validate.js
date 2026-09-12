const { errorResponse } = require('../utils/response');
const { ERROR_CODES } = require('../config/constants');

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!parsed.success) {
      const errorMsg = parsed.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');

      return errorResponse(res, ERROR_CODES.INVALID_INPUT, errorMsg, 400);
    }

    req.validated = parsed.data;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validate;
