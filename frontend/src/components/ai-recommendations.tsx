"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  TrendingUp,
  Users,
  ShoppingCart,
  Star,
  MessageCircle,
  Heart,
  Package,
  Clock,
  Target,
  Zap,
  Brain,
  BarChart3
} from "lucide-react";

interface RecommendationItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  reason: string;
  confidence: number;
  tags: string[];
  inStock: boolean;
  isPersonalized: boolean;
  isTrending: boolean;
  discount?: number;
}

interface RecommendationSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: RecommendationItem[];
  type: 'personalized' | 'trending' | 'similar' | 'complementary';
}

interface AIRecommendationsProps {
  onAddToCart: (item: RecommendationItem) => void;
  onStartChat: (itemId: string) => void;
  userPreferences?: {
    categories: string[];
    priceRange: [number, number];
    brands: string[];
  };
}

export function AIRecommendations({ onAddToCart, onStartChat, userPreferences }: AIRecommendationsProps) {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<RecommendationSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string>('personalized');

  // Sample recommendations data - in real app this would come from AI API
  useEffect(() => {
    const sampleRecommendations: RecommendationSection[] = [
      {
        title: "Personalized for You",
        description: "Based on your browsing history and preferences",
        icon: <Target className="w-5 h-5" />,
        type: 'personalized',
        items: [
          {
            id: 'RC001',
            name: 'Professional Studio Headphones',
            price: 249.99,
            originalPrice: 299.99,
            category: 'Electronics',
            brand: 'AudioPro',
            imageUrl: '/api/placeholder/300/200',
            rating: 4.8,
            reviews: 342,
            reason: "Perfect for your audio editing needs",
            confidence: 95,
            tags: ['professional', 'studio', 'high-fidelity'],
            inStock: true,
            isPersonalized: true,
            isTrending: false,
            discount: 17
          },
          {
            id: 'RC002',
            name: 'Ergonomic Wireless Mouse',
            price: 79.99,
            category: 'Accessories',
            brand: 'ErgoTech',
            imageUrl: '/api/placeholder/300/200',
            rating: 4.6,
            reviews: 189,
            reason: "Complements your workspace setup",
            confidence: 88,
            tags: ['ergonomic', 'wireless', 'productivity'],
            inStock: true,
            isPersonalized: true,
            isTrending: false
          },
          {
            id: 'RC003',
            name: 'USB-C Multi-Port Hub',
            price: 59.99,
            category: 'Accessories',
            brand: 'ConnectMax',
            imageUrl: '/api/placeholder/300/200',
            rating: 4.4,
            reviews: 156,
            reason: "Essential for your laptop setup",
            confidence: 92,
            tags: ['usb-c', 'hub', 'connectivity'],
            inStock: true,
            isPersonalized: true,
            isTrending: false
          }
        ]
      },
      {
        title: "Trending Now",
        description: "Popular items trending among customers like you",
        icon: <TrendingUp className="w-5 h-5" />,
        type: 'trending',
        items: [
          {
            id: 'TR001',
            name: 'Smart Home Security Camera',
            price: 129.99,
            category: 'Smart Home',
            brand: 'SecureVision',
            imageUrl: '/api/placeholder/300/200',
            rating: 4.5,
            reviews: 278,
            reason: "Most popular this week",
            confidence: 85,
            tags: ['smart-home', 'security', '4K'],
            inStock: true,
            isPersonalized: false,
            isTrending: true
          },
          {
            id: 'TR002',
            name: 'Portable Power Bank 20000mAh',
            price: 39.99,
            category: 'Accessories',
            brand: 'PowerMax',
            imageUrl: '/api/placeholder/300/200',
            rating: 4.7,
            reviews: 445,
            reason: "High demand item",
            confidence: 78,
            tags: ['portable', 'power-bank', 'fast-charge'],
            inStock: true,
            isPersonalized: false,
            isTrending: true
          }
        ]
      },
      {
        title: "Frequently Bought Together",
        description: "Items commonly purchased with your recent selections",
        icon: <Package className="w-5 h-5" />,
        type: 'complementary',
        items: [
          {
            id: 'FB001',
            name: 'Laptop Stand Adjustable',
            price: 45.99,
            category: 'Accessories',
            brand: 'DeskPro',
            imageUrl: '/api/placeholder/300/200',
            rating: 4.3,
            reviews: 198,
            reason: "Great with your gaming laptop",
            confidence: 90,
            tags: ['adjustable', 'laptop-stand', 'ergonomic'],
            inStock: true,
            isPersonalized: true,
            isTrending: false
          },
          {
            id: 'FB002',
            name: 'Mechanical Gaming Keyboard',
            price: 149.99,
            category: 'Gaming',
            brand: 'KeyForce',
            imageUrl: '/api/placeholder/300/200',
            rating: 4.6,
            reviews: 267,
            reason: "Perfect gaming companion",
            confidence: 87,
            tags: ['mechanical', 'gaming', 'rgb'],
            inStock: true,
            isPersonalized: true,
            isTrending: false
          }
        ]
      },
      {
        title: "Similar to Your Interests",
        description: "Based on items you've viewed and liked",
        icon: <Heart className="w-5 h-5" />,
        type: 'similar',
        items: [
          {
            id: 'SI001',
            name: 'Wireless Gaming Mouse Pro',
            price: 89.99,
            category: 'Gaming',
            brand: 'GameTech',
            imageUrl: '/api/placeholder/300/200',
            rating: 4.4,
            reviews: 223,
            reason: "Similar to items you liked",
            confidence: 82,
            tags: ['wireless', 'gaming', 'precision'],
            inStock: true,
            isPersonalized: true,
            isTrending: false
          }
        ]
      }
    ];
    
    setRecommendations(sampleRecommendations);
    setLoading(false);
  }, [userPreferences]);

  const handleAddToCart = (item: RecommendationItem) => {
    onAddToCart(item);
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const handleAskAI = (item: RecommendationItem) => {
    onStartChat(item.id);
    toast({
      title: "AI Assistant",
      description: `Getting insights about ${item.name}...`,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 80) return 'text-blue-600 bg-blue-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const selectedRecommendations = recommendations.find(r => r.type === selectedSection);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">AI-Powered Recommendations</h2>
        <p className="text-muted-foreground">Discover products tailored just for you</p>
      </div>

      {/* AI Stats */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">98%</div>
              <div className="text-xs text-muted-foreground">AI Accuracy</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-xs text-muted-foreground">Learning</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">1M+</div>
              <div className="text-xs text-muted-foreground">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">Instant</div>
              <div className="text-xs text-muted-foreground">Recommendations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2">
        {recommendations.map(section => (
          <Button
            key={section.type}
            variant={selectedSection === section.type ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSection(section.type)}
            className="flex items-center gap-2"
          >
            {section.icon}
            {section.title}
          </Button>
        ))}
      </div>

      {/* Selected Section */}
      {selectedRecommendations && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              {selectedRecommendations.icon}
              <div>
                <CardTitle>{selectedRecommendations.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedRecommendations.description}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedRecommendations.items.map(item => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {item.isPersonalized && (
                        <Badge className="bg-primary/90 text-white text-xs">
                          <Target className="w-3 h-3 mr-1" />
                          For You
                        </Badge>
                      )}
                      {item.isTrending && (
                        <Badge className="bg-orange-500/90 text-white text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                      {item.discount && (
                        <Badge className="bg-red-500/90 text-white text-xs">
                          -{item.discount}%
                        </Badge>
                      )}
                    </div>

                    {/* AI Confidence */}
                    <div className="absolute top-2 right-2">
                      <Badge className={`text-xs ${getConfidenceColor(item.confidence)}`}>
                        <Brain className="w-3 h-3 mr-1" />
                        {item.confidence}%
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    {/* Product Info */}
                    <div>
                      <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.brand}</p>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">
                        ${item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${item.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {renderStars(item.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.rating} ({item.reviews})
                      </span>
                    </div>

                    {/* AI Reason */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Brain className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-primary">AI Insight</p>
                          <p className="text-xs text-muted-foreground">{item.reason}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => handleAskAI(item)}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Learning Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">🧠 AI That Learns With You</h3>
            <p className="text-muted-foreground">
              Our recommendations get better as you shop. Every interaction helps us understand your preferences better.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <Badge variant="outline">Personalized Learning</Badge>
              <Badge variant="outline">Real-time Adaptation</Badge>
              <Badge variant="outline">Privacy-First</Badge>
              <Badge variant="outline">Always Improving</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
