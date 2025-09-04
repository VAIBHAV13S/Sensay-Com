"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  MessageCircle,
  Truck,
  Shield,
  Zap
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  description: string;
  imageUrl: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  features: string[];
  tags: string[];
}

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
  onStartChat: (productId: string) => void;
}

export function ProductCatalog({ onAddToCart, onStartChat }: ProductCatalogProps) {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<Product[]>([]);

  // Sample products data - in real app this would come from API
  useEffect(() => {
    const sampleProducts: Product[] = [
      {
        id: 'WH001',
        name: 'Premium Wireless Headphones',
        price: 99.99,
        category: 'Electronics',
        brand: 'AudioMax',
        description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
        imageUrl: '/api/placeholder/300/200',
        inStock: true,
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
        description: 'Advanced fitness tracking with heart rate monitoring, GPS, and water resistance.',
        imageUrl: '/api/placeholder/300/200',
        inStock: true,
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
        description: 'High-performance gaming laptop with RTX graphics and lightning-fast SSD.',
        imageUrl: '/api/placeholder/300/200',
        inStock: true,
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
        description: 'Compact wireless speaker with 360-degree sound and waterproof design.',
        imageUrl: '/api/placeholder/300/200',
        inStock: true,
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
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
        imageUrl: '/api/placeholder/300/200',
        inStock: true,
        rating: 4.1,
        reviews: 67,
        features: ['Fast Charging', 'Universal Compatible', 'LED Indicator'],
        tags: ['wireless', 'charging', 'accessory']
      }
    ];
    
    setProducts(sampleProducts);
    setLoading(false);
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
    onAddToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleAskQuestion = (product: Product) => {
    onStartChat(product.id);
    toast({
      title: "AI Assistant",
      description: `Starting chat about ${product.name}...`,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
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
        <h2 className="text-3xl font-bold mb-2">Our Products</h2>
        <p className="text-muted-foreground">Discover amazing products with AI-powered assistance</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <span className="font-medium">
                  {cart.length} items in cart
                </span>
              </div>
              <Badge variant="secondary">
                ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Badge variant="destructive">Out of Stock</Badge>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {product.category}
                  </Badge>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ${product.price}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-1">
                {product.features.slice(0, 3).map(feature => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>2yr Warranty</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>Fast Delivery</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={() => handleAskQuestion(product)}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI-Powered Features Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">🤖 AI-Powered Shopping Experience</h3>
            <p className="text-muted-foreground">
              Get personalized recommendations, instant support, and smart cart recovery - all powered by Sensay AI
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <Badge variant="outline">24/7 AI Support</Badge>
              <Badge variant="outline">Smart Recommendations</Badge>
              <Badge variant="outline">Cart Recovery</Badge>
              <Badge variant="outline">Multi-Channel Assistance</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
