const { successResponse } = require('../utils/response');
const inventoryService = require('../services/inventory');

const inventoryController = {
  getInventoryByProductId: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const inventory = await inventoryService.getByProductId(productId);
      return successResponse(res, inventory, 'Inventory details retrieved');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = inventoryController;
