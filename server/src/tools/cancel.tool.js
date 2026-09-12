'use strict';
/**
 * Tool: action.cancel
 * Cancels an order if it hasn't been delivered yet.
 */

const { v4: uuidv4 } = require('uuid');
const Action = require('../models/Action');
const Order = require('../models/Order');

/**
 * @param {Object} params
 * @param {string} params.caseId
 * @param {string} params.runId
 * @param {string} params.orderId
 * @param {string} params.reason
 * @param {string} [params.idempotencyKey]
 * @returns {Promise<Object>} Structured tool observation
 */
async function execute({ caseId, runId, orderId, reason, idempotencyKey }) {
  const idemKey = idempotencyKey || `idem_can_${caseId}_${Date.now()}`;

  try {
    const existing = await Action.findOne({ idempotencyKey: idemKey });
    if (existing) {
      return {
        tool: 'action.cancel',
        status: 'SUCCESS',
        data: { actionId: existing.actionId, type: 'CANCELLATION', status: existing.status },
        summary: `Cancellation already processed (idempotent)`,
        flags: ['IDEMPOTENT_REPLAY']
      };
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return {
        tool: 'action.cancel',
        status: 'FAILURE',
        data: null,
        summary: `Order ${orderId} not found`,
        errorCode: 'NOT_FOUND'
      };
    }

    if (order.status === 'DELIVERED') {
      return {
        tool: 'action.cancel',
        status: 'FAILURE',
        data: { orderId, status: order.status },
        summary: `Cannot cancel — order ${orderId} already delivered`,
        errorCode: 'STATE_CONFLICT',
        flags: ['ALREADY_DELIVERED']
      };
    }

    await Order.findOneAndUpdate({ orderId }, { status: 'CANCELLED' });

    const actionId = `act_can_${uuidv4().split('-')[0]}`;
    const action = await Action.create({
      actionId,
      caseId,
      runId,
      type: 'CANCELLATION',
      status: 'COMPLETED',
      details: { reason, orderId },
      idempotencyKey: idemKey,
      timestamp: new Date()
    });

    return {
      tool: 'action.cancel',
      status: 'SUCCESS',
      data: { actionId: action.actionId, type: 'CANCELLATION', status: 'COMPLETED' },
      summary: `Order ${orderId} cancelled successfully`,
      flags: []
    };
  } catch (err) {
    return {
      tool: 'action.cancel',
      status: 'FAILURE',
      data: null,
      summary: `Cancellation failed: ${err.message}`,
      errorCode: 'TOOL_EXECUTION_FAILED'
    };
  }
}

module.exports = { name: 'action.cancel', execute };
