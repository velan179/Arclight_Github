/**
 * Tool Registry & Deterministic Tool Definitions
 * Primary Owner: Member 2
 *
 * Tools map LLM decisions to deterministic backend services.
 */

const toolRegistry = {
  tools: {
    'customer.get': {
      name: 'customer.get',
      description: 'Retrieve customer account profile, tier, and history',
      parameters: { customerId: 'string' }
    },
    'order.get': {
      name: 'order.get',
      description: 'Retrieve order details, delivery status, and items',
      parameters: { orderId: 'string' }
    },
    'inventory.check': {
      name: 'inventory.check',
      description: 'Check stock availability for a replacement product',
      parameters: { productId: 'string' }
    },
    'policy.evaluate': {
      name: 'policy.evaluate',
      description: 'Evaluate return, replacement, and refund policies',
      parameters: { category: 'string', purchaseDate: 'string' }
    },
    'action.refund': {
      name: 'action.refund',
      description: 'Execute a verified monetary refund',
      parameters: { orderId: 'string', amount: 'number', reason: 'string' }
    },
    'action.replacement': {
      name: 'action.replacement',
      description: 'Execute a product replacement order',
      parameters: { orderId: 'string', productId: 'string' }
    },
    'verification.run': {
      name: 'verification.run',
      description: 'Verify resulting state of orders and financial transactions',
      parameters: { runId: 'string' }
    }
  },

  listTools: () => {
    return Object.values(toolRegistry.tools);
  }
};

module.exports = toolRegistry;
