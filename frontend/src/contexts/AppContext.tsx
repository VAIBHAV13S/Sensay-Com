"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { sensayUtils } from '@/lib/api/sensay';

interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  preferences?: {
    theme: 'light' | 'dark';
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      telegram: boolean;
    };
  };
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  cartItems: any[];
  addToCart: (item: any) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Initialize user on app start
  useEffect(() => {
    const initializeUser = () => {
      try {
        // Check for existing user in localStorage
        const savedUser = localStorage.getItem('sensai_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // Create new user
          const newUser: User = {
            id: sensayUtils.generateUserId(),
            preferences: {
              theme: 'light',
              language: 'en',
              notifications: {
                email: true,
                sms: false,
                push: true,
                telegram: false,
              },
            },
          };
          setUser(newUser);
          localStorage.setItem('sensai_user', JSON.stringify(newUser));
        }

        // Load cart from localStorage
        const savedCart = localStorage.getItem('sensai_cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Failed to initialize user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Save user to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('sensai_user', JSON.stringify(user));
    }
  }, [user]);

  // Save cart to localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('sensai_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: any) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(i => i.productId === item.productId);
      if (existingIndex >= 0) {
        // Update quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (item.quantity || 1),
        };
        return updated;
      } else {
        // Add new item
        return [...prev, { 
          ...item, 
          quantity: item.quantity || 1,
          addedAt: new Date().toISOString(),
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const value: AppContextType = {
    user,
    setUser,
    isLoading,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppProvider;
