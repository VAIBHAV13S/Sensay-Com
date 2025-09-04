const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Test data
const testUser = {
  id: 'user_12345',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890'
};

const testCart = {
  cartId: 'cart_67890',
  items: [
    { id: 'prod_1', name: 'Wireless Headphones', price: 99.99, quantity: 1 },
    { id: 'prod_2', name: 'Phone Case', price: 24.99, quantity: 2 }
  ],
  total: 149.97
};

const testOrder = {
  orderId: 'order_54321',
  userId: testUser.id,
  userPhone: testUser.phone,
  status: 'confirmed',
  trackingNumber: 'TRK123456789',
  estimatedDelivery: '2025-09-05'
};

// Test functions
async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');
  try {
    const response = await axios.get(`${BASE_URL}/health`);

    console.log('✅ Health check passed');
    console.log('Status:', response.data.status);
    console.log('Services:', response.data.services);
    console.log('Replicas:', response.data.replicas);
  } catch (error) {
    console.error('❌ Health check failed:', error.response?.data || error.message);
  }
}

async function testReplicaStatus() {
  console.log('\n🤖 Testing Replica Status...');
  try {
    const response = await axios.get(`${BASE_URL}/api/sensay/status`);

    console.log('✅ Replica status check passed');
    console.log('Status:', response.data.status);
    console.log('Replicas Initialized:', response.data.replicasInitialized);
    console.log('Sensay Health:', response.data.sensayHealth);
  } catch (error) {
    console.error('❌ Replica status check failed:', error.response?.data || error.message);
  }
}

async function testCartAbandonment() {
  console.log('\n🛒 Testing Cart Abandonment Recovery...');
  try {
    const response = await axios.post(`${BASE_URL}/api/cart/abandon`, {
      cartId: testCart.cartId,
      user: testUser,
      items: testCart.items,
      total: testCart.total
    });

    console.log('✅ Cart abandonment test passed');
    console.log('Response:', response.data.message);
    console.log('Channels:', response.data.sensayResponse.channels);
  } catch (error) {
    console.error('❌ Cart abandonment test failed:', error.response?.data || error.message);
  }
}

async function testUpsellRecommendations() {
  console.log('\n🎯 Testing AI Upsell Recommendations...');
  try {
    const response = await axios.post(`${BASE_URL}/api/upsell`, {
      cart: testCart,
      userId: testUser.id
    });

    console.log('✅ Upsell recommendations test passed');
    console.log('Recommendations count:', response.data.recommendations.length);
    console.log('Sample recommendation:', response.data.recommendations[0]?.name);
  } catch (error) {
    console.error('❌ Upsell recommendations test failed:', error.response?.data || error.message);
  }
}

async function testOrderUpdate() {
  console.log('\n📦 Testing Order Update Notifications...');
  try {
    const response = await axios.post(`${BASE_URL}/api/sensay/order/update`, {
      ...testOrder,
      updateType: 'confirmation'
    });

    console.log('✅ Order update test passed');
    console.log('Response:', response.data.message);
    console.log('Order Status:', response.data.sensayResponse.orderStatus);
  } catch (error) {
    console.error('❌ Order update test failed:', error.response?.data || error.message);
  }
}

async function testSupportQuery() {
  console.log('\n💬 Testing Customer Support...');
  try {
    const response = await axios.post(`${BASE_URL}/api/sensay/support/query`, {
      userId: testUser.id,
      query: 'I want to return my order and get a refund',
      channel: 'web'
    });

    console.log('✅ Support query test passed');
    console.log('AI Response:', response.data.response.substring(0, 100) + '...');
    console.log('Query Category:', response.data.queryCategory);
  } catch (error) {
    console.error('❌ Support query test failed:', error.response?.data || error.message);
  }
}

async function testUserProfile() {
  console.log('\n👤 Testing User Profile Update...');
  try {
    const response = await axios.post(`${BASE_URL}/api/sensay/user/profile`, {
      userId: testUser.id,
      name: testUser.name,
      email: testUser.email,
      phone: testUser.phone,
      preferences: {
        communication: ['whatsapp', 'email'],
        categories: ['electronics', 'accessories']
      },
      purchaseHistory: [
        { productId: 'prod_1', purchaseDate: '2025-08-15', amount: 99.99 }
      ]
    });

    console.log('✅ User profile test passed');
    console.log('Response:', response.data.message);
    console.log('Personalized Channels:', response.data.sensayResponse.personalizedChannels);
  } catch (error) {
    console.error('❌ User profile test failed:', error.response?.data || error.message);
  }
}

async function testErrorHandling() {
  console.log('\n⚠️ Testing Error Handling...');

  // Test missing required fields
  try {
    await axios.post(`${BASE_URL}/api/cart/abandon`, {});
    console.log('❌ Should have failed with missing fields');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Error handling test passed - proper 400 response');
    } else {
      console.error('❌ Unexpected error response:', error.response?.data);
    }
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting SensAI Commerce API Tests...');
  console.log('=====================================');

  await testHealthCheck();
  await testReplicaStatus();
  await testCartAbandonment();
  await testUpsellRecommendations();
  await testOrderUpdate();
  await testSupportQuery();
  await testUserProfile();
  await testErrorHandling();

  console.log('\n=====================================');
  console.log('🎯 All tests completed!');
  console.log('\n📝 Test Summary:');
  console.log('- Health checks ensure service availability');
  console.log('- Replica status confirms AI initialization');
  console.log('- Cart abandonment tests recovery messaging');
  console.log('- Upsell tests AI-powered recommendations');
  console.log('- Order updates test tracking notifications');
  console.log('- Support queries test AI customer service');
  console.log('- Profile updates test personalization');
  console.log('- Error handling tests proper validation');
}

// Handle command line execution
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testHealthCheck,
  testReplicaStatus,
  testCartAbandonment,
  testUpsellRecommendations,
  testOrderUpdate,
  testSupportQuery,
  testUserProfile,
  testErrorHandling,
  runAllTests
};
