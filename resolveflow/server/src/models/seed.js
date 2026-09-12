import Customer from './Customer.js';
import Product from './Product.js';
import Inventory from './Inventory.js';
import Order from './Order.js';
import Policy from './Policy.js';
import Case from './Case.js';
import User from './User.js';

export async function seedDatabase() {
  try {
    // 1. Seed Demo User
    const existingUser = await User.findOne({ email: 'agent@resolveflow.ai' });
    if (!existingUser) {
      await User.create({
        name: 'Alex Agent',
        email: 'agent@resolveflow.ai',
        password: 'password123',
        role: 'agent',
      });
      console.log('🌱 Seeded Demo User: agent@resolveflow.ai / password123');
    }

    // 2. Seed Customer
    await Customer.findOneAndUpdate(
      { customerId: 'CUST-9001' },
      {
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
      { upsert: true, new: true }
    );

    // 3. Seed Product
    await Product.findOneAndUpdate(
      { productId: 'PROD-LAPTOP-X1' },
      {
        productId: 'PROD-LAPTOP-X1',
        name: 'AeroBook Pro 15 OLED',
        category: 'Laptops',
        brand: 'AeroTech',
        description: '15.6-inch Ultra-Slim Laptop, Core i7, 32GB RAM, 1TB SSD',
        price: 1299.99,
        sku: 'AERO-PRO-15-OLED',
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
      },
      { upsert: true, new: true }
    );

    // 4. Seed Inventory - stock 0 to trigger realistic inventory-outage replanning demonstration
    await Inventory.findOneAndUpdate(
      { productId: 'PROD-LAPTOP-X1' },
      {
        productId: 'PROD-LAPTOP-X1',
        sku: 'AERO-PRO-15-OLED',
        stockQuantity: 0, // Controlled demo trigger: zero replacement stock available
        reservedQuantity: 0,
        warehouseLocation: 'WH-CENTRAL-1',
        isAvailable: false,
      },
      { upsert: true, new: true }
    );

    // 5. Seed Order
    await Order.findOneAndUpdate(
      { orderId: 'ORD-88219' },
      {
        orderId: 'ORD-88219',
        customerId: 'CUST-9001',
        items: [
          {
            productId: 'PROD-LAPTOP-X1',
            productName: 'AeroBook Pro 15 OLED',
            sku: 'AERO-PRO-15-OLED',
            quantity: 1,
            unitPrice: 1299.99,
            totalPrice: 1299.99,
          },
        ],
        totalAmount: 1299.99,
        status: 'DELIVERED',
        deliveredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // delivered 4 days ago (within 30d window)
        shippingAddress: {
          street: '742 Cyberdyne Blvd',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90001',
          country: 'US',
        },
        paymentMethod: {
          type: 'CREDIT_CARD',
          last4: '4242',
        },
      },
      { upsert: true, new: true }
    );

    // 6. Seed Policies
    await Policy.findOneAndUpdate(
      { policyId: 'POL-REPLACE-01' },
      {
        policyId: 'POL-REPLACE-01',
        name: 'Hardware Damage Replacement Policy',
        type: 'REPLACEMENT',
        returnWindowDays: 30,
        maxRefundAmount: 3000,
        requiresProofOfDamage: true,
        autoApprovalTier: ['standard', 'premium', 'vip'],
        rulesDescription: 'Damaged delivered items qualify for immediate 1-to-1 replacement if inventory is in stock within 30 days of delivery.',
        isActive: true,
      },
      { upsert: true, new: true }
    );

    await Policy.findOneAndUpdate(
      { policyId: 'POL-REFUND-01' },
      {
        policyId: 'POL-REFUND-01',
        name: 'Standard Customer Refund Policy',
        type: 'REFUND',
        returnWindowDays: 30,
        maxRefundAmount: 2500,
        requiresProofOfDamage: false,
        autoApprovalTier: ['vip', 'premium'],
        rulesDescription: 'Full refund to original payment method allowed within 30 days if replacement cannot be fulfilled or upon customer preference.',
        isActive: true,
      },
      { upsert: true, new: true }
    );

    // 7. Seed Default Case for Demo
    const existingCase = await Case.findOne({ caseId: 'CASE-1001' });
    if (!existingCase) {
      await Case.create({
        caseId: 'CASE-1001',
        customerId: 'CUST-9001',
        orderId: 'ORD-88219',
        customerGoal: 'My laptop arrived with a cracked screen. I need a replacement urgently.',
        category: 'DAMAGED_ITEM',
        status: 'OPEN',
        priority: 'HIGH',
        evidence: {
          customerVerified: true,
          orderEligible: true,
          policyMatched: 'POL-REPLACE-01',
          inventoryChecked: false,
        },
      });
      console.log('🌱 Seeded Demo Case: CASE-1001');
    }

    console.log('✅ Synthetic Enterprise seed data ready.');
  } catch (err) {
    console.warn('⚠️ Seed warning (can be ignored if DB offline):', err.message);
  }
}

export default seedDatabase;
