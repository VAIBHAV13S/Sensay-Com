exports.handleCartAbandonment = async (req, res) => {
  const { cartId, user, items, total } = req.body;

  if (!cartId || !user || !items) {
    return res.status(400).json({
      error: 'cartId, user, and items are required',
      received: { cartId, user: !!user, items: !!items }
    });
  }

  // Check if replicas are initialized
  if (!req.replicasInitialized && !req.sensayService.demoMode) {
    return res.status(503).json({
      error: 'AI replicas not yet initialized. Please try again in a moment.',
      status: 'initializing'
    });
  }

  console.log(`🛒 Cart ${cartId} abandoned by user ${user.name || user.id}. Triggering recovery flow.`);

  try {
    // Prepare cart data for Sensay
    const cartData = {
      cartId,
      userId: user.id || user.email || `user_${Date.now()}`, // Ensure we have a user ID
      userName: user.name || user.email || 'Valued Customer',
      userPhone: user.phone || null,
      items: Array.isArray(items) ? items : [],
      total: total || 0,
    };

    // Trigger Sensay cart abandonment recovery
    const result = await req.sensayService.triggerCartAbandonmentRecovery(cartData);

    res.status(200).json({
      message: 'Cart abandonment processed and recovery initiated.',
      sensayResponse: result,
      cartData: {
        id: cartId,
        itemCount: cartData.items.length,
        total: cartData.total
      }
    });
  } catch (error) {
    console.error('❌ Error processing cart abandonment:', error.message);

    // Provide helpful error response
    if (error.message.includes('replica not initialized')) {
      return res.status(503).json({
        error: 'AI service temporarily unavailable. Cart recovery will be attempted later.',
        details: 'Cart abandonment replica not ready',
        retryAfter: 30
      });
    }

    res.status(500).json({
      error: 'Failed to process cart abandonment',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
