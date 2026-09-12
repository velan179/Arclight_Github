/**
 * Module 3: Enterprise Intelligence - Order Service
 * Primary Owner: Member 3
 */

const orderService = {
  getById: async (orderId) => {
    // Member 3 implements order data retrieval
    return {
      id: orderId,
      customerId: 'cust_101',
      productId: 'prod_laptop_m3',
      productName: 'MacBook Pro M3 14-inch',
      amount: 1999.00,
      purchaseDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryStatus: 'DELIVERED'
    };
  }
};

module.exports = orderService;
