import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  attributes: { 
    type: Map, 
    of: String,
    description: 'Dynamic attributes like RAM, Processor, Display, etc.'
  },
  imageUrl: { type: String, default: 'https://via.placeholder.com/150' },
  rating: { type: Number, default: 0 }
}, {
  timestamps: true 
});

// Create a compound index to optimize category/price queries
productSchema.index({ category: 1, price: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
