import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusIndicator } from "@/components/ui/status-indicator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  Heart,
  Settings,
  LogOut,
  Package,
  Star,
  Sparkles
} from "lucide-react";

export function Navigation() {
  const [cartItems, setCartItems] = useState(3);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SensAI
              </span>
            </div>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-96">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Categories</h4>
                          <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-muted-foreground hover:text-foreground">Electronics</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-foreground">Fashion</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-foreground">Home & Garden</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-foreground">Sports</a></li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">AI Features</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-primary" />
                              <a href="#" className="text-muted-foreground hover:text-foreground">AI Recommendations</a>
                            </li>
                            <li className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-accent" />
                              <a href="#" className="text-muted-foreground hover:text-foreground">Smart Search</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>AI Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-80">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <ShoppingCart className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-medium">Cart Recovery</div>
                            <div className="text-sm text-muted-foreground">AI-powered abandonment recovery</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
                          <Sparkles className="w-5 h-5 text-accent" />
                          <div>
                            <div className="font-medium">Smart Recommendations</div>
                            <div className="text-sm text-muted-foreground">Personalized product suggestions</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search with AI..."
                className="pl-10 pr-4"
              />
              <Badge className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-primary/10 text-primary border-primary/20">
                AI
              </Badge>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {/* Status Indicator */}
            <StatusIndicator />

            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="w-5 h-5" />
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="w-5 h-5" />
              <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                2
              </Badge>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItems > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {cartItems}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10 w-10 rounded-md p-0">
                    <User className="w-5 h-5" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-2 w-48">
                      <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start">
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <Package className="w-4 h-4 mr-2" />
                          Orders
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Button>
                        <hr className="my-2" />
                        <Button variant="ghost" className="w-full justify-start text-destructive">
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile Menu */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search with AI..."
                  className="pl-10 pr-4 w-full"
                />
              </div>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">Products</Button>
                <Button variant="ghost" className="w-full justify-start">AI Features</Button>
                <Button variant="ghost" className="w-full justify-start">Support</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}