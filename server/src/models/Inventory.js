const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true, index: true },
    sku: { type: String, required: true, index: true },
    stockLevel: { type: Number, required: true, default: 0, min: 0 },
    reservedStock: { type: Number, default: 0, min: 0 },
    warehouseLocation: { type: String, default: 'WH-DEFAULT' },
    restockDate: { type: Date },
    isSimulatedFailure: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);
