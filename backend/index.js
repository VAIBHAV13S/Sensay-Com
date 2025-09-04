require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const enhancedRoutes = require('./routes/enhanced-features');
const SensayService = require('./services/sensayService');
const EnhancedSensayService = require('./services/enhancedSensayService');

const app = express();
const port = process.env.PORT || 3001;

// Configure CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Initialize services
let sensayService;
let enhancedSensayService;
let replicasInitialized = false;

async function initializeServer() {
  try {
    console.log('🚀 Starting SensAI Commerce Backend...');

    // Initialize Sensay service
    sensayService = new SensayService();
    console.log('✅ Sensay service initialized successfully');

    // Initialize Enhanced Sensay service
    enhancedSensayService = new EnhancedSensayService();
    console.log('✅ Enhanced Sensay service initialized successfully');

    // Initialize AI replicas for different use cases
    const defaultUserId = process.env.DEFAULT_USER_ID || 'sensai_user';
    await sensayService.initializeReplicas(defaultUserId);
    replicasInitialized = true;
    console.log('✅ All AI replicas initialized and ready');

    // Train replicas with domain-specific knowledge
    await trainReplicasWithKnowledge(defaultUserId);

    console.log('🎉 Server initialization complete!');
    console.log('🤖 Enhanced features ready:');
    console.log('   • Multi-channel cart recovery');
    console.log('   • AI-powered recommendations');
    console.log('   • Smart order tracking');
    console.log('   • Automated post-purchase support');
  } catch (error) {
    console.error('❌ Failed to initialize server:', error.message);
    if (process.env.DEMO_MODE !== 'true') {
      console.log('💡 Tip: Set DEMO_MODE=true in your .env file to run in demo mode');
      process.exit(1);
    } else {
      console.log('🔄 Running in demo mode - some features may be simulated');
    }
  }
}

// Train replicas with e-commerce specific knowledge
async function trainReplicasWithKnowledge(userId) {
  try {
    console.log('🎓 Training AI replicas with e-commerce knowledge...');

    // Train cart abandonment replica
    if (sensayService.replicas.cartAbandonment) {
      await sensayService.trainReplica(
        sensayService.replicas.cartAbandonment,
        userId,
        `You are a cart abandonment recovery specialist for an e-commerce store.
        Your role is to help customers complete their purchases by sending personalized, friendly messages.
        Key responsibilities:
        - Send gentle reminders about abandoned carts
        - Highlight the value of items left in cart
        - Offer incentives like free shipping or discounts
        - Create urgency without being pushy
        - Always include direct links to complete checkout
        - Personalize messages based on cart contents and customer history

        Example message: "Hi [Name]! I noticed you were interested in our [Product]. It's still waiting in your cart - don't miss out on this great deal! Complete your order now and get free shipping."

        Store policies:
        - Free shipping on orders over $50
        - 30-day return policy
        - Secure checkout process
        - Multiple payment options available`
      );
    }

    // Train upsell replica
    if (sensayService.replicas.upsell) {
      await sensayService.trainReplica(
        sensayService.replicas.upsell,
        userId,
        `You are an AI product recommendation specialist.
        Your role is to suggest complementary products and bundles to increase order value.
        Key responsibilities:
        - Analyze cart contents to suggest relevant add-ons
        - Recommend bundles with special pricing
        - Highlight limited-time offers and discounts
        - Personalize recommendations based on customer preferences
        - Explain why recommended products complement their choices
        - Create compelling calls-to-action

        Recommendation strategies:
        - Complementary products (e.g., phone case with phone)
        - Upgrade options (e.g., premium version of selected item)
        - Bundle deals (e.g., buy 2 get 1 free)
        - Seasonal or trending items
        - Frequently bought together items

        Example message: "Based on your cart, we'd recommend adding our Premium Protection Case - it perfectly complements your new phone and comes with a 15% discount when purchased together!"`
      );
    }

    // Train support replica
    if (sensayService.replicas.support) {
      await sensayService.trainReplica(
        sensayService.replicas.support,
        userId,
        `You are a customer support specialist for an e-commerce store.
        Your role is to help customers with inquiries, issues, and requests.
        Key responsibilities:
        - Handle order status inquiries
        - Process refund and return requests
        - Provide shipping and delivery information
        - Assist with product questions
        - Resolve account and payment issues
        - Escalate complex issues when necessary

        Store policies:
        - 30-day return window for unused items
        - Free return shipping for defective products
        - Refunds processed within 3-5 business days
        - 24/7 order tracking available
        - Customer service available Mon-Fri 9AM-5PM EST

        Common scenarios:
        - Order tracking and status updates
        - Return and refund processing
        - Product information and specifications
        - Shipping cost and delivery timeframes
        - Payment and billing questions
        - Account management and preferences

        Always be helpful, patient, and solution-oriented. If you cannot resolve an issue immediately, guide the customer on next steps.`
      );
    }

    // Train order tracking replica
    if (sensayService.replicas.orderTracking) {
      await sensayService.trainReplica(
        sensayService.replicas.orderTracking,
        userId,
        `You are an order tracking and logistics specialist.
        Your role is to keep customers informed about their order status and delivery.
        Key responsibilities:
        - Send order confirmations
        - Provide tracking updates
        - Notify about shipping delays
        - Handle delivery issues
        - Coordinate with shipping carriers
        - Provide delivery instructions

        Shipping information:
        - Standard shipping: 3-5 business days
        - Express shipping: 1-2 business days
        - Free shipping threshold: $50
        - International shipping available
        - Signature required for orders over $100

        Communication guidelines:
        - Always include tracking numbers when available
        - Provide realistic delivery estimates
        - Notify customers immediately of any delays
        - Offer options for expedited shipping if applicable
        - Include delivery instructions and contact information

        Example message: "Great news! Your order #12345 has shipped and is on its way. You can track it here: [tracking-link]. Expected delivery: Tomorrow between 2-6 PM."`
      );
    }

    console.log('✅ All replicas trained with e-commerce knowledge');
  } catch (error) {
    console.error('❌ Error training replicas:', error.message);
    // Don't fail server startup if training fails
  }
}

