const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

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
async function testCartAbandonment() {
  console.log('\n🛒 Testing Cart Abandonment Recovery...');
  try {
    const response = await axios.post(`${BASE_URL}/cart/abandon`, {
      cartId: testCart.cartId,
      user: testUser,
      items: testCart.items,
      total: testCart.total
    });
    
    console.log('✅ Cart abandonment test passed');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ Cart abandonment test failed:', error.response?.data || error.message);
  }
}

async function testUpsellRecommendations() {
  console.log('\n🎯 Testing AI Upsell Recommendations...');
  try {
    const response = await axios.post(`${BASE_URL}/upsell`, {
      cart: testCart,
      userId: testUser.id
    });
    
    console.log('✅ Upsell recommendations test passed');
    console.log('Recommendations:', response.data.recommendations);
  } catch (error) {
    console.error('❌ Upsell recommendations test failed:', error.response?.data || error.message);
  }
}

async function testOrderUpdate() {
  console.log('\n📦 Testing Order Update Notifications...');
  try {
    const response = await axios.post(`${BASE_URL}/sensay/order/update`, {
      ...testOrder,
      updateType: 'confirmation'
    });
    
    console.log('✅ Order update test passed');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ Order update test failed:', error.response?.data || error.message);
  }
}

async function testSupportQuery() {
  console.log('\n💬 Testing Customer Support...');
  try {
    const response = await axios.post(`${BASE_URL}/sensay/support/query`, {
      userId: testUser.id,
      query: 'I want to return my order and get a refund',
      channel: 'web'
    });
    
    console.log('✅ Support query test passed');
    console.log('AI Response:', response.data.response);
  } catch (error) {
    console.error('❌ Support query test failed:', error.response?.data || error.message);
  }
}

async function testUserProfile() {
  console.log('\n👤 Testing User Profile Update...');
  try {
    const response = await axios.post(`${BASE_URL}/sensay/user/profile`, {
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
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ User profile test failed:', error.response?.data || error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting SensAI Commerce API Tests...');
  console.log('=====================================');
  
  await testCartAbandonment();
  await testUpsellRecommendations();
  await testOrderUpdate();
  await testSupportQuery();
  await testUserProfile();
  
  console.log('\n=====================================');
  console.log('🎯 All tests completed!');
  console.log('\nNote: These tests demonstrate the API functionality.');
  console.log('In a real implementation, Sensay would send actual messages');
  console.log('to WhatsApp, Messenger, and other channels.');
}

// Handle command line execution
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testCartAbandonment,
  testUpsellRecommendations,
  testOrderUpdate,
  testSupportQuery,
  testUserProfile,
  runAllTests
};
