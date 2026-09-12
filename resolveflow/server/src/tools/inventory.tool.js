import inventoryService from '../services/inventory/inventoryService.js';

export const inventoryTool = {
  name: 'inventory.checkAvailability',
  description: 'Check physical stock level and warehouse availability for a replacement product.',
  parameters: {
    type: 'object',
    properties: {
      productId: { type: 'string', description: 'Product ID to check for stock' },
    },
    required: ['productId'],
  },
  async execute({ productId }) {
    return await inventoryService.checkAvailability(productId);
  },
};

export default inventoryTool;
