'use strict';
/**
 * Tool: order.get
 * Retrieves order details including delivery state and product info.
 */

const Order = require('../models/Order');

/**
 * @param {Object} params
 * @param {string} params.orderId
 * @returns {Promise<Object>} Structured tool observation
 */
async function execute({ orderId }) {
  try {
    const order = await Order.findOne({ orderId });

    if (!order) {
      return {
        tool: 'order.get',
        status: 'FAILURE',
        data: null,
        summary: `Order ${orderId} not found`,
        errorCode: 'NOT_FOUND'
      };
    }

    const now = new Date();
    const purchaseDate = new Date(order.purchaseDate);
    const daysSincePurchase = Math.floor((now - purchaseDate) / (1000 * 60 * 60 * 24));
    const isDelivered = order.status === 'DELIVERED';

    return {
      tool: 'order.get',
      status: 'SUCCESS',
      data: {
        orderId: order.orderId,
        customerId: order.customerId,
        productId: order.productId,
        productName: order.productName,
        amount: order.amount,
        status: order.status,
        purchaseDate: order.purchaseDate,
        deliveryDate: order.deliveryDate,
        daysSincePurchase
      },
      summary: `Order ${orderId} for "${order.productName}" — status: ${order.status}, ${daysSincePurchase} days since purchase`,
      flags: isDelivered ? [] : ['NOT_DELIVERED']
    };
  } catch (err) {
    return {
      tool: 'order.get',
      status: 'FAILURE',
      data: null,
      summary: `Error retrieving order: ${err.message}`,
      errorCode: 'TOOL_EXECUTION_FAILED'
    };
  }
}

module.exports = { name: 'order.get', execute };
