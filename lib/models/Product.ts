import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    pl: { type: String, required: true },
    en: { type: String, required: true },
  },
  desc: {
    pl: { type: String },
    en: { type: String },
  },
  price: {
    type: String,
  },
  prices: [{
    label: { type: String },
    value: { type: String },
  }],
  image: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
