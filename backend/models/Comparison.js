import mongoose from 'mongoose';

const comparisonSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    default: 'anonymous',
    index: true 
  },
  productsCompared: [{ 
    type: String, 
    ref: 'Product' 
  }],
  category: { type: String, required: true },
}, {
  timestamps: true // Tracks exactly when the comparison session happened
});

const Comparison = mongoose.model('Comparison', comparisonSchema);
export default Comparison;
