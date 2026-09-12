import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    sku: { type: String, required: true, unique: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);


export default mongoose.model('Product', productSchema);
