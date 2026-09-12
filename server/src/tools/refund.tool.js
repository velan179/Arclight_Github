'use strict';
/**
 * Tool: action.refund
 * Executes a verified monetary refund — updates Order status to REFUNDED.
 * Idempotency key prevents double-execution.
 */

const { v4: uuidv4 } = require('uuid');
const Action = require('../models/Action');
const Order = require('../models/Order');

/**
 * @param {Object} params
 * @param {string} params.caseId
 * @param {string} params.runId
 * @param {string} params.orderId
 * @param {number} params.amount
 * @param {string} params.reason
 * @param {string} [params.idempotencyKey]
 * @returns {Promise<Object>} Structured tool observation
 */
async function execute({ caseId, runId, orderId, amount, reason, idempotencyKey }) {
  const idemKey = idempotencyKey || `idem_ref_${caseId}_${Date.now()}`;

  try {
    // Idempotency: if action already exists, return existing record
    const existing = await Action.findOne({ idempotencyKey: idemKey });
    if (existing) {
      return {
        tool: 'action.refund',
        status: 'SUCCESS',
        data: {
          actionId: existing.actionId,
          type: 'REFUND',
          status: existing.status,
          amount: existing.amount,
          timestamp: existing.timestamp
        },
        summary: `Refund already processed (idempotent) — Action ${existing.actionId}`,
        flags: ['IDEMPOTENT_REPLAY']
      };
    }

    const actionId = `act_ref_${uuidv4().split('-')[0]}`;

    // Update order status
    await Order.findOneAndUpdate(
      { orderId },
      { status: 'REFUNDED' }
    );

    // Create action record
    const action = await Action.create({
      actionId,
      caseId,
      runId,
      type: 'REFUND',
      status: 'COMPLETED',
      amount,
      details: { reason, orderId },
      idempotencyKey: idemKey,
      timestamp: new Date()
    });

    return {
      tool: 'action.refund',
      status: 'SUCCESS',
      data: {
        actionId: action.actionId,
        type: 'REFUND',
        status: 'COMPLETED',
        amount,
        timestamp: action.timestamp
      },
      summary: `Refund of $${amount} processed successfully for order ${orderId}`,
      flags: []
    };
  } catch (err) {
    return {
      tool: 'action.refund',
      status: 'FAILURE',
      data: null,
      summary: `Refund execution failed: ${err.message}`,
      errorCode: 'TOOL_EXECUTION_FAILED'
    };
  }
}

module.exports = { name: 'action.refund', execute };
