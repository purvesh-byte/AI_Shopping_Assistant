import express from 'express';
import { getProducts, compareProducts, searchExternalProducts, getRecommendations } from '../controllers/productController.js';

const router = express.Router();

router.route('/').get(getProducts);
router.route('/compare').post(compareProducts);
router.route('/external-search').get(searchExternalProducts);
router.route('/recommendations').get(getRecommendations);

export default router;
