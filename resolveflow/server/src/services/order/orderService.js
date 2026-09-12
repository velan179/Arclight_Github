import Order from '../../models/Order.js';
import { getConnectionState } from '../../config/db.js';

const MOCK_ORDERS = {
  'ORD-88219': {
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
    deliveredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    shippingAddress: {
      street: '742 Cyberdyne Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'US',
    },
    paymentMethod: { type: 'CREDIT_CARD', last4: '4242' },
  },
};

export const orderService = {
  async getById(orderId) {
    const { isConnected } = getConnectionState();
    if (isConnected) {
      const order = await Order.findOne({ orderId });
      if (order) return order.toObject();
    }
    return MOCK_ORDERS[orderId] || null;
  },

  async checkEligibility(orderId) {
    const order = await this.getById(orderId);
    if (!order) {
      return { eligible: false, reason: 'Order not found' };
    }

    const deliveryDate = new Date(order.deliveredAt || Date.now());
    const daysSinceDelivery = Math.floor((Date.now() - deliveryDate.getTime()) / (1000 * 3600 * 24));
    const within30Days = daysSinceDelivery <= 30;

    return {
      eligible: within30Days && (order.status === 'DELIVERED' || order.status === 'SHIPPED'),
      orderId: order.orderId,
      status: order.status,
      totalAmount: order.totalAmount,
      items: order.items,
      daysSinceDelivery,
      withinWindow: within30Days,
      summary: `Order ${order.orderId} is ${order.status} (${daysSinceDelivery} days ago). Within 30-day window.`,
    };
  },

  async updateStatus(orderId, status) {
    const { isConnected } = getConnectionState();
    if (isConnected) {
      await Order.findOneAndUpdate({ orderId }, { status });
    }
    if (MOCK_ORDERS[orderId]) {
      MOCK_ORDERS[orderId].status = status;
    }
    return { success: true, orderId, status };
  },
};

export default orderService;
