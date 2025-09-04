"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Minimize2,
  ShoppingCart,
  Package,
  Heart,
  AlertCircle
} from "lucide-react";
import { useSensayStatus, useAIChat } from "@/hooks/useSensay";
import { useApp } from "@/contexts/AppContext";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'recommendation' | 'support' | 'cart' | 'error';
}

interface AIChatWidgetProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AIChatWidget({ isOpen = false, onToggle }: AIChatWidgetProps) {
  const { user } = useApp();
  const { toast } = useToast();
  const { data: sensayStatus } = useSensayStatus();
  const { sendMessage, isTyping } = useAIChat();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI shopping assistant powered by Sensay. I can help you find products, recover your cart, track orders, or answer any questions you have!",
      role: 'assistant',
      timestamp: new Date(),
      type: 'support'
    }
  ]);
  const [input, setInput] = useState("");

  // Add welcome message if user is logged in
  useEffect(() => {
    if (user && messages.length === 1) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `Welcome back, ${user.name}! How can I assist you today?`,
        role: 'assistant',
        timestamp: new Date(),
        type: 'support'
      };
      setMessages(prev => [...prev, welcomeMessage]);
    }
  }, [user, messages.length]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");

    try {
      const response = await sendMessage(
        user?.id || 'anonymous',
        currentInput,
        'web'
      );

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message || "I'm here to help! Let me know if you have any questions.",
        role: 'assistant',
        timestamp: new Date(),
        type: 'support'
      };

      setMessages(prev => [...prev, aiResponse]);

      // Show toast for successful responses
      if (response.sensayResponse) {
        toast({
          title: "AI Assistant",
          description: "I'm here to help you!",
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to AI assistant. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleQuickAction = async (action: string) => {
    let message = "";
    switch (action) {
      case "recover-cart":
        message = "Can you help me recover my abandoned cart?";
        break;
      case "order-status":
        message = "What's the status of my recent orders?";
        break;
      case "recommendations":
        message = "Can you recommend some products for me?";
        break;
      default:
        return;
    }
    
    setInput(message);
    // Auto-send the message
    setTimeout(() => handleSendMessage(), 100);
  };

  const isOnline = sensayStatus?.status === 'operational';
  const quickActions = [
    { icon: ShoppingCart, label: "Cart Recovery", action: "recover-cart" },
    { icon: Package, label: "Order Status", action: "order-status" },
    { icon: Heart, label: "Recommendations", action: "recommendations" }
  ];

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-ai bg-gradient-primary hover:shadow-glow transition-all duration-300 z-50"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-ai border-primary/20 z-50 flex flex-col">
      <CardHeader className="pb-3 bg-gradient-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm">AI Assistant</CardTitle>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                <span className="text-xs opacity-90">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
                {sensayStatus?.status === 'error' && (
                  <AlertCircle className="w-3 h-3 text-yellow-400 ml-1" />
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="w-6 h-6 text-primary-foreground hover:bg-primary-foreground/20">
              <Minimize2 className="w-3 h-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-6 h-6 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={onToggle}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {message.content}
                  {message.type && (
                    <Badge 
                      variant="outline" 
                      className={`mt-2 text-xs ${
                        message.type === 'error' ? 'border-red-400 text-red-600' : ''
                      }`}
                    >
                      {message.type === 'recommendation' && '🎯 Recommendation'}
                      {message.type === 'support' && '💬 Support'}
                      {message.type === 'cart' && '🛒 Cart'}
                      {message.type === 'error' && '⚠️ Error'}
                    </Badge>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-3 h-3 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3 h-3 text-primary-foreground" />
                </div>
                <div className="bg-muted text-muted-foreground p-3 rounded-lg text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2 mb-3">
            {quickActions.map((action) => (
              <Button
                key={action.action}
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-8"
                onClick={() => handleQuickAction(action.action)}
                disabled={isTyping}
              >
                <action.icon className="w-3 h-3 mr-1" />
                {action.label}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              variant="ai-primary"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}