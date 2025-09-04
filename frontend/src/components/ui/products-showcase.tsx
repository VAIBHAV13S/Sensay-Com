import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

export function ProductsShowcase() {
  const featuredProducts = [
    {
      id: "1",
      name: "Wireless AI Headphones",
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviews: 1247,
      image: "/placeholder.svg",
      category: "Electronics",
      isAIRecommended: true,
      discount: 25
    },
    {
      id: "2",
      name: "Smart Fitness Tracker",
      price: 199,
      rating: 4.6,
      reviews: 892,
      image: "/placeholder.svg",
      category: "Wearables",
      isAIRecommended: true
    },
    {
      id: "3",
      name: "Sustainable Eco Bottle",
      price: 45,
      originalPrice: 60,
      rating: 4.9,
      reviews: 456,
      image: "/placeholder.svg",
      category: "Lifestyle",
      discount: 25
    },
    {
      id: "4",
      name: "AI-Powered Smart Speaker",
      price: 149,
      rating: 4.7,
      reviews: 2103,
      image: "/placeholder.svg",
      category: "Smart Home",
      isAIRecommended: true
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-accent/10 text-accent border-accent/20">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Curated
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recommended for You
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover products tailored to your preferences with our advanced AI recommendation engine.
            </p>
          </div>
          <Button variant="ai-secondary" className="group">
            View All Products
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(productId) => {
                console.log('Add to cart:', productId);
                // This would integrate with the backend API
              }}
              onToggleWishlist={(productId) => {
                console.log('Toggle wishlist:', productId);
                // This would integrate with the backend API
              }}
            />
          ))}
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-subtle rounded-2xl p-8 border border-border/50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our AI analyzes your browsing behavior, purchase history, and preferences to suggest 
              products you'll love. The more you shop, the smarter our recommendations become.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-primary mb-1">94%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-accent mb-1">2.3x</div>
                <div className="text-sm text-muted-foreground">Better Discovery</div>
              </div>
              <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-success mb-1">45%</div>
                <div className="text-sm text-muted-foreground">Time Saved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}