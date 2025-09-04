import { useState, useCallback } from 'react';
import { SensayService, type SensayStatus } from '@/lib/api/sensay';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Hook for monitoring Sensay service status
export function useSensayStatus() {
  return useQuery({
    queryKey: ['sensay-status'],
    queryFn: () => SensayService.getStatus(),
    refetchInterval: 30000, // Check every 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for cart abandonment recovery
export function useCartAbandonment() {
  const queryClient = useQueryClient();

  const abandonmentMutation = useMutation({
    mutationFn: SensayService.triggerCartAbandonment,
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error) => {
      console.error('Cart abandonment recovery failed:', error);
    },
  });

  const triggerRecovery = useCallback(async (cartData: any) => {
    try {
      return await abandonmentMutation.mutateAsync(cartData);
    } catch (error) {
      throw error;
    }
  }, [abandonmentMutation]);

  return {
    triggerRecovery,
    isLoading: abandonmentMutation.isPending,
    error: abandonmentMutation.error,
  };
}

// Hook for AI recommendations
export function useAIRecommendations() {
  const queryClient = useQueryClient();

  const recommendationMutation = useMutation({
    mutationFn: SensayService.getUpsellRecommendations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });

  const getRecommendations = useCallback(async (cartItems: any[], userId: string) => {
    const data = { cart: cartItems, userId };
    return await recommendationMutation.mutateAsync(data);
  }, [recommendationMutation]);

  return {
    getRecommendations,
    isLoading: recommendationMutation.isPending,
    error: recommendationMutation.error,
  };
}

// Hook for order tracking
export function useOrderTracking() {
  const orderMutation = useMutation({
    mutationFn: SensayService.sendOrderUpdate,
    onError: (error) => {
      console.error('Order update failed:', error);
    },
  });

  const sendOrderUpdate = useCallback(async (orderData: any) => {
    return await orderMutation.mutateAsync(orderData);
  }, [orderMutation]);

  return {
    sendOrderUpdate,
    isLoading: orderMutation.isPending,
    error: orderMutation.error,
  };
}

// Hook for AI chat support
export function useAIChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const supportMutation = useMutation({
    mutationFn: SensayService.handleSupportQuery,
    onMutate: () => {
      setIsTyping(true);
    },
    onSettled: () => {
      setIsTyping(false);
    },
  });

  const sendMessage = useCallback(async (userId: string, query: string, channel: 'web' | 'email' | 'sms' | 'telegram' = 'web') => {
    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      content: query,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await supportMutation.mutateAsync({
        userId,
        query,
        channel,
      });

      // Add AI response to chat
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response.sensayResponse?.response || 'I received your message and will help you shortly.',
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      return response;
    } catch (error) {
      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m having trouble responding right now. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessage]);
      throw error;
    }
  }, [supportMutation]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    clearMessages,
    isTyping,
    isLoading: supportMutation.isPending,
    error: supportMutation.error,
  };
}

// Hook for user profile management
export function useUserProfile() {
  const queryClient = useQueryClient();

  const profileMutation = useMutation({
    mutationFn: SensayService.updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });

  const updateProfile = useCallback(async (profileData: any) => {
    return await profileMutation.mutateAsync(profileData);
  }, [profileMutation]);

  return {
    updateProfile,
    isLoading: profileMutation.isPending,
    error: profileMutation.error,
  };
}

// Combined hook for cart monitoring and abandonment
export function useSmartCart() {
  const [lastActivity, setLastActivity] = useState(new Date());
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isAbandoned, setIsAbandoned] = useState(false);

  const { triggerRecovery } = useCartAbandonment();
  const { getRecommendations } = useAIRecommendations();

  // Update cart activity
  const updateActivity = useCallback(() => {
    setLastActivity(new Date());
    setIsAbandoned(false);
  }, []);

  // Add item to cart
  const addItem = useCallback((item: any) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(i => i.productId === item.productId);
      if (existingIndex >= 0) {
        // Update quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity,
        };
        return updated;
      } else {
        // Add new item
        return [...prev, { ...item, addedAt: new Date() }];
      }
    });
    updateActivity();
  }, [updateActivity]);

  // Remove item from cart
  const removeItem = useCallback((productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
    updateActivity();
  }, [updateActivity]);

  // Check for abandonment (every minute)
  useState(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diffMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
      
      if (diffMinutes >= 10 && cartItems.length > 0 && !isAbandoned) {
        setIsAbandoned(true);
        // Could trigger recovery here automatically
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  });

  return {
    cartItems,
    addItem,
    removeItem,
    updateActivity,
    lastActivity,
    isAbandoned,
    triggerRecovery,
    getRecommendations,
  };
}

export default {
  useSensayStatus,
  useCartAbandonment,
  useAIRecommendations,
  useOrderTracking,
  useAIChat,
  useUserProfile,
  useSmartCart,
};
