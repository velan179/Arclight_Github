import policyService from '../services/policy/policyService.js';

export const policyTool = {
  name: 'policy.checkEligibility',
  description: 'Evaluate enterprise customer service policies for refunds, replacements, or cancellations.',
  parameters: {
    type: 'object',
    properties: {
      actionType: { type: 'string', enum: ['REFUND', 'REPLACEMENT', 'CANCELLATION'] },
      customerTier: { type: 'string' },
      daysSinceDelivery: { type: 'number' },
      amount: { type: 'number' },
    },
    required: ['actionType'],
  },
  async execute(params) {
    return await policyService.checkEligibility(params);
  },
};

export default policyTool;
