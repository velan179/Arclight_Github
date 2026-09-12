const { successResponse } = require('../utils/response');
const actionService = require('../services/actions');

const actionController = {
  refund: async (req, res, next) => {
    try {
      const result = await actionService.refund(req.body);
      return successResponse(res, result, 'Refund processed successfully', 200);
    } catch (error) {
      next(error);
    }
  },

  replacement: async (req, res, next) => {
    try {
      const result = await actionService.replacement(req.body);
      return successResponse(res, result, 'Replacement processed successfully', 200);
    } catch (error) {
      next(error);
    }
  },

  cancel: async (req, res, next) => {
    try {
      const result = await actionService.cancel(req.body);
      return successResponse(res, result, 'Order cancelled successfully', 200);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = actionController;
