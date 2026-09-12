const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true, index: true },
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
