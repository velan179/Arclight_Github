import customerService from '../services/customer/customerService.js';

export const customerTool = {
  name: 'customer.verify',
  description: 'Retrieve customer account details, verification status, and tier by customerId.',
  parameters: {
    type: 'object',
    properties: {
      customerId: { type: 'string', description: 'Unique identifier for the customer' },
    },
    required: ['customerId'],
  },
  async execute({ customerId }) {
    return await customerService.verifyIdentity(customerId);
  },
};

export default customerTool;
