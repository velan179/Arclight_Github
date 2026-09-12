const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    tier: { type: String, enum: ['STANDARD', 'GOLD', 'VIP'], default: 'STANDARD' },
    accountStatus: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'FLAGGED'], default: 'ACTIVE' },
    totalOrders: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
