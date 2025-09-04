"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  ShoppingCart, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageCircle,
  Star,
  Truck,
  MapPin,
  CreditCard,
  RefreshCw
} from "lucide-react";

interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDelivery: string;
  total: number;
  items: OrderItem[];
  tracking?: {
    carrier: string;
    trackingNumber: string;
    currentLocation: string;
    updates: TrackingUpdate[];
  };
  payment: {
    method: string;
    last4: string;
    status: string;
  };
  shipping: {
    address: string;
    method: string;
    cost: number;
  };
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface TrackingUpdate {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

interface OrderTrackingProps {
  onStartChat: (orderId: string) => void;
}

export function OrderTracking({ onStartChat }: OrderTrackingProps) {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Sample orders data - in real app this would come from API
  useEffect(() => {
    const sampleOrders: Order[] = [
      {
        id: 'ORD-001',
        status: 'shipped',
        createdAt: '2024-01-15T10:30:00Z',
        estimatedDelivery: '2024-01-18T17:00:00Z',
        total: 149.98,
        items: [
          {
            id: 'WH001',
            name: 'Premium Wireless Headphones',
            quantity: 1,
            price: 99.99,
            imageUrl: '/api/placeholder/100/100'
          },
          {
            id: 'BT001',
            name: 'Portable Bluetooth Speaker',
            quantity: 1,
            price: 49.99,
            imageUrl: '/api/placeholder/100/100'
          }
        ],
        tracking: {
          carrier: 'FastShip Express',
          trackingNumber: 'FS123456789',
          currentLocation: 'Distribution Center - Chicago',
          updates: [
            {
              timestamp: '2024-01-17T14:30:00Z',
              status: 'In Transit',
              location: 'Distribution Center - Chicago',
              description: 'Package is on the way to the next facility'
            },
            {
              timestamp: '2024-01-16T09:15:00Z',
              status: 'Processed',
              location: 'Sorting Facility - Denver',
              description: 'Package processed through facility'
            },
            {
              timestamp: '2024-01-15T16:45:00Z',
              status: 'Shipped',
              location: 'Fulfillment Center - Phoenix',
              description: 'Package shipped from fulfillment center'
            }
          ]
        },
        payment: {
          method: 'Credit Card',
          last4: '4242',
          status: 'Paid'
        },
        shipping: {
          address: '123 Main St, Anytown, ST 12345',
          method: 'Standard Shipping',
          cost: 0
        }
      },
      {
        id: 'ORD-002',
        status: 'delivered',
        createdAt: '2024-01-10T14:20:00Z',
        estimatedDelivery: '2024-01-13T17:00:00Z',
        total: 199.99,
        items: [
          {
            id: 'SM001',
            name: 'Smart Fitness Watch',
            quantity: 1,
            price: 199.99,
            imageUrl: '/api/placeholder/100/100'
          }
        ],
        tracking: {
          carrier: 'QuickDeliver',
          trackingNumber: 'QD987654321',
          currentLocation: 'Delivered',
          updates: [
            {
              timestamp: '2024-01-13T15:30:00Z',
              status: 'Delivered',
              location: '123 Main St, Anytown, ST',
              description: 'Package delivered to front door'
            },
            {
              timestamp: '2024-01-13T08:15:00Z',
              status: 'Out for Delivery',
              location: 'Local Delivery Hub',
              description: 'Package out for delivery'
            }
          ]
        },
        payment: {
          method: 'PayPal',
          last4: 'PayPal',
          status: 'Paid'
        },
        shipping: {
          address: '123 Main St, Anytown, ST 12345',
          method: 'Express Shipping',
          cost: 9.99
        }
      },
      {
        id: 'ORD-003',
        status: 'processing',
        createdAt: '2024-01-17T11:45:00Z',
        estimatedDelivery: '2024-01-22T17:00:00Z',
        total: 1299.99,
        items: [
          {
            id: 'LT001',
            name: 'Gaming Laptop Pro',
            quantity: 1,
            price: 1299.99,
            imageUrl: '/api/placeholder/100/100'
          }
        ],
        payment: {
          method: 'Credit Card',
          last4: '1234',
          status: 'Paid'
        },
        shipping: {
          address: '123 Main St, Anytown, ST 12345',
          method: 'Standard Shipping',
          cost: 0
        }
      }
    ];
    
    setOrders(sampleOrders);
    setLoading(false);
  }, []);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-orange-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-orange-100 text-orange-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  const handleGetSupport = (orderId: string) => {
    onStartChat(orderId);
    toast({
      title: "AI Support",
      description: "Starting chat about your order...",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Order Tracking</h2>
        <p className="text-muted-foreground">Track your orders and get AI-powered support</p>
      </div>

      {/* Orders List */}
      <div className="grid gap-6">
        {orders.map(order => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <CardTitle className="text-lg">Order {order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Placed {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total: ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ${item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Shipping Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Shipping Address</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping.address}
                  </p>
                  <p className="text-sm">
                    {order.shipping.method} 
                    {order.shipping.cost > 0 && ` (+$${order.shipping.cost})`}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Payment</span>
                  </div>
                  <p className="text-sm">
                    {order.payment.method}
                    {order.payment.last4 !== 'PayPal' && ` ending in ${order.payment.last4}`}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {order.payment.status}
                  </Badge>
                </div>
              </div>

              {/* Tracking Information */}
              {order.tracking && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Tracking</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      >
                        {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                      </Button>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">
                        {order.tracking.carrier} - {order.tracking.trackingNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Current Location: {order.tracking.currentLocation}
                      </p>
                      {order.status !== 'delivered' && (
                        <p className="text-sm text-muted-foreground">
                          Estimated Delivery: {formatDate(order.estimatedDelivery)}
                        </p>
                      )}
                    </div>

                    {/* Detailed Tracking */}
                    {selectedOrder === order.id && (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {order.tracking.updates.map((update, index) => (
                          <div key={index} className="flex gap-3 p-3 border rounded-lg">
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${
                              index === 0 ? 'bg-primary' : 'bg-muted-foreground'
                            }`} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">{update.status}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(update.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {update.location}
                              </p>
                              <p className="text-sm">{update.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleGetSupport(order.id)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Get Support
                </Button>
                {order.status === 'delivered' && (
                  <Button variant="outline" className="flex-1">
                    <Star className="w-4 h-4 mr-2" />
                    Write Review
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Support Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">🤖 Need Help with Your Order?</h3>
            <p className="text-muted-foreground">
              Our AI assistant can help with order updates, delivery questions, returns, and more
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <Badge variant="outline">Instant Answers</Badge>
              <Badge variant="outline">Order Updates</Badge>
              <Badge variant="outline">Return Support</Badge>
              <Badge variant="outline">24/7 Available</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