app.use(express.json());

// Make services available to routes
app.use((req, res, next) => {
  req.sensayService = sensayService;
  req.enhancedSensayService = enhancedSensayService;
  req.replicasInitialized = replicasInitialized;
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: 'SensAI Commerce Backend is running!',
    status: 'healthy',
    sensayConfigured: !!sensayService,
    enhancedFeaturesEnabled: !!enhancedSensayService,
    replicasInitialized: replicasInitialized,
    mode: process.env.DEMO_MODE === 'true' ? 'demo' : 'production',
    features: {
      multiChannelRecovery: true,
      aiRecommendations: true,
      smartOrderTracking: true,
      postPurchaseSupport: true
    }
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const sensayHealth = sensayService ? await sensayService.healthCheck() : { status: 'not_configured' };

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        sensay: sensayHealth,
        enhanced: enhancedSensayService ? { status: 'ready' } : { status: 'not_configured' }
      },
      replicas: replicasInitialized ? 'initialized' : 'pending',
      features: {
        cartRecovery: true,
        aiRecommendations: true,
        orderTracking: true,
        postPurchaseSupport: true
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Main API routes
app.use('/api', apiRoutes);

// Enhanced features routes
app.use('/api/enhanced', enhancedRoutes);

// Placeholder for Sensay Webhooks
app.post('/webhook/sensay', (req, res) => {
  console.log('📨 Received webhook from Sensay:', req.body);
  // Add logic to handle different topics from Sensay
  // e.g., if (req.body.topic === 'order-shipped') { ... }
  res.status(200).send('Webhook received');
});

// Start server with initialization
initializeServer().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server listening at http://localhost:${port}`);
    console.log(`📊 Health check: http://localhost:${port}/health`);
    console.log(`🔧 Mode: ${process.env.DEMO_MODE === 'true' ? 'Demo' : 'Production'}`);
    console.log(`🎯 Enhanced API: http://localhost:${port}/api/enhanced`);
    console.log(`🏆 Ready for Sensay Connect Hackathon!`);
  });
}).catch((error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});
