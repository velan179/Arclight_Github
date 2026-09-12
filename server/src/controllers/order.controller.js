const { successResponse } = require('../utils/response');
const orderService = require('../services/order');

const orderController = {
  getOrderById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await orderService.getById(id);
      return successResponse(res, order, 'Order details retrieved');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = orderController;
