"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  TestTube,
  ShoppingCart,
  MessageCircle,
  User,
  Package,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export function TestDashboard() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>({});

  const runTest = async (testType: string, testData?: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/test/${testType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData || {}),
      });
      
      const result = await response.json();
      setTestResults(prev => ({ ...prev, [testType]: result }));
      
      toast({
        title: `${testType} Test`,
        description: "Test completed successfully!",
      });
    } catch (error) {
      toast({
        title: `${testType} Test Failed`,
        description: "Unable to complete test.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Enhanced Feature Testing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => runTest('cart-recovery')}
              disabled={isLoading}
              variant="outline"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Test Cart Recovery
            </Button>
            
            <Button
              onClick={() => runTest('ai-recommendations')}
              disabled={isLoading}
              variant="outline"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Test AI Recommendations
            </Button>
            
            <Button
              onClick={() => runTest('order-tracking')}
              disabled={isLoading}
              variant="outline"
            >
              <Package className="w-4 h-4 mr-2" />
              Test Order Tracking
            </Button>
            
            <Button
              onClick={() => runTest('support-chat')}
              disabled={isLoading}
              variant="outline"
            >
              <User className="w-4 h-4 mr-2" />
              Test Support Chat
            </Button>
          </div>
          
          {Object.keys(testResults).length > 0 && (
            <div className="mt-6 space-y-2">
              <h4 className="font-medium">Test Results:</h4>
              {Object.entries(testResults).map(([test, result]: [string, any]) => (
                <div key={test} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{test}: </span>
                  <Badge variant="outline">{result.status || 'Success'}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
