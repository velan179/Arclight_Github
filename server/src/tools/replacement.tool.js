'use strict';
/**
 * Tool: action.replacement
 * Executes a product replacement — decrements inventory and creates replacement action.
 * Returns FAILURE with INSUFFICIENT_STOCK if stock unavailable.
 */

const { v4: uuidv4 } = require('uuid');
const Action = require('../models/Action');
const Inventory = require('../models/Inventory');

/**
 * @param {Object} params
 * @param {string} params.caseId
 * @param {string} params.runId
 * @param {string} params.orderId
 * @param {string} params.productId
 * @param {boolean} [params.simulateFailure=false]
 * @param {string} [params.idempotencyKey]
 * @returns {Promise<Object>} Structured tool observation
 */
async function execute({ caseId, runId, orderId, productId, simulateFailure = false, idempotencyKey }) {
  const idemKey = idempotencyKey || `idem_rep_${caseId}_${Date.now()}`;

  try {
    // Idempotency check
    const existing = await Action.findOne({ idempotencyKey: idemKey });
    if (existing) {
      return {
        tool: 'action.replacement',
        status: existing.status === 'COMPLETED' ? 'SUCCESS' : 'FAILURE',
        data: {
          actionId: existing.actionId,
          type: 'REPLACEMENT',
          status: existing.status
        },
        summary: `Replacement already processed (idempotent) — Action ${existing.actionId}`,
        flags: ['IDEMPOTENT_REPLAY']
      };
    }

    // Stock check
    const inventory = await Inventory.findOne({ productId });
    if (!inventory) {
      return {
        tool: 'action.replacement',
        status: 'FAILURE',
        data: null,
        summary: `No inventory record for product ${productId}`,
        errorCode: 'NOT_FOUND'
      };
    }

    const forceFailure = simulateFailure || inventory.isSimulatedFailure;
    const availableStock = forceFailure ? 0 : inventory.stockLevel - inventory.reservedStock;

    if (availableStock <= 0) {
      return {
        tool: 'action.replacement',
        status: 'FAILURE',
        data: {
          productId,
          sku: inventory.sku,
          stockLevel: inventory.stockLevel,
          availableStock: 0,
          isSimulatedFailure: forceFailure
        },
        summary: `Replacement FAILED — insufficient stock for product ${productId} (SKU: ${inventory.sku})${forceFailure ? ' [simulated]' : ''}`,
        errorCode: 'INSUFFICIENT_STOCK',
        flags: ['STOCK_EMPTY']
      };
    }

    // Decrement stock
    await Inventory.findOneAndUpdate(
      { productId },
      { $inc: { reservedStock: 1 }, updatedAt: new Date() }
    );

    const actionId = `act_rep_${uuidv4().split('-')[0]}`;
    const action = await Action.create({
      actionId,
      caseId,
      runId,
      type: 'REPLACEMENT',
      status: 'COMPLETED',
      details: { orderId, productId, sku: inventory.sku },
      idempotencyKey: idemKey,
      timestamp: new Date()
    });

    return {
      tool: 'action.replacement',
      status: 'SUCCESS',
      data: {
        actionId: action.actionId,
        type: 'REPLACEMENT',
        status: 'COMPLETED',
        productId,
        sku: inventory.sku,
        timestamp: action.timestamp
      },
      summary: `Replacement dispatched for product ${productId} (SKU: ${inventory.sku})`,
      flags: []
    };
  } catch (err) {
    return {
      tool: 'action.replacement',
      status: 'FAILURE',
      data: null,
      summary: `Replacement execution failed: ${err.message}`,
      errorCode: 'TOOL_EXECUTION_FAILED'
    };
  }
}

module.exports = { name: 'action.replacement', execute };
