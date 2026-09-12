import actionsService from '../services/actions/actionsService.js';

export const refundTool = {
  name: 'action.executeRefund',
  description: 'Issue a full or partial financial refund to the customer original payment method.',
  parameters: {
    type: 'object',
    properties: {
      caseId: { type: 'string' },
      runId: { type: 'string' },
      orderId: { type: 'string' },
      amount: { type: 'number' },
      reason: { type: 'string' },
      idempotencyKey: { type: 'string' },
    },
    required: ['caseId', 'orderId', 'idempotencyKey'],
  },
  async execute(params) {
    return await actionsService.executeRefund(params);
  },
};

export default refundTool;
