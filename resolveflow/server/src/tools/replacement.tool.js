import actionsService from '../services/actions/actionsService.js';

export const replacementTool = {
  name: 'action.executeReplacement',
  description: 'Execute an automated product replacement dispatch order.',
  parameters: {
    type: 'object',
    properties: {
      caseId: { type: 'string' },
      runId: { type: 'string' },
      orderId: { type: 'string' },
      productId: { type: 'string' },
      idempotencyKey: { type: 'string' },
    },
    required: ['caseId', 'orderId', 'productId', 'idempotencyKey'],
  },
  async execute(params) {
    return await actionsService.executeReplacement(params);
  },
};

export default replacementTool;
