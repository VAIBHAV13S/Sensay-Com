const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const upsellController = require('../controllers/upsellController');
const sensayRoutes = require('./sensay');

// Cart abandonment route
router.post('/cart/abandon', cartController.handleCartAbandonment);

// Upsell route
router.post('/upsell', upsellController.getUpsellRecommendations);

// Sensay-specific routes
router.use('/sensay', sensayRoutes);

module.exports = router;
