import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, Sparkles, ArrowLeft, Tag, Mail, ShoppingBag } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export default function Checkout() {
  const [, params] = useRoute("/checkout/:productId");
  const [, setLocation] = useLocation();
  const productId = params?.productId ? parseInt(params.productId) : 0;

  const [email, setEmail] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);

  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });
  const validateVoucher = trpc.vouchers.validate.useQuery(
    { code: voucherCode },
    { enabled: false }
  );
  const createOrder = trpc.orders.create.useMutation();

  const finalPrice = useMemo(() => {
    if (!product) return 0;
    if (!appliedVoucher) return product.price;
    return Math.round(product.price * (1 - appliedVoucher.discount / 100));
  }, [product, appliedVoucher]);

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.error("Please enter a voucher code");
      return;
    }

    const result = await validateVoucher.refetch();
    if (result.data?.valid) {
      setAppliedVoucher({
        code: voucherCode.toUpperCase(),
        discount: result.data.discountPercent
      });
      toast.success(`Voucher applied! ${result.data.discountPercent}% discount`);
    } else {
      toast.error("Invalid or expired voucher code");
    }
  };

  const handleCheckout = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const result = await createOrder.mutateAsync({
        email,
        productId,
        discountCode: appliedVoucher?.code
      });

      toast.success("Order created successfully!");
      setLocation(`/order/${result.orderNumber}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create order");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Product Not Found</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setLocation("/products")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
          <Button variant="ghost" onClick={() => setLocation("/products")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </nav>

      {/* Checkout Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              Checkout
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-2">Complete Your Purchase</h1>
            <p className="text-slate-400">Enter your details to proceed with payment</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Summary */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-cyan-400" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-lg font-semibold text-white">{product.name}</div>
                  <div className="text-sm text-slate-400">{product.description}</div>
                </div>

                <div className="border-t border-slate-700 pt-4 space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Original Price:</span>
                    <span>${(product.price / 100).toFixed(2)}</span>
                  </div>

                  {appliedVoucher && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount ({appliedVoucher.discount}%):</span>
                      <span>-${((product.price * appliedVoucher.discount / 100) / 100).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xl font-bold text-cyan-400 border-t border-slate-700 pt-2">
                    <span>Total:</span>
                    <span>${(finalPrice / 100).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="h-5 w-5 text-cyan-400" />
                  Your Information
                </CardTitle>
                <CardDescription className="text-slate-400">
                  We'll send your account details to this email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                  <p className="text-xs text-slate-500">
                    Accepted: Gmail, Proton Mail, Yahoo, Hotmail, Outlook
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voucher" className="text-slate-300 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Voucher Code (Optional)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="voucher"
                      type="text"
                      placeholder="FRIDAY50"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      disabled={!!appliedVoucher}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                    <Button
                      onClick={handleApplyVoucher}
                      disabled={!!appliedVoucher || validateVoucher.isFetching}
                      variant="outline"
                      className="bg-transparent border-slate-700"
                    >
                      {validateVoucher.isFetching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                  {appliedVoucher && (
                    <div className="flex items-center justify-between text-sm text-green-400">
                      <span>✓ Voucher applied: {appliedVoucher.code}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAppliedVoucher(null);
                          setVoucherCode("");
                        }}
                        className="text-slate-400 hover:text-white"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  onClick={handleCheckout}
                  disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>
              </CardFooter>
            </Card>
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
