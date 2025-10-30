import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, Sparkles, CheckCircle2, Copy, Home } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function OrderConfirmation() {
  const [, params] = useRoute("/order/:orderNumber");
  const [, setLocation] = useLocation();
  const orderNumber = params?.orderNumber || "";

  const { data: order, isLoading } = trpc.orders.getByNumber.useQuery({ orderNumber });
  const [selectedChain, setSelectedChain] = useState<number | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const walletAddresses = [
    {
      network: "BNB Smart Chain (BSC)",
      tokens: ["BNB", "BUSD", "USDT"],
      address: "0x8a060c3c0ff590165aa55097ae8bf31fb754dd0d",
      qrCode: "/IMG_1563.jpg"
    },
    {
      network: "Solana",
      tokens: ["SOL", "USDC"],
      address: "CYDe9a4Y1TD1uZJxuqeZftqCPYHA2spQNEzGkhRaze6T",
      qrCode: "/IMG_1564.jpg"
    },
    {
      network: "Avalanche C-Chain",
      tokens: ["AVAX", "USDT", "USDC"],
      address: "0x8a060c3c0ff590165aa55097ae8bf31fb754dd0d",
      qrCode: "/IMG_1565.jpg"
    },
    {
      network: "Ethereum",
      tokens: ["ETH", "USDT", "USDC"],
      address: "0x8a060c3c0ff590165aa55097ae8bf31fb754dd0d",
      qrCode: "/IMG_1566.jpg"
    },
    {
      network: "Base",
      tokens: ["USDT", "USDC"],
      address: "0x8a060c3c0ff590165aa55097ae8bf31fb754dd0d",
      qrCode: "/IMG_1567.jpg"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Order Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")}>
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedWallet = selectedChain !== null ? walletAddresses[selectedChain] : null;

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
          <Button variant="ghost" onClick={() => setLocation("/")}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </div>
      </nav>

      {/* Order Confirmation Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Order Confirmed!</h1>
            <p className="text-slate-400">Your order has been successfully created</p>
          </div>

          {/* Invoice */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-2xl mb-2">Invoice</CardTitle>
                  <CardDescription className="text-slate-400">
                    Order #{order.orderNumber}
                  </CardDescription>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  {order.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Info */}
              <div>
                <div className="text-sm text-slate-500 mb-1">Email Address</div>
                <div className="text-white">{order.email}</div>
              </div>

              <Separator className="bg-slate-700" />

              {/* Order Details */}
              <div>
                <div className="text-sm text-slate-500 mb-3">Order Details</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Product:</span>
                    <span className="text-white font-medium">{order.productName}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Quantity:</span>
                    <span>{order.quantity}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Original Price:</span>
                    <span>${(order.originalPrice / 100).toFixed(2)}</span>
                  </div>
                  {order.discountCode && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount ({order.discountCode} - {order.discountPercent}%):</span>
                      <span>-${((order.originalPrice * order.discountPercent / 100) / 100).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="bg-slate-700" />

              {/* Total */}
              <div className="flex justify-between text-2xl font-bold">
                <span className="text-white">Total Amount:</span>
                <span className="text-cyan-400">${(order.finalPrice / 100).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Payment Instructions</CardTitle>
              <CardDescription className="text-slate-400">
                Select a blockchain network and complete your payment using cryptocurrency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  <strong>Important:</strong> Please send exactly <strong>${(order.finalPrice / 100).toFixed(2)} USD</strong> worth of cryptocurrency to the wallet address below. After payment, contact our admin to receive your account details.
                </p>
              </div>

              {/* Chain Selection */}
              <div>
                <div className="text-white font-semibold mb-3">Select Blockchain Network:</div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {walletAddresses.map((wallet, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedChain(idx)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedChain === idx
                          ? "border-cyan-500 bg-cyan-500/10"
                          : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
                      }`}
                    >
                      <div className={`font-semibold mb-1 ${
                        selectedChain === idx ? "text-cyan-400" : "text-white"
                      }`}>
                        {wallet.network.split(" ")[0]}
                      </div>
                      <div className="text-xs text-slate-400">
                        {wallet.tokens.join(", ")}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Chain Details */}
              {selectedWallet && (
                <Card className="bg-slate-900/50 border-cyan-500/30">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">{selectedWallet.network}</CardTitle>
                    <CardDescription className="text-slate-400">
                      Supported tokens: {selectedWallet.tokens.join(", ")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center">
                      <div className="text-sm text-slate-500 mb-2">Scan QR Code</div>
                      <div className="bg-white p-4 rounded-lg">
                        <img 
                          src={selectedWallet.qrCode} 
                          alt={`${selectedWallet.network} QR Code`}
                          className="w-[600px] h-[600px] max-w-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-slate-500">Wallet Address</div>
                      <div className="flex items-center gap-2 bg-slate-950 p-3 rounded border border-slate-700">
                        <code className="text-sm text-cyan-400 flex-1 break-all">
                          {selectedWallet.address}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(selectedWallet.address, "Address")}
                          className="flex-shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!selectedWallet && (
                <div className="text-center py-8 text-slate-500">
                  Please select a blockchain network above to view payment details
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-white text-xl">How to Receive Your Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <div className="text-white font-medium">Complete Payment</div>
                  <div className="text-slate-400 text-sm">Send the exact amount to the wallet address shown above</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <div className="text-white font-medium">Contact Admin</div>
                  <div className="text-slate-400 text-sm">
                    Message{" "}
                    <a 
                      href="https://t.me/jayce6666" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      @jayce6666
                    </a>
                    {" "}on Telegram with your order number: <strong className="text-white">{order.orderNumber}</strong>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <div className="text-white font-medium">Receive Your Account</div>
                  <div className="text-slate-400 text-sm">Get your premium account credentials via email within 24 hours</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-slate-700 hover:bg-slate-800"
              onClick={() => setLocation("/")}
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
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
