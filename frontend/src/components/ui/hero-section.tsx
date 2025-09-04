import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShoppingCart, MessageCircle } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-50"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-accent/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* AI Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Powered by Advanced AI</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="text-foreground">The Future of</span>
          <br />
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            AI Commerce
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Experience shopping reimagined with intelligent cart recovery, personalized recommendations, 
          and AI-powered customer support across all channels.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <span className="font-medium text-card-foreground">Smart Cart Recovery</span>
          </div>
          <div className="flex items-center justify-center gap-3 bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="font-medium text-card-foreground">AI Recommendations</span>
          </div>
          <div className="flex items-center justify-center gap-3 bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
            <MessageCircle className="w-5 h-5 text-success" />
            <span className="font-medium text-card-foreground">Multi-Channel Support</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="ai-primary" size="lg" className="group">
            Explore Products
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="ai-secondary" size="lg">
            View Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">98%</div>
            <div className="text-sm text-muted-foreground">Recovery Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">24/7</div>
            <div className="text-sm text-muted-foreground">AI Support</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">+35%</div>
            <div className="text-sm text-muted-foreground">Conversion</div>
          </div>
        </div>
      </div>
    </section>
  );
}