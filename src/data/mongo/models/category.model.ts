import mongoose, { Schema } from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], unique: true },
  available: { type: Boolean, default: true },
  description: { type: String, default: '' },
  img: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
});
categorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
  },
});

export const CategoryModel = mongoose.model('Category', categorySchema);
