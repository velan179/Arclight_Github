import verificationService from '../services/verification/verificationService.js';

export const verificationTool = {
  name: 'verification.verifyState',
  description: 'Perform deterministic post-action checks across database records and bank ledger.',
  parameters: {
    type: 'object',
    properties: {
      caseId: { type: 'string' },
      runId: { type: 'string' },
      actionId: { type: 'string' },
      actionType: { type: 'string' },
      orderId: { type: 'string' },
    },
    required: ['caseId', 'runId', 'actionId', 'actionType', 'orderId'],
  },
  async execute(params) {
    return await verificationService.verifyAction(params);
  },
};

export default verificationTool;
