const express = require('express');
const router = express.Router();

// Handle order confirmations and tracking updates
router.post('/order/update', async (req, res) => {
  const { orderId, userId, userPhone, status, trackingNumber, estimatedDelivery, updateType } = req.body;

  if (!orderId || !userId || !status) {
    return res.status(400).json({
      error: 'orderId, userId, and status are required',
      received: { orderId: !!orderId, userId: !!userId, status: !!status }
    });
  }

  // Check if replicas are initialized
  if (!req.replicasInitialized && !req.sensayService.demoMode) {
    return res.status(503).json({
      error: 'AI replicas not yet initialized. Please try again in a moment.',
      status: 'initializing'
    });
  }

  try {
    const orderData = {
      orderId,
      userId,
      userPhone: userPhone || null,
      status,
      trackingNumber: trackingNumber || null,
      estimatedDelivery: estimatedDelivery || null,
    };

    const result = await req.sensayService.sendOrderUpdate(orderData, updateType || 'update');

    res.status(200).json({
      message: `Order ${updateType || 'update'} sent successfully`,
      sensayResponse: result,
      orderData: {
        id: orderId,
        status: status,
        trackingNumber: trackingNumber
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error sending order update:', error.message);

    if (error.message.includes('replica not initialized')) {
      return res.status(503).json({
        error: 'AI service temporarily unavailable. Order update will be sent later.',
        details: 'Order tracking replica not ready',
        retryAfter: 30
      });
    }

    res.status(500).json({
      error: 'Failed to send order update',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Handle customer support queries
router.post('/support/query', async (req, res) => {
  const { userId, query, channel } = req.body;

  if (!userId || !query) {
    return res.status(400).json({
      error: 'userId and query are required',
      received: { userId: !!userId, query: !!query }
    });
  }

  // Check if replicas are initialized
  if (!req.replicasInitialized && !req.sensayService.demoMode) {
    return res.status(503).json({
      error: 'AI replicas not yet initialized. Please try again in a moment.',
      status: 'initializing'
    });
  }

  try {
    const result = await req.sensayService.handleSupportQuery(userId, query, channel || 'web');

    res.status(200).json({
      message: 'Support query processed',
      response: result.response,
      sensayResponse: result,
      queryCategory: req.sensayService.categorizeQuery(query),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error handling support query:', error.message);

    if (error.message.includes('replica not initialized')) {
      return res.status(503).json({
        error: 'AI service temporarily unavailable. Support query will be processed later.',
        details: 'Support replica not ready',
        retryAfter: 30
      });
    }

    res.status(500).json({
      error: 'Failed to process support query',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Update user profile for personalization
router.post('/user/profile', async (req, res) => {
  const { userId, name, email, phone, preferences, purchaseHistory } = req.body;

  if (!userId) {
    return res.status(400).json({
      error: 'userId is required',
      received: { userId: !!userId }
    });
  }

  // Check if replicas are initialized
  if (!req.replicasInitialized && !req.sensayService.demoMode) {
    return res.status(503).json({
      error: 'AI replicas not yet initialized. Please try again in a moment.',
      status: 'initializing'
    });
  }

  try {
    const userData = {
      userId,
      name: name || null,
      email: email || null,
      phone: phone || null,
      preferences: preferences || {},
      purchaseHistory: purchaseHistory || [],
    };

    const result = await req.sensayService.updateUserProfile(userData);

    res.status(200).json({
      message: 'User profile updated successfully',
      sensayResponse: result,
      userData: {
        id: userId,
        name: name,
        email: email,
        preferencesUpdated: !!preferences
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error updating user profile:', error.message);

    if (error.message.includes('replica not initialized')) {
      return res.status(503).json({
        error: 'AI service temporarily unavailable. Profile update will be processed later.',
        details: 'Profile management service not ready',
        retryAfter: 30
      });
    }

    res.status(500).json({
      error: 'Failed to update user profile',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get replica status and health
router.get('/status', async (req, res) => {
  try {
    const health = await req.sensayService.healthCheck();

    res.status(200).json({
      status: 'operational',
      replicasInitialized: req.replicasInitialized,
      sensayHealth: health,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error checking status:', error.message);
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
