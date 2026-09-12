'use strict';
/**
 * Tool Registry — Member 2
 * Centralises all deterministic tool definitions and provides an execute() dispatcher.
 * The LLM selects tool names; this registry resolves them to implementation functions.
 */

const customerTool = require('./customer.tool');
const orderTool = require('./order.tool');
const inventoryTool = require('./inventory.tool');
const policyTool = require('./policy.tool');
const refundTool = require('./refund.tool');
const replacementTool = require('./replacement.tool');
const cancelTool = require('./cancel.tool');
const verificationTool = require('./verification.tool');

// ── Registry ────────────────────────────────────────────────────────────────

const _tools = [
  customerTool,
  orderTool,
  inventoryTool,
  policyTool,
  refundTool,
  replacementTool,
  cancelTool,
  verificationTool
];

const _registry = {};
for (const t of _tools) {
  _registry[t.name] = t;
}

// ── Public API ───────────────────────────────────────────────────────────────

const toolRegistry = {
  /**
   * List all registered tool definitions (for LLM context / UI display).
   */
  listTools: () => _tools.map(t => ({ name: t.name })),

  /**
   * Execute a tool by name with the given parameters.
   * Returns a structured observation object.
   *
   * @param {string} toolName
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  execute: async (toolName, params = {}) => {
    const tool = _registry[toolName];
    if (!tool) {
      return {
        tool: toolName,
        status: 'FAILURE',
        data: null,
        summary: `Unknown tool: "${toolName}"`,
        errorCode: 'TOOL_EXECUTION_FAILED'
      };
    }
    return tool.execute(params);
  },

  /**
   * Check if a tool name is registered.
   * @param {string} toolName
   * @returns {boolean}
   */
  hasTool: (toolName) => !!_registry[toolName],

  // Legacy shape kept for backward-compat with routes/controllers
  tools: {
    'customer.get':       { name: 'customer.get',       description: 'Retrieve customer account profile, tier, and history',        parameters: { customerId: 'string' } },
    'order.get':          { name: 'order.get',           description: 'Retrieve order details, delivery status, and items',          parameters: { orderId: 'string' } },
    'inventory.check':    { name: 'inventory.check',     description: 'Check stock availability for a replacement product',          parameters: { productId: 'string' } },
    'policy.evaluate':    { name: 'policy.evaluate',     description: 'Evaluate return, replacement, and refund eligibility',        parameters: { category: 'string', purchaseDate: 'string' } },
    'action.refund':      { name: 'action.refund',       description: 'Execute a verified monetary refund',                          parameters: { orderId: 'string', amount: 'number', reason: 'string' } },
    'action.replacement': { name: 'action.replacement',  description: 'Execute a product replacement order',                         parameters: { orderId: 'string', productId: 'string' } },
    'action.cancel':      { name: 'action.cancel',       description: 'Cancel an order that has not yet been delivered',             parameters: { orderId: 'string', reason: 'string' } },
    'verification.run':   { name: 'verification.run',    description: 'Verify resulting state of orders and financial transactions',  parameters: { runId: 'string' } }
  }
};

module.exports = toolRegistry;
