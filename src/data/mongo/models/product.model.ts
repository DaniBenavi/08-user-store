import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  available: { type: Boolean, default: true },
  price: { type: Number, default: 0, required: [true, 'Price is required'] },
  description: { type: String, default: '' },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
});

export const ProductModel = mongoose.model('Product', ProductSchema);
