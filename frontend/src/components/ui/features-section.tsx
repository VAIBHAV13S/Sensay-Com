import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  MessageCircle, 
  Sparkles, 
  Zap, 
  Target, 
  TrendingUp,
  Shield,
  Clock
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: ShoppingCart,
      title: "Smart Cart Recovery",
      description: "AI-powered abandonment recovery with personalized messages across multiple channels",
      badge: "98% Recovery Rate",
      color: "primary"
    },
    {
      icon: MessageCircle,
      title: "Multi-Channel Support",
      description: "Seamless customer support via web, email, SMS, Telegram with intelligent routing",
      badge: "24/7 Available",
      color: "accent"
    },
    {
      icon: Sparkles,
      title: "AI Recommendations",
      description: "Dynamic product suggestions based on behavior, preferences, and real-time analysis",
      badge: "+35% Conversion",
      color: "success"
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Instant responses and updates powered by advanced AI algorithms and machine learning",
      badge: "&lt; 100ms Response",
      color: "warning"
    },
    {
      icon: Target,
      title: "Personalization Engine",
      description: "Tailored shopping experiences that adapt to individual customer preferences and behavior",
      badge: "Smart Learning",
      color: "primary"
    },
    {
      icon: TrendingUp,
      title: "Conversion Analytics",
      description: "Deep insights into customer behavior and AI-powered optimization recommendations",
      badge: "Advanced Insights",
      color: "accent"
    }
  ];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Powered by Advanced AI
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Revolutionary Commerce Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of e-commerce with our AI-powered platform that transforms 
            how customers discover, interact, and purchase products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-ai hover:border-primary/20 transition-all duration-500 bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center
                    ${feature.color === 'primary' ? 'bg-primary/10 text-primary' : ''}
                    ${feature.color === 'accent' ? 'bg-accent/10 text-accent' : ''}
                    ${feature.color === 'success' ? 'bg-success/10 text-success' : ''}
                    ${feature.color === 'warning' ? 'bg-warning/10 text-warning' : ''}
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-card-foreground">{feature.title}</h3>
                      <Badge 
                        variant="outline" 
                        className={`
                          text-xs
                          ${feature.color === 'primary' ? 'border-primary/20 text-primary' : ''}
                          ${feature.color === 'accent' ? 'border-accent/20 text-accent' : ''}
                          ${feature.color === 'success' ? 'border-success/20 text-success' : ''}
                          ${feature.color === 'warning' ? 'border-warning/20 text-warning' : ''}
                        `}
                      >
                        {feature.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-16 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-success" />
              <div>
                <div className="font-semibold">Enterprise Security</div>
                <div className="text-sm text-muted-foreground">SOC 2 Compliant</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold">99.9% Uptime</div>
                <div className="text-sm text-muted-foreground">Always Available</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <div>
                <div className="font-semibold">Lightning Fast</div>
                <div className="text-sm text-muted-foreground">&lt; 100ms Response</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <div>
                <div className="font-semibold">Proven Results</div>
                <div className="text-sm text-muted-foreground">+35% Conversion</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}