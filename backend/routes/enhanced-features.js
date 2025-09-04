// Enhanced Sensay Service with Multi-Channel Support
const express = require('express');
const router = express.Router();

// Multi-Channel Cart Recovery
router.post('/cart/recover-multichannel', async (req, res) => {
  const { cartData, userPreferences } = req.body;

  if (!cartData || !cartData.cartId) {
    return res.status(400).json({
      error: 'cartId is required',
      received: { cartData: !!cartData }
    });
  }

  try {
    const recoveryResults = {};

    // Send WhatsApp recovery message
    if (userPreferences.whatsapp && userPreferences.phone) {
      const whatsappResult = await req.sensayService.sendWhatsAppRecovery(
        userPreferences.phone,
        cartData
      );
      recoveryResults.whatsapp = whatsappResult;
    }

    // Send email recovery
    if (userPreferences.email) {
      const emailResult = await req.sensayService.sendEmailRecovery(
        userPreferences.email,
        cartData
      );
      recoveryResults.email = emailResult;
    }

    // Send web notification
    const webResult = await req.sensayService.sendWebNotification(
      cartData.userId,
      cartData
    );
    recoveryResults.web = webResult;

    res.status(200).json({
      message: 'Multi-channel cart recovery initiated',
      channels: Object.keys(recoveryResults),
      results: recoveryResults,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Multi-channel recovery failed:', error.message);
    res.status(500).json({
      error: 'Failed to initiate multi-channel recovery',
      details: error.message
    });
  }
});

// AI-Powered Product Recommendations
router.post('/recommendations/generate', async (req, res) => {
  const { userId, productHistory, currentCart, preferences } = req.body;

  if (!userId) {
    return res.status(400).json({
      error: 'userId is required'
    });
  }

  try {
    // Generate AI recommendations using Sensay
    const recommendations = await req.sensayService.generateRecommendations({
      userId,
      productHistory: productHistory || [],
      currentCart: currentCart || [],
      preferences: preferences || {},
      context: 'upselling'
    });

    // Send recommendations via preferred channel
    if (preferences.preferredChannel) {
      await req.sensayService.sendRecommendations(
        userId,
        recommendations,
        preferences.preferredChannel
      );
    }

    res.status(200).json({
      message: 'AI recommendations generated',
      recommendations,
      sentVia: preferences.preferredChannel || 'web',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Recommendation generation failed:', error.message);
    res.status(500).json({
      error: 'Failed to generate recommendations',
      details: error.message
    });
  }
});

// Order Tracking with Multi-Channel Updates
router.post('/order/track', async (req, res) => {
  const { orderId, status, trackingNumber, userPreferences } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({
      error: 'orderId and status are required'
    });
  }

  try {
    const updateResults = {};

    // Update order status in database
    const orderUpdate = {
      orderId,
      status,
      trackingNumber,
      timestamp: new Date().toISOString()
    };

    // Send updates via multiple channels
    if (userPreferences.whatsapp && userPreferences.phone) {
      updateResults.whatsapp = await req.sensayService.sendOrderUpdateWhatsApp(
        userPreferences.phone,
        orderUpdate
      );
    }

    if (userPreferences.email) {
      updateResults.email = await req.sensayService.sendOrderUpdateEmail(
        userPreferences.email,
        orderUpdate
      );
    }

    // Always send web notification
    updateResults.web = await req.sensayService.sendOrderUpdateWeb(
      userPreferences.userId,
      orderUpdate
    );

    res.status(200).json({
      message: 'Order tracking update sent',
      orderUpdate,
      channels: Object.keys(updateResults),
      results: updateResults,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Order tracking update failed:', error.message);
    res.status(500).json({
      error: 'Failed to send order tracking update',
      details: error.message
    });
  }
});

// Post-Purchase Support Automation
router.post('/support/post-purchase', async (req, res) => {
  const { userId, orderId, query, channel } = req.body;

  if (!userId || !query) {
    return res.status(400).json({
      error: 'userId and query are required'
    });
  }

  try {
    // Categorize the support query
    const queryCategory = req.sensayService.categorizePostPurchaseQuery(query);
    
    let response;
    
    switch (queryCategory) {
      case 'refund':
        response = await req.sensayService.handleRefundRequest(userId, orderId, query);
        break;
      case 'return':
        response = await req.sensayService.handleReturnRequest(userId, orderId, query);
        break;
      case 'shipping':
        response = await req.sensayService.handleShippingInquiry(userId, orderId, query);
        break;
      case 'product_issue':
        response = await req.sensayService.handleProductIssue(userId, orderId, query);
        break;
      default:
        response = await req.sensayService.handleGeneralSupport(userId, query, channel);
    }

    res.status(200).json({
      message: 'Post-purchase support query processed',
      category: queryCategory,
      response: response.message,
      automated: response.automated,
      escalated: response.escalated || false,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Post-purchase support failed:', error.message);
    res.status(500).json({
      error: 'Failed to process post-purchase support query',
      details: error.message
    });
  }
});

module.exports = router;
