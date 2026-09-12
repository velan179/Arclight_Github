import Customer from '../../models/Customer.js';
import { getConnectionState } from '../../config/db.js';

// In-memory fallback mock for zero-db offline demo mode
const MOCK_CUSTOMERS = {
  'CUST-9001': {
    customerId: 'CUST-9001',
    name: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    phone: '+1-555-0199',
    tier: 'vip',
    address: {
      street: '742 Cyberdyne Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'US',
    },
    loyaltyPoints: 1250,
  },
};

export const customerService = {
  async getById(customerId) {
    const { isConnected } = getConnectionState();
    if (isConnected) {
      const customer = await Customer.findOne({ customerId });
      if (customer) return customer.toObject();
    }
    return MOCK_CUSTOMERS[customerId] || null;
  },

  async verifyIdentity(customerId) {
    const customer = await this.getById(customerId);
    if (!customer) {
      return { verified: false, reason: 'Customer ID not found in enterprise records' };
    }
    return {
      verified: true,
      customerId: customer.customerId,
      tier: customer.tier,
      name: customer.name,
      summary: `Customer ${customer.name} verified (Tier: ${customer.tier.toUpperCase()})`,
    };
  },
};

export default customerService;
