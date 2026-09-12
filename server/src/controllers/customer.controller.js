const { successResponse } = require('../utils/response');
const customerService = require('../services/customer');

const customerController = {
  getCustomerById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const customer = await customerService.getById(id);
      return successResponse(res, customer, 'Customer details retrieved');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = customerController;
