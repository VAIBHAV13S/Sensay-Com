import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SENSAY_API_VERSION = '2025-03-25';

// Create axios instance for backend communication
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
apiClient.interceptors.request.use((config) => {
  // Add any auth tokens here if needed
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access');
    }
    if (error.response?.status === 503) {
      // Handle service unavailable (replicas not ready)
      console.warn('AI service temporarily unavailable');
    }
    return Promise.reject(error);
  }
);

// Types based on Sensay API and our backend
export interface SensayStatus {
  status: 'operational' | 'error';
  replicasInitialized: boolean;
  sensayHealth: any;
  timestamp: string;
}

export interface SensayResponse {
  message: string;
  sensayResponse: any;
  timestamp: string;
}

export interface CartAbandonmentData {
  cartId: string;
  user: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  items: CartItem[];
  total: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  addedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  tags: string[];
  inventory: number;
  rating: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  date: Date;
}

export interface OrderUpdateData {
  orderId: string;
  userId: string;
  userPhone?: string;
  status: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  updateType?: 'confirmation' | 'update' | 'delivered';
}

export interface SupportQueryData {
  userId: string;
  query: string;
  channel?: 'web' | 'email' | 'sms' | 'telegram';
}

export interface UserProfileData {
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  preferences?: UserPreferences;
  purchaseHistory?: PurchaseHistoryItem[];
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: NotificationSettings;
  communication: CommunicationChannel[];
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  telegram: boolean;
}

export interface CommunicationChannel {
  type: 'email' | 'sms' | 'telegram' | 'discord';
  address: string;
  verified: boolean;
}

export interface PurchaseHistoryItem {
  orderId: string;
  date: Date;
  total: number;
  items: CartItem[];
}

export interface RecommendationData {
  cart: CartItem[];
  userId: string;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  sensayResponse: SensayResponse;
  message: string;
  timestamp: string;
}

export interface Recommendation {
  id: string;
  name: string;
  price: number;
  description: string;
  discount?: number;
}

// API Service Class
export class SensayService {
  // Health and Status
  static async getStatus(): Promise<SensayStatus> {
    const response = await apiClient.get('/api/sensay/status');
    return response.data;
  }

  // Cart Abandonment Recovery
  static async triggerCartAbandonment(cartData: CartAbandonmentData): Promise<SensayResponse> {
    const response = await apiClient.post('/api/cart/abandon', cartData);
    return response.data;
  }

  // AI Recommendations
  static async getUpsellRecommendations(data: RecommendationData): Promise<RecommendationResponse> {
    const response = await apiClient.post('/api/upsell', data);
    return response.data;
  }

  // Order Tracking
  static async sendOrderUpdate(orderData: OrderUpdateData): Promise<SensayResponse> {
    const response = await apiClient.post('/api/sensay/order/update', orderData);
    return response.data;
  }

  // Customer Support
  static async handleSupportQuery(queryData: SupportQueryData): Promise<SensayResponse> {
    const response = await apiClient.post('/api/sensay/support/query', queryData);
    return response.data;
  }

  // User Profile Management
  static async updateUserProfile(profileData: UserProfileData): Promise<SensayResponse> {
    const response = await apiClient.post('/api/sensay/user/profile', profileData);
    return response.data;
  }
}

// Utility functions for frontend integration
export const sensayUtils = {
  // Generate unique user ID for new users
  generateUserId: (): string => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Format cart data for API
  formatCartForAPI: (cartItems: CartItem[], userId: string): CartAbandonmentData => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return {
      cartId: `cart_${Date.now()}`,
      user: { id: userId },
      items: cartItems,
      total
    };
  },

  // Check if cart is abandoned (no activity for 10 minutes)
  isCartAbandoned: (lastActivity: Date): boolean => {
    const now = new Date();
    const diffMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
    return diffMinutes >= 10;
  },

  // Format order data for tracking
  formatOrderData: (orderId: string, userId: string, status: string): OrderUpdateData => {
    return {
      orderId,
      userId,
      status,
      updateType: 'update'
    };
  },

  // Format support query
  formatSupportQuery: (userId: string, query: string, channel: string = 'web'): SupportQueryData => {
    return {
      userId,
      query,
      channel: channel as SupportQueryData['channel']
    };
  }
};

export default SensayService;
