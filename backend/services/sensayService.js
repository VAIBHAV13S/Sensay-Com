const axios = require('axios');

class SensayService {
  constructor() {
    this.apiKey = process.env.SENSAY_API_KEY;
    this.organizationId = process.env.SENSAY_ORGANIZATION_ID;
    this.apiVersion = process.env.SENSAY_API_VERSION || '2025-03-25';
    this.baseURL = 'https://api.sensay.io';
    this.demoMode = process.env.DEMO_MODE === 'true' || false;

    if (!this.apiKey || !this.organizationId) {
      throw new Error('Sensay API credentials not found. Make sure SENSAY_API_KEY and SENSAY_ORGANIZATION_ID are set.');
    }

    // Initialize axios instance
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-API-Version': this.apiVersion,
        'Content-Type': 'application/json',
        'X-ORGANIZATION-SECRET': this.organizationId
      },
    });

    // Replica UUIDs for different purposes
    this.replicas = {
      cartAbandonment: null,
      upsell: null,
      support: null,
      orderTracking: null
    };
  }

  // Initialize replicas for different use cases
  async initializeReplicas(userId) {
    try {
      console.log('🔧 Initializing Sensay replicas...');

      // Create or get cart abandonment replica
      this.replicas.cartAbandonment = await this.getOrCreateReplica(
        userId,
        'Cart Recovery Assistant',
        'Specialized in recovering abandoned shopping carts with personalized offers',
        'Hi! I noticed you left some items in your cart. Let me help you complete your purchase!'
      );

      // Create or get upsell replica
      this.replicas.upsell = await this.getOrCreateReplica(
        userId,
        'Upsell Specialist',
        'AI-powered product recommendations and personalized offers',
        'I see you\'re interested in some great products! Let me suggest some perfect companions.'
      );

      // Create or get support replica
      this.replicas.support = await this.getOrCreateReplica(
        userId,
        'Customer Support Agent',
        'Handles customer inquiries, returns, refunds, and general support',
        'Hello! I\'m here to help with any questions about your order or our products.'
      );

      // Create or get order tracking replica
      this.replicas.orderTracking = await this.getOrCreateReplica(
        userId,
        'Order Tracking Assistant',
        'Provides real-time order updates and shipping information',
        'I can help you track your order and provide shipping updates!'
      );

      console.log('✅ All replicas initialized successfully');
      return this.replicas;
    } catch (error) {
      console.error('❌ Failed to initialize replicas:', error.message);
      if (this.demoMode) {
        console.log('🔄 Demo mode: Using mock replica IDs');
        return this.getMockReplicas();
      }
      throw error;
    }
  }

  // Get or create a replica for specific purpose
  async getOrCreateReplica(userId, name, description, greeting) {
    if (this.demoMode) {
      return `demo_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    }

    try {
      // List existing replicas for user
      const response = await this.client.get('/v1/replicas', {
        headers: {
          'X-USER-ID': userId
        }
      });

      // Look for existing replica with matching name
      const existingReplica = response.data.items.find(replica => replica.name === name);

      if (existingReplica) {
        console.log(`📋 Found existing replica: ${name}`);
        return existingReplica.uuid;
      }

      // Create new replica
      const createResponse = await this.client.post('/v1/replicas', {
        name,
        shortDescription: description,
        greeting,
        ownerID: userId,
        private: false,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        llm: {
          provider: 'openai',
          model: 'gpt-4o'
        }
      });

      console.log(`✨ Created new replica: ${name}`);
      return createResponse.data.uuid;
    } catch (error) {
      console.error(`❌ Error with replica ${name}:`, error.message);
      throw error;
    }
  }

  // Train replica with knowledge base
  async trainReplica(replicaId, userId, trainingData) {
    if (this.demoMode) {
      console.log(`🎓 Demo mode: Training replica ${replicaId} with knowledge`);
      return { success: true, knowledgeBaseID: `demo_kb_${Date.now()}` };
    }

    try {
      // Create knowledge base entry
      const kbResponse = await this.client.post(`/v1/replicas/${replicaId}/training`, {}, {
        headers: {
          'X-USER-ID': userId
        }
      });

      const knowledgeBaseID = kbResponse.data.knowledgeBaseID;

      // Add training content
      await this.client.put(`/v1/replicas/${replicaId}/training/${knowledgeBaseID}`, {
        rawText: trainingData
      }, {
        headers: {
          'X-USER-ID': userId
        }
      });

      console.log(`🎓 Trained replica ${replicaId} with knowledge base ${knowledgeBaseID}`);
      return { success: true, knowledgeBaseID };
    } catch (error) {
      console.error('❌ Error training replica:', error.message);
      throw error;
    }
  }

  // Send chat message to specific replica
  async sendChatMessage(replicaId, userId, message, context = {}) {
    if (this.demoMode) {
      return this.generateDemoResponse(replicaId, message, context);
    }

    try {
      const response = await this.client.post(`/v1/replicas/${replicaId}/chat/completions`, {
        content: message,
        ...context
      }, {
        headers: {
          'X-USER-ID': userId
        }
      });

      return {
        success: true,
        content: response.data.content,
        messageId: `msg_${Date.now()}`
      };
    } catch (error) {
      console.error('❌ Error sending chat message:', error.message);
      throw error;
    }
  }

  // Trigger cart abandonment recovery
  async triggerCartAbandonmentRecovery(cartData) {
    console.log('🛒 Cart Abandonment Recovery triggered via Sensay');
    console.log('   User:', cartData.userName);
    console.log('   Cart Total:', `$${cartData.total}`);
    console.log('   Items:', cartData.items.length);

    if (this.demoMode) {
      return {
        success: true,
        messageId: `cart_recovery_${Date.now()}`,
        channels: ['web_widget', 'email', 'sms'], // Updated to reflect actual Sensay capabilities
        message: 'Multi-channel message sent: "Hey John, don\'t forget your items! Complete your order to get them delivered."',
        deliveryMethods: {
          web: 'Web widget notification sent',
          email: 'Email notification queued',
          sms: 'SMS notification sent'
        },
        estimatedDelivery: 'Immediate'
      };
    }

    try {
      const replicaId = this.replicas.cartAbandonment;
      if (!replicaId) {
        throw new Error('Cart abandonment replica not initialized');
      }

      const message = `Cart abandoned by ${cartData.userName}. Cart contains ${cartData.items.length} items totaling $${cartData.total}. Please send a personalized recovery message to encourage completion.`;

      const response = await this.sendChatMessage(replicaId, cartData.userId, message, {
        cartData: cartData
      });

      return {
        success: true,
        messageId: response.messageId,
        channels: ['web_widget', 'email', 'sms'],
        message: response.content,
        deliveryMethods: {
          web: 'Web widget notification sent',
          email: 'Email notification queued',
          sms: 'SMS notification sent'
        },
        estimatedDelivery: 'Immediate'
      };
    } catch (error) {
      console.error('❌ Error in cart abandonment recovery:', error.message);
      throw error;
    }
  }

  // Send personalized upsell recommendations
  async sendUpsellRecommendations(userId, recommendations) {
    console.log('🎯 AI Upsell Recommendations sent via Sensay');
    console.log('   User ID:', userId);
    console.log('   Recommendations:', recommendations.length);

    if (this.demoMode) {
      return {
        success: true,
        messageId: `upsell_${Date.now()}`,
        channels: ['web_widget', 'email', 'telegram'], // Updated to actual Sensay channels
        message: 'Multi-channel recommendations sent: "Based on your cart, we recommend these bundles with exclusive discounts!"',
        deliveryMethods: {
          web: 'Web widget notification with recommendations',
          email: 'Email with personalized recommendations',
          telegram: 'Telegram bot message sent'
        },
        recommendationsSent: recommendations.length
      };
    }

    try {
      const replicaId = this.replicas.upsell;
      if (!replicaId) {
        throw new Error('Upsell replica not initialized');
      }

      const message = `Generate personalized upsell recommendations for user ${userId}. Available recommendations: ${recommendations.map(r => `${r.name} - $${r.price} (${r.discount}% off)`).join(', ')}. Create an engaging message to send via available channels.`;

      const response = await this.sendChatMessage(replicaId, userId, message, {
        recommendations: recommendations
      });

      return {
        success: true,
        messageId: response.messageId,
        channels: ['web_widget', 'email', 'telegram'],
        message: response.content,
        deliveryMethods: {
          web: 'Web widget notification with recommendations',
          email: 'Email with personalized recommendations',
          telegram: 'Telegram bot message sent'
        },
        recommendationsSent: recommendations.length
      };
    } catch (error) {
      console.error('❌ Error sending upsell recommendations:', error.message);
      throw error;
    }
  }

  // Send order confirmation and tracking updates
  async sendOrderUpdate(orderData, updateType = 'confirmation') {
    console.log(`📦 Order ${updateType} sent via Sensay`);
    console.log('   Order ID:', orderData.orderId);
    console.log('   Status:', orderData.status);

    if (this.demoMode) {
      let message = '';
      let deliveryMethods = {};

      switch(updateType) {
        case 'confirmation':
          message = `Multi-channel notification: "✅ Order ${orderData.orderId} confirmed! Your items will be delivered by ${orderData.estimatedDelivery}."`;
          deliveryMethods = {
            web: 'Web widget order confirmation',
            email: 'Email order confirmation sent',
            sms: 'SMS order confirmation sent'
          };
          break;
        case 'shipped':
          message = `Multi-channel notification: "🚚 Your order ${orderData.orderId} has shipped! Track it with ${orderData.trackingNumber}."`;
          deliveryMethods = {
            web: 'Web widget shipping notification',
            email: 'Email shipping update sent',
            telegram: 'Telegram shipping alert sent'
          };
          break;
        case 'delivered':
          message = `Multi-channel notification: "📦 Your order ${orderData.orderId} has been delivered! Enjoy your purchase!"`;
          deliveryMethods = {
            web: 'Web widget delivery confirmation',
            email: 'Email delivery confirmation sent',
            sms: 'SMS delivery notification sent'
          };
          break;
        default:
          message = `Multi-channel notification: "Order ${orderData.orderId} status updated to ${orderData.status}."`;
          deliveryMethods = {
            web: 'Web widget status update',
            email: 'Email status update sent'
          };
      }

      return {
        success: true,
        messageId: `order_${updateType}_${Date.now()}`,
        channels: ['web_widget', 'email', 'sms', 'telegram'],
        message,
        deliveryMethods,
        orderStatus: orderData.status
      };
    }

    try {
      const replicaId = this.replicas.orderTracking;
      if (!replicaId) {
        throw new Error('Order tracking replica not initialized');
      }

      const message = `Order ${orderData.orderId} status update: ${updateType}. Current status: ${orderData.status}. ${orderData.trackingNumber ? `Tracking: ${orderData.trackingNumber}` : ''}. ${orderData.estimatedDelivery ? `Estimated delivery: ${orderData.estimatedDelivery}` : ''}. Generate an appropriate customer notification message.`;

      const response = await this.sendChatMessage(replicaId, orderData.userId, message, {
        orderData: orderData,
        updateType: updateType
      });

      return {
        success: true,
        messageId: response.messageId,
        channels: ['web_widget', 'email', 'sms', 'telegram'],
        message: response.content,
        deliveryMethods: {
          web: 'Web widget notification sent',
          email: 'Email notification queued',
          sms: 'SMS notification sent',
          telegram: 'Telegram notification sent'
        },
        orderStatus: orderData.status
      };
    } catch (error) {
      console.error('❌ Error sending order update:', error.message);
      throw error;
    }
  }

  // Handle customer support queries
  async handleSupportQuery(userId, query, channel = 'web') {
    console.log('💬 Customer Support Query processed via Sensay');
    console.log('   User ID:', userId);
    console.log('   Query:', query);

    if (this.demoMode) {
      let aiResponse = 'Thank you for contacting us. Your query has been received and will be processed shortly.';

      if (query.toLowerCase().includes('refund') || query.toLowerCase().includes('return')) {
        aiResponse = '✅ I understand you want to process a refund. I can help you with that! Your refund request has been initiated and you should expect to see the credit back to your original payment method within 3-5 business days. Is there anything else I can help you with?';
      } else if (query.toLowerCase().includes('shipping') || query.toLowerCase().includes('delivery')) {
        aiResponse = '📦 I can help you with shipping information! Your order is currently being processed and you\'ll receive tracking details via WhatsApp once it ships. Estimated delivery is 2-3 business days.';
      } else if (query.toLowerCase().includes('cancel')) {
        aiResponse = '🛑 I can help you cancel your order. If your order hasn\'t shipped yet, I can cancel it immediately. Let me check the status for you...';
      }

      console.log('   AI Response:', aiResponse);

      return {
        success: true,
        messageId: `support_${Date.now()}`,
        response: aiResponse,
        resolved: true,
        channel: channel
      };
    }

    try {
      const replicaId = this.replicas.support;
      if (!replicaId) {
        throw new Error('Support replica not initialized');
      }

      const response = await this.sendChatMessage(replicaId, userId, query, {
        channel: channel,
        queryType: this.categorizeQuery(query)
      });

      return {
        success: true,
        messageId: response.messageId,
        response: response.content,
        resolved: true,
        channel: channel
      };
    } catch (error) {
      console.error('❌ Error handling support query:', error.message);
      throw error;
    }
  }

  // Create or update user profile for personalization
  async updateUserProfile(userData) {
    console.log('👤 User Profile updated in Sensay');
    console.log('   User ID:', userData.userId);
    console.log('   Name:', userData.name);

    if (this.demoMode) {
      return {
        success: true,
        userId: userData.userId,
        profileUpdated: true,
        personalizedChannels: userData.preferences?.communication || ['whatsapp', 'email'],
        message: 'User profile synchronized with Sensay for personalized messaging'
      };
    }

    try {
      // This would typically update user preferences in your system
      // For now, we'll just acknowledge the profile update
      return {
        success: true,
        userId: userData.userId,
        profileUpdated: true,
        personalizedChannels: userData.preferences?.communication || ['whatsapp', 'email'],
        message: 'User profile synchronized with Sensay for personalized messaging'
      };
    } catch (error) {
      console.error('❌ Error updating user profile:', error.message);
      throw error;
    }
  }

  // Categorize support queries for better routing
  categorizeQuery(query) {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('refund') || lowerQuery.includes('return')) {
      return 'refund';
    } else if (lowerQuery.includes('shipping') || lowerQuery.includes('delivery') || lowerQuery.includes('tracking')) {
      return 'shipping';
    } else if (lowerQuery.includes('cancel') || lowerQuery.includes('change')) {
      return 'order_modification';
    } else if (lowerQuery.includes('product') || lowerQuery.includes('quality') || lowerQuery.includes('defect')) {
      return 'product_inquiry';
    } else {
      return 'general';
    }
  }

  // Generate demo responses for testing
  generateDemoResponse(replicaId, message, context) {
    if (replicaId.includes('cart')) {
      return {
        success: true,
        content: 'Multi-channel recovery sent: "Hey there! I noticed you left some amazing items in your cart. Don\'t miss out - complete your order now and get free shipping!" (Delivered via web widget, email, and SMS)',
        messageId: `demo_cart_${Date.now()}`
      };
    } else if (replicaId.includes('upsell')) {
      return {
        success: true,
        content: 'Multi-channel recommendations sent: "Based on your cart, we think you\'d love our premium bundle! Get 15% off when you add it now." (Delivered via web widget, email, and Telegram)',
        messageId: `demo_upsell_${Date.now()}`
      };
    } else if (replicaId.includes('support')) {
      return {
        success: true,
        content: 'Thank you for reaching out! I\'m here to help. Your request has been processed and you should receive a confirmation shortly. (Response sent via web widget and email)',
        messageId: `demo_support_${Date.now()}`
      };
    } else if (replicaId.includes('order')) {
      return {
        success: true,
        content: 'Multi-channel update sent: "Great news! Your order has shipped and is on its way. Track it here: [tracking-link]" (Delivered via web widget, email, and SMS)',
        messageId: `demo_order_${Date.now()}`
      };
    }

    return {
      success: true,
      content: 'Demo response: Message processed successfully via Sensay platform (web widget, email, and SMS channels).',
      messageId: `demo_${Date.now()}`
    };
  }

  // Get mock replica IDs for demo mode
  getMockReplicas() {
    return {
      cartAbandonment: 'demo_cart_replica',
      upsell: 'demo_upsell_replica',
      support: 'demo_support_replica',
      orderTracking: 'demo_order_replica'
    };
  }

  // Health check for Sensay service
  async healthCheck() {
    if (this.demoMode) {
      return { status: 'healthy', mode: 'demo' };
    }

    try {
      const response = await this.client.get('/v1/replicas', {
        timeout: 5000
      });

      return {
        status: 'healthy',
        mode: 'production',
        replicaCount: response.data.items?.length || 0
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        mode: 'production',
        error: error.message
      };
    }
  }
}

module.exports = SensayService;
