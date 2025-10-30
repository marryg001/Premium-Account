import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, Sparkles, ArrowLeft, Check } from "lucide-react";

export default function Products() {
  const [, setLocation] = useLocation();
  const { data: products, isLoading } = trpc.products.list.useQuery();

  const productFeatures: Record<string, string[]> = {
    "Gemini Advanced": [
      "2TB Google Drive storage",
      "Notebook LM access",
      "Advanced AI capabilities",
      "Priority support"
    ],
    "Canva Pro": [
      "Unlimited premium templates",
      "Brand kit & fonts",
      "Background remover",
      "Magic resize & animations"
    ],
    "Canva Pro Edu": [
      "All Canva Pro features",
      "Educational resources",
      "Classroom collaboration",
      "Student-friendly pricing"
    ],
    "Perplexity Pro": [
      "Unlimited searches",
      "Advanced AI models",
      "Priority processing",
      "API access"
    ]
  };

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
            <Button variant="ghost" onClick={() => setLocation("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
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

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              All Products
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your Premium Account
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Select from our curated collection of premium accounts. All accounts are verified and delivered instantly.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {products?.map((product) => {
                const features = productFeatures[product.name] || [];
                
                return (
                  <Card 
                    key={product.id} 
                    className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all hover:scale-105 flex flex-col"
                  >
                    <CardHeader>
                      <CardTitle className="text-white text-xl">{product.name}</CardTitle>
                      <CardDescription className="text-slate-400">{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="mb-4">
                        <div className="text-4xl font-bold text-cyan-400">
                          ${(product.price / 100).toFixed(2)}
                        </div>
                        <div className="text-sm text-slate-400">per year</div>
                      </div>
                      
                      {features.length > 0 && (
                        <div className="space-y-2">
                          {features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                              <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                        onClick={() => setLocation(`/checkout/${product.id}`)}
                      >
                        Purchase Now
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
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
