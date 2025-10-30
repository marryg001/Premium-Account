import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, ShoppingCart, Sparkles, Shield, Zap } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: products, isLoading } = trpc.products.list.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-cyan-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Premium Accounts Store
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation("/products")}>
              Products
            </Button>
            <Button variant="outline" className="bg-transparent">
              Contact
            </Button>
          </div>
        </div>
      </nav>

      {/* Black Friday Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 py-3">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white font-semibold text-lg">
            🎉 BLACK FRIDAY SPECIAL: Use code <span className="font-bold bg-white text-red-600 px-2 py-1 rounded">FRIDAY50</span> for 50% OFF! 🎉
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-image-1.png')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              Premium Digital Services
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
              Unlock Premium Features at Unbeatable Prices
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Get instant access to premium accounts for Canva Pro, Gemini Advanced, Perplexity Pro, and ChatGPT Go. Secure, affordable, and delivered instantly.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                onClick={() => setLocation("/products")}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Browse Products
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-slate-700 hover:bg-slate-800"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Shield className="h-10 w-10 text-cyan-400 mb-2" />
                <CardTitle className="text-white">Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">All accounts are verified and guaranteed to work. Your satisfaction is our priority.</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Zap className="h-10 w-10 text-cyan-400 mb-2" />
                <CardTitle className="text-white">Instant Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">Receive your premium account details immediately after payment confirmation.</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Sparkles className="h-10 w-10 text-cyan-400 mb-2" />
                <CardTitle className="text-white">Best Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">Get premium features at a fraction of the original cost. Save up to 70% on subscriptions.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Products</h2>
            <p className="text-slate-400 text-lg">Choose from our selection of premium accounts</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {products?.slice(0, 4).map((product) => (
                <Card key={product.id} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all">
                  <CardHeader>
                    <CardTitle className="text-white">{product.name}</CardTitle>
                    <CardDescription className="text-slate-400">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-cyan-400">
                      ${(product.price / 100).toFixed(2)}
                      <span className="text-sm text-slate-400 font-normal">/year</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      onClick={() => setLocation(`/checkout/${product.id}`)}
                    >
                      Get Started
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="lg"
              className="bg-transparent border-slate-700 hover:bg-slate-800"
              onClick={() => setLocation("/products")}
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <span className="text-slate-400">© 2024 Premium Accounts Store</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-400">Contact:</span>
              <a 
                href="https://t.me/jayce6666" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                @jayce6666
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
