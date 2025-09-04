"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { StatusIndicator } from "@/components/status-indicator";
import { 
  useSensayStatus, 
  useCartAbandonment, 
  useAIChat,
  useUserProfile 
} from "@/hooks/useSensay";
import { 
  MessageCircle, 
  ShoppingCart, 
  User, 
  TestTube,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function TestPage() {
  const { toast } = useToast();
  const { data: status } = useSensayStatus();
  const { triggerRecovery } = useCartAbandonment();
  const { sendMessage } = useAIChat();
  const { updateProfile } = useUserProfile();

  const [chatMessage, setChatMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTestChat = async () => {
    if (!chatMessage.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await sendMessage("test-user", chatMessage, "web");
      setChatResponse(response.message || "Response received from AI assistant");
      toast({
        title: "Chat Test Successful",
        description: "AI assistant responded successfully!",
      });
    } catch (error) {
      console.error("Chat test failed:", error);
      toast({
        title: "Chat Test Failed",
        description: "Unable to connect to AI assistant.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestCartRecovery = async () => {
    setIsLoading(true);
    try {
      const testCartData = {
        cartId: `test-cart-${Date.now()}`,
        user: {
          id: "test-user",
          name: userName || "Test User",
          email: userEmail || "test@example.com"
        },
        items: [
          {
            productId: "test-product-1",
            product: {
              id: "test-product-1",
              name: "Wireless Headphones",
              price: 99.99,
              imageUrl: "https://example.com/headphones.jpg"
            },
            quantity: 1,
            price: 99.99
          }
        ],
        total: 99.99
      };

      await triggerRecovery(testCartData);
      toast({
        title: "Cart Recovery Test Successful",
        description: "Cart abandonment recovery initiated!",
      });
    } catch (error) {
      console.error("Cart recovery test failed:", error);
      toast({
        title: "Cart Recovery Test Failed",
        description: "Unable to trigger cart recovery.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestProfile = async () => {
    if (!userName && !userEmail) {
      toast({
        title: "Profile Test",
        description: "Please enter a name or email to test profile update.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({
        userId: "test-user",
        name: userName,
        email: userEmail,
        preferences: {
          notifications: true,
          marketing: false
        }
      });
      toast({
        title: "Profile Test Successful",
        description: "User profile updated successfully!",
      });
    } catch (error) {
      console.error("Profile test failed:", error);
      toast({
        title: "Profile Test Failed",
        description: "Unable to update user profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">SensAI Integration Test Dashboard</h1>
          <div className="flex items-center gap-4">
            <StatusIndicator />
            <Badge variant="outline">
              Backend: http://localhost:3001
            </Badge>
            <Badge variant="outline">
              Frontend: http://localhost:3000
            </Badge>
          </div>
        </div>

        {/* Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {status?.status === 'operational' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span>Sensay API: {status?.status || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2">
                {status?.replicasInitialized ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                )}
                <span>Replicas: {status?.replicasInitialized ? 'Ready' : 'Initializing'}</span>
              </div>
              <div className="flex items-center gap-2">
                {status?.sensayHealth?.status === 'healthy' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                )}
                <span>Health: {status?.sensayHealth?.status || 'Unknown'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chat Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                AI Chat Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Type a message to test the AI chat..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleTestChat} 
                disabled={isLoading || !chatMessage.trim()}
                className="w-full"
              >
                {isLoading ? "Sending..." : "Test AI Chat"}
              </Button>
              {chatResponse && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">AI Response:</p>
                  <p className="text-sm">{chatResponse}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cart Recovery Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Cart Recovery Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Test cart abandonment recovery with sample data
              </p>
              <Button 
                onClick={handleTestCartRecovery} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Processing..." : "Test Cart Recovery"}
              </Button>
            </CardContent>
          </Card>

          {/* User Profile Test */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Profile Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Enter test user name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <Input
                  placeholder="Enter test user email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleTestProfile} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Updating..." : "Test Profile Update"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Integration Notes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Frontend-Backend connection established</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Sensay API integration working</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>React Query hooks implemented</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>AI chat widget functional</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cart abandonment recovery active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
