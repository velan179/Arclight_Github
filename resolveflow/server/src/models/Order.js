import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerId: { type: String, required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['DELIVERED', 'SHIPPED', 'PROCESSING', 'CANCELLED', 'REFUNDED', 'REPLACED'],
      default: 'DELIVERED',
    },
    deliveredAt: { type: Date, default: Date.now },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: { type: String, default: 'US' },
    },
    paymentMethod: {
      type: { type: String, default: 'CREDIT_CARD' },
      last4: { type: String, default: '4242' },
    },
  },
  { timestamps: true }
);

orderSchema.index({ customerId: 1 });

export default mongoose.model('Order', orderSchema);
