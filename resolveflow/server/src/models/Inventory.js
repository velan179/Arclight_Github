import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true },
    sku: { type: String, required: true },
    stockQuantity: { type: Number, required: true, default: 0 },
    reservedQuantity: { type: Number, default: 0 },
    warehouseLocation: { type: String, default: 'WH-CENTRAL-1' },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);


export default mongoose.model('Inventory', inventorySchema);
