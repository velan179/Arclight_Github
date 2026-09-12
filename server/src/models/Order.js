const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customerId: { type: String, required: true, index: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PLACED', 'SHIPPED', 'DELIVERED', 'REFUNDED', 'CANCELLED'],
      default: 'DELIVERED'
    },
    purchaseDate: { type: Date, required: true },
    deliveryDate: { type: Date }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
