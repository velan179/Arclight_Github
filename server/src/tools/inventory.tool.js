'use strict';
/**
 * Tool: inventory.check
 * Checks live stock availability for a product.
 * Respects isSimulatedFailure flag for demo scenarios.
 */

const Inventory = require('../models/Inventory');

/**
 * @param {Object} params
 * @param {string} params.productId
 * @param {boolean} [params.simulateFailure=false] — Forces stock=0 for demo
 * @returns {Promise<Object>} Structured tool observation
 */
async function execute({ productId, simulateFailure = false }) {
  try {
    const inventory = await Inventory.findOne({ productId });

    if (!inventory) {
      return {
        tool: 'inventory.check',
        status: 'FAILURE',
        data: null,
        summary: `No inventory record for product ${productId}`,
        errorCode: 'NOT_FOUND'
      };
    }

    // Controlled failure: either the DB flag or the request flag
    const forceFailure = simulateFailure || inventory.isSimulatedFailure;
    const effectiveStock = forceFailure ? 0 : inventory.stockLevel - inventory.reservedStock;
    const available = effectiveStock > 0;

    return {
      tool: 'inventory.check',
      status: 'SUCCESS',
      data: {
        productId: inventory.productId,
        sku: inventory.sku,
        stockLevel: inventory.stockLevel,
        reservedStock: inventory.reservedStock,
        availableStock: effectiveStock,
        warehouseLocation: inventory.warehouseLocation,
        restockDate: inventory.restockDate,
        isSimulatedFailure: forceFailure
      },
      summary: available
        ? `Replacement stock available: ${effectiveStock} units (SKU: ${inventory.sku})`
        : `Replacement stock UNAVAILABLE for SKU: ${inventory.sku}${forceFailure ? ' [simulated failure]' : ''}`,
      flags: available ? [] : ['STOCK_EMPTY']
    };
  } catch (err) {
    return {
      tool: 'inventory.check',
      status: 'FAILURE',
      data: null,
      summary: `Error checking inventory: ${err.message}`,
      errorCode: 'TOOL_EXECUTION_FAILED'
    };
  }
}

module.exports = { name: 'inventory.check', execute };
