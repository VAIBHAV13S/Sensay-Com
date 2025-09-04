// E-commerce Database Schema and Sample Data
const products = [
  {
    id: 'WH001',
    name: 'Premium Wireless Headphones',
    price: 99.99,
    category: 'Electronics',
    brand: 'AudioMax',
    description: 'High-quality wireless headphones with noise cancellation',
    imageUrl: '/images/wireless-headphones.jpg',
    inStock: true,
    stockQuantity: 50,
    rating: 4.5,
    reviews: 128,
    features: ['Noise Cancellation', 'Bluetooth 5.0', '30hr Battery'],
    tags: ['wireless', 'audio', 'premium']
  },
  {
    id: 'SM001',
    name: 'Smart Fitness Watch',
    price: 199.99,
    category: 'Wearables',
    brand: 'FitTech',
    description: 'Advanced fitness tracking with heart rate monitoring',
    imageUrl: '/images/fitness-watch.jpg',
    inStock: true,
    stockQuantity: 30,
    rating: 4.3,
    reviews: 89,
    features: ['Heart Rate Monitor', 'GPS', 'Water Resistant'],
    tags: ['fitness', 'smartwatch', 'health']
  },
  {
    id: 'LT001',
    name: 'Gaming Laptop Pro',
    price: 1299.99,
    category: 'Computers',
    brand: 'GameForce',
    description: 'High-performance gaming laptop with RTX graphics',
    imageUrl: '/images/gaming-laptop.jpg',
    inStock: true,
    stockQuantity: 15,
    rating: 4.7,
    reviews: 256,
    features: ['RTX 4060', '16GB RAM', '1TB SSD'],
    tags: ['gaming', 'laptop', 'performance']
  },
  {
    id: 'BT001',
    name: 'Portable Bluetooth Speaker',
    price: 49.99,
    category: 'Electronics',
    brand: 'SoundWave',
    description: 'Compact wireless speaker with 360-degree sound',
    imageUrl: '/images/bluetooth-speaker.jpg',
    inStock: true,
    stockQuantity: 75,
    rating: 4.2,
    reviews: 145,
    features: ['360° Sound', 'Waterproof', '12hr Battery'],
    tags: ['bluetooth', 'portable', 'audio']
  },
  {
    id: 'SM002',
    name: 'Wireless Charging Pad',
    price: 29.99,
    category: 'Accessories',
    brand: 'ChargeTech',
    description: 'Fast wireless charging for all compatible devices',
    imageUrl: '/images/wireless-charger.jpg',
    inStock: true,
    stockQuantity: 100,
    rating: 4.1,
    reviews: 67,
    features: ['Fast Charging', 'Universal Compatible', 'LED Indicator'],
    tags: ['wireless', 'charging', 'accessory']
  }
];

const users = [
  {
    id: 'user001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    preferences: {
      preferredChannel: 'whatsapp',
      categories: ['Electronics', 'Gaming'],
      priceRange: { min: 50, max: 500 },
      notifications: true,
      language: 'en'
    },
    purchaseHistory: [
      { productId: 'WH001', purchaseDate: '2025-08-15', rating: 5 },
      { productId: 'BT001', purchaseDate: '2025-07-20', rating: 4 }
    ],
    cartHistory: [
      {
        cartId: 'cart001',
        items: [{ productId: 'SM001', quantity: 1 }],
        abandoned: true,
        abandonedAt: '2025-09-01T10:30:00Z'
      }
    ]
  },
  {
    id: 'user002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    preferences: {
      preferredChannel: 'email',
      categories: ['Wearables', 'Accessories'],
      priceRange: { min: 20, max: 300 },
      notifications: true,
      language: 'en'
    },
    purchaseHistory: [
      { productId: 'SM002', purchaseDate: '2025-08-10', rating: 4 }
    ],
    cartHistory: []
  }
];

