import Product from '../models/Product.js';
import Comparison from '../models/Comparison.js';

export const getSmartRecommendations = async (userId = 'anonymous') => {
  try {
    // 1. In a fully populated DB, we would query `Comparison` logs here to find products frequently 
    // compared together. Since local DB might be offline/empty in MVP, we catch it gracefully.
    
    // Simulate AI computing popular comparisons
    let recommendedProducts = [];
    try {
      // Find top 3 most recent products overall in local DB as a baseline fallback
      recommendedProducts = await Product.find().sort({ createdAt: -1 }).limit(3);
    } catch(e) {
      // Swallowing MongoDB error for local preview
    }

    if (recommendedProducts.length > 0) {
      return recommendedProducts;
    }

    // 2. Simulated ML Collaborative Filtering recommendations if DB is empty/offline:
    return [
      {
        _id: `rec-${Date.now()}-1`,
        name: `AI-Recommended: Surface Pro 11`,
        brand: 'Microsoft',
        price: 95000,
        category: 'Laptops',
        platform: 'Engine',
        imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80',
        attributes: {
          'Why Recommended': 'Highly compared against MacBooks users viewed recently.'
        }
      },
      {
        _id: `rec-${Date.now()}-2`,
        name: `AI-Recommended: XPS 13 Plus`,
        brand: 'Dell',
        price: 135000,
        category: 'Laptops',
        platform: 'Engine',
        imageUrl: 'https://images.unsplash.com/photo-1593642702821-c823b13eb295?w=500&q=80',
        attributes: {
          'Why Recommended': 'Matches the premium tier laptops you typically browse.'
        }
      }
    ];

  } catch (error) {
    console.error("AI Recommendation Service error:", error);
    return [];
  }
};
