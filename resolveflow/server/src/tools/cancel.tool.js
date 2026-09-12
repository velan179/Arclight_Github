import actionsService from '../services/actions/actionsService.js';

export const cancelTool = {
  name: 'action.executeCancel',
  description: 'Cancel an order before it has been dispatched.',
  parameters: {
    type: 'object',
    properties: {
      caseId: { type: 'string' },
      runId: { type: 'string' },
      orderId: { type: 'string' },
      idempotencyKey: { type: 'string' },
    },
    required: ['caseId', 'orderId', 'idempotencyKey'],
  },
  async execute(params) {
    return await actionsService.executeCancellation(params);
  },
};

export default cancelTool;