const orders = [
  {
    orderId: 'ORD001',
    userId: 'user001',
    items: [
      { productId: 'WH001', quantity: 1, price: 99.99 }
    ],
    total: 99.99,
    status: 'shipped',
    orderDate: '2025-08-15T09:00:00Z',
    shippingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    tracking: {
      trackingNumber: 'TRK123456789',
      carrier: 'FedEx',
      estimatedDelivery: '2025-09-05T17:00:00Z',
      currentStatus: 'In Transit'
    }
  }
];

const carts = [
  {
    cartId: 'cart_current_001',
    userId: 'user001',
    items: [
      { productId: 'LT001', quantity: 1, price: 1299.99 },
      { productId: 'SM002', quantity: 2, price: 29.99 }
    ],
    total: 1359.97,
    createdAt: '2025-09-04T14:00:00Z',
    updatedAt: '2025-09-04T14:30:00Z',
    abandoned: false
  }
];

// AI Recommendation Engine
class RecommendationEngine {
  static generateRecommendations(userId, context = 'general') {
    const user = users.find(u => u.id === userId);
    if (!user) return [];

    const userCategories = user.preferences.categories;
    const priceRange = user.preferences.priceRange;
    
    // Filter products based on user preferences
    let recommendations = products.filter(product => {
      const inPriceRange = product.price >= priceRange.min && product.price <= priceRange.max;
      const inCategory = userCategories.includes(product.category);
      return inPriceRange && inCategory;
    });

    // Sort by rating and limit to top 3
    recommendations = recommendations
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    return recommendations.map(product => ({
      ...product,
      recommendationReason: this.getRecommendationReason(product, user, context)
    }));
  }

  static getRecommendationReason(product, user, context) {
    const reasons = [];
    
    if (user.preferences.categories.includes(product.category)) {
      reasons.push(`matches your interest in ${product.category}`);
    }
    
    if (product.rating >= 4.0) {
      reasons.push(`highly rated (${product.rating}/5)`);
    }
    
    if (context === 'cart_abandonment') {
      reasons.push('similar to items in your cart');
    }
    
    return reasons.join(', ');
  }

  static getComplementaryProducts(cartItems) {
    const complementaryMap = {
      'WH001': ['SM002', 'BT001'], // Headphones -> Charger, Speaker
      'LT001': ['SM002', 'WH001'], // Laptop -> Charger, Headphones
      'SM001': ['SM002', 'BT001'], // Watch -> Charger, Speaker
      'BT001': ['SM002'], // Speaker -> Charger
      'SM002': ['WH001', 'BT001'] // Charger -> Headphones, Speaker
    };

    const suggestions = new Set();
    
    cartItems.forEach(item => {
      const complements = complementaryMap[item.productId] || [];
      complements.forEach(productId => suggestions.add(productId));
    });

    return Array.from(suggestions)
      .map(productId => products.find(p => p.id === productId))
      .filter(Boolean);
  }
}

// Cart Abandonment Detection
class CartAbandonmentDetector {
  static checkAbandonment(cartId, timeThresholdMinutes = 5) {
    const cart = carts.find(c => c.cartId === cartId);
    if (!cart) return false;

    const now = new Date();
    const lastUpdate = new Date(cart.updatedAt);
    const minutesSinceUpdate = (now - lastUpdate) / (1000 * 60);

    return minutesSinceUpdate >= timeThresholdMinutes && !cart.abandoned;
  }

  static markAsAbandoned(cartId) {
    const cart = carts.find(c => c.cartId === cartId);
    if (cart) {
      cart.abandoned = true;
      cart.abandonedAt = new Date().toISOString();
    }
  }

  static getAbandonmentData(cartId) {
    const cart = carts.find(c => c.cartId === cartId);
    if (!cart) return null;

    const user = users.find(u => u.id === cart.userId);
    const cartItems = cart.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return { ...item, product };
    });

    return {
      cartId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        preferences: user.preferences
      },
      items: cartItems,
      total: cart.total,
      abandonedAt: cart.abandonedAt || new Date().toISOString()
    };
  }
}

module.exports = {
  products,
  users,
  orders,
  carts,
  RecommendationEngine,
  CartAbandonmentDetector
};
