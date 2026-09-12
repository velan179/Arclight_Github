import orderService from '../services/order/orderService.js';

export const orderTool = {
  name: 'order.checkEligibility',
  description: 'Retrieve order purchase details, items, delivery dates, and return window eligibility.',
  parameters: {
    type: 'object',
    properties: {
      orderId: { type: 'string', description: 'Unique identifier for the order' },
    },
    required: ['orderId'],
  },
  async execute({ orderId }) {
    return await orderService.checkEligibility(orderId);
  },
};

export default orderTool;
