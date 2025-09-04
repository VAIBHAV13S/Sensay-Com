"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TestDashboard } from "@/components/test-dashboard";
import { ChatWidget } from "@/components/chat-widget";
import { StatusIndicator } from "@/components/status-indicator";
import { ProductCatalog } from "@/components/product-catalog";
import { OrderTracking } from "@/components/order-tracking";
import { AIRecommendations } from "@/components/ai-recommendations";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  brand?: string;
}

type TabValue = "overview" | "products" | "recommendations" | "orders" | "test";

export default function Home() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabValue>("overview");
  const [chatContext, setChatContext] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const handleAddToCart = (product: Product) => {
    // In a real app, this would update cart state
    console.log("Added to cart:", product);
    toast({
      title: "Added to Cart",
      description: `${product.name || 'Product'} has been added to your cart.`,
    });
  };

  const handleStartChat = (context: string) => {
    try {
      setChatContext(context);
      setIsChatOpen(true);
      toast({
        title: "AI Assistant Activated",
        description: "Chat widget is ready to help you!",
      });
    } catch (error) {
      console.error("Error starting chat:", error);
      toast({
        title: "Error",
        description: "Failed to start chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStartChatWithOrder = (orderId: string) => {
    try {
      if (!orderId) {
        toast({
          title: "Error",
          description: "Invalid order ID provided.",
          variant: "destructive",
        });
        return;
      }
      
      setChatContext(`Help with order ${orderId}`);
      setIsChatOpen(true);
      toast({
        title: "AI Assistant Activated",
        description: `Getting help for order ${orderId}`,
      });
    } catch (error) {
      console.error("Error starting chat with order:", error);
      toast({
        title: "Error",
        description: "Failed to start chat for order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabValue);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">S</span>
                </div>
                <h1 className="text-2xl font-bold">Sensai</h1>
              </div>
              <Badge variant="secondary">AI-Powered E-commerce</Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                🏆 Sensay Connect Hackathon
              </Badge>
            </div>
            <StatusIndicator />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">
              Welcome to the Future of E-commerce
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience AI-powered shopping with Sensay integration. Get personalized recommendations, 
              instant support, and seamless multi-channel assistance.
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="outline">Multi-Channel Messaging</Badge>
              <Badge variant="outline">AI Recommendations</Badge>
              <Badge variant="outline">Smart Cart Recovery</Badge>
              <Badge variant="outline">24/7 Support</Badge>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="recommendations">AI Picks</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="test">Test Dashboard</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      🤖 AI Assistant
                    </CardTitle>
                    <CardDescription>
                      24/7 intelligent customer support powered by Sensay
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Instant product recommendations</li>
                      <li>• Order tracking and updates</li>
                      <li>• Multi-channel support (WhatsApp, Email, Web)</li>
                      <li>• Natural language queries</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      🛒 Smart Shopping
                    </CardTitle>
                    <CardDescription>
                      Personalized shopping experience with AI insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• AI-powered product discovery</li>
                      <li>• Cart abandonment recovery</li>
                      <li>• Dynamic pricing recommendations</li>
                      <li>• Cross-sell and upsell suggestions</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      📦 Order Management
                    </CardTitle>
                    <CardDescription>
                      Comprehensive order tracking and management
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Real-time order tracking</li>
                      <li>• Automated status updates</li>
                      <li>• Delivery notifications</li>
                      <li>• Easy returns and exchanges</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Hackathon Features Showcase */}
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🏆 Sensay Connect Hackathon Features
                  </CardTitle>
                  <CardDescription>
                    Complete E-commerce Platform with Advanced AI Integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl mb-2">💬</div>
                      <h4 className="font-semibold">Multi-Channel Messaging</h4>
                      <p className="text-sm text-muted-foreground">WhatsApp, Email, Web Chat</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl mb-2">🧠</div>
                      <h4 className="font-semibold">AI Recommendations</h4>
                      <p className="text-sm text-muted-foreground">Personalized Product Suggestions</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl mb-2">🛒</div>
                      <h4 className="font-semibold">Smart Cart Recovery</h4>
                      <p className="text-sm text-muted-foreground">Automated Abandonment Prevention</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl mb-2">📱</div>
                      <h4 className="font-semibold">Post-Purchase Support</h4>
                      <p className="text-sm text-muted-foreground">Automated Customer Care</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Integration Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Integration Status</CardTitle>
                  <CardDescription>
                    Current status of Sensay AI integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Frontend Connection</span>
                        <Badge variant="default">✓ Connected</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Backend API</span>
                        <Badge variant="default">✓ Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Sensay Integration</span>
                        <Badge variant="default">✓ Operational</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Enhanced Features</span>
                        <Badge variant="default">✓ Ready</Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>AI Chat Service</span>
                        <Badge variant="default">✓ Ready</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Multi-channel Support</span>
                        <Badge variant="default">✓ Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Real-time Updates</span>
                        <Badge variant="default">✓ Live</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>AI Recommendations</span>
                        <Badge variant="default">✓ Active</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products">
              <ProductCatalog 
                onAddToCart={handleAddToCart}
                onStartChat={handleStartChat}
              />
            </TabsContent>

            <TabsContent value="recommendations">
              <AIRecommendations
                onAddToCart={handleAddToCart}
                onStartChat={handleStartChat}
                userPreferences={{
                  categories: ['Electronics', 'Gaming'],
                  priceRange: [50, 500],
                  brands: ['AudioMax', 'GameTech']
                }}
              />
            </TabsContent>

            <TabsContent value="orders">
              <OrderTracking onStartChat={handleStartChatWithOrder} />
            </TabsContent>

            <TabsContent value="test">
              <TestDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Chat Widget */}
      <ChatWidget 
        isOpen={isChatOpen}
        onToggle={handleToggleChat}
        initialContext={chatContext} 
      />
    </div>
  );
}
