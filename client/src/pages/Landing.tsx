import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, TrendingUp, Wallet, BarChart3, Star } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-betting-dark via-betting-darker to-gray-900">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-betting-dark/90 via-betting-darker/80 to-betting-dark/90"></div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-betting-gold via-yellow-400 to-betting-green bg-clip-text text-transparent">
                    AI-Powered
                  </span>
                  <br />
                  <span className="text-white">Sports Betting</span>
                  <br />
                  <span className="text-gray-300">Simulator</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Experience the thrill of sports betting with our advanced AI predictions, real-time data, and comprehensive analytics. Start with $10,000 virtual currency and test your betting strategies risk-free.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-betting-gold to-yellow-500 hover:from-yellow-500 hover:to-betting-gold text-lg px-8 py-6"
                  >
                    Start Betting Free
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-betting-green text-betting-green hover:bg-betting-green hover:text-white text-lg px-8 py-6"
                >
                  Watch Demo
                </Button>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-6 mt-12">
                <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                  <CardContent className="p-6">
                    <Bot className="h-8 w-8 text-betting-gold mb-3" />
                    <h3 className="font-semibold text-lg mb-2">AI Predictions</h3>
                    <p className="text-gray-400 text-sm">GPT-4 powered betting insights</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                  <CardContent className="p-6">
                    <TrendingUp className="h-8 w-8 text-betting-green mb-3" />
                    <h3 className="font-semibold text-lg mb-2">Real-Time Data</h3>
                    <p className="text-gray-400 text-sm">Live ESPN sports feeds</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                  <CardContent className="p-6">
                    <Wallet className="h-8 w-8 text-betting-gold mb-3" />
                    <h3 className="font-semibold text-lg mb-2">Virtual Bankroll</h3>
                    <p className="text-gray-400 text-sm">$10,000 starting balance</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                  <CardContent className="p-6">
                    <BarChart3 className="h-8 w-8 text-betting-green mb-3" />
                    <h3 className="font-semibold text-lg mb-2">Analytics</h3>
                    <p className="text-gray-400 text-sm">Track your performance</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="lg:w-1/2">
              <Card className="bg-gray-800/30 backdrop-blur-sm border-gray-700 p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Live Dashboard Preview</h3>
                
                {/* Bankroll Display */}
                <div className="bg-gradient-to-r from-betting-green/20 to-betting-gold/20 p-6 rounded-xl mb-6">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Current Bankroll</p>
                    <p className="text-4xl font-bold text-betting-green mb-2">$8,750.00</p>
                    <p className="text-betting-gold text-sm">+$750.00 (8.6%) Today</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">67%</p>
                    <p className="text-gray-400 text-xs">Win Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-betting-green">+12.3%</p>
                    <p className="text-gray-400 text-xs">ROI</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-betting-gold">156</p>
                    <p className="text-gray-400 text-xs">Total Bets</p>
                  </div>
                </div>

                {/* AI Prediction Preview */}
                <div className="bg-gray-700/50 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">AI Prediction</span>
                    <Badge className="bg-betting-green text-white">High Confidence</Badge>
                  </div>
                  <p className="text-sm text-gray-300 mb-1">Lakers -3.5 vs Warriors</p>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-betting-gold" />
                    <span className="text-betting-gold text-sm">Edge Score: 8.2/10</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
