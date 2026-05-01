import Product from '../models/Product.js';
import Comparison from '../models/Comparison.js';
import { scrapeAmazonForProducts } from '../services/amazonService.js';
import { scrapeFlipkartForProducts } from '../services/flipkartService.js';
import { getSmartRecommendations } from '../services/recommendationService.js';

// @desc    Get all products (with optional filtering)
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { category, brand, search } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (search) query.name = { $regex: search, $options: 'i' };

    // Fetch matching products, optimized with category/price index
    const products = await Product.find(query).limit(50);
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Compare multiple products and log the session
// @route   POST /api/products/compare
export const compareProducts = async (req, res) => {
  try {
    const { productIds, userId = 'anonymous', category = 'general' } = req.body;

    if (!productIds || productIds.length < 2) {
      return res.status(400).json({ success: false, message: 'At least 2 products are required for comparison.' });
    }

    // 1. Log the comparison event for future AI model training
    await Comparison.create({
      userId,
      productsCompared: productIds,
      category
    });

    // 2. Fetch the specific products efficiently utilizing ObjectId indexing
    const products = await Product.find({ _id: { $in: productIds } });

    res.status(200).json({
      success: true,
      message: 'Comparison logged generated successfully',
      data: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error during comparison.' });
  }
};

// @desc    Search products across multiple external platforms (Amazon, Flipkart)
// @route   GET /api/products/external-search
export const searchExternalProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    // Hit our local DB, AND external platforms in parallel for maximum speed!
    const [localResults, amazonResults, flipkartResults] = await Promise.all([
      Product.find({ name: { $regex: query, $options: 'i' } }).limit(5).catch(() => []),
      scrapeAmazonForProducts(query),
      scrapeFlipkartForProducts(query)
    ]);

    // Tag local products implicitly
    const taggedLocal = localResults.map(p => ({
      ...p.toObject(),
      platform: 'Local DB',
      platformBadgeUrl: ''
    }));

    // Aggregate everything
    const aggregatedData = [...amazonResults, ...flipkartResults, ...taggedLocal];

    res.status(200).json({
      success: true,
      count: aggregatedData.length,
      data: aggregatedData
    });

  } catch (error) {
    console.error('External search error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving external products.' });
  }
};

// @desc    Get AI Recommendations
// @route   GET /api/products/recommendations
export const getRecommendations = async (req, res) => {
  try {
    const data = await getSmartRecommendations();
    res.status(200).json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving recommendations' });
  }
};
