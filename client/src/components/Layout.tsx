import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Sun, Moon, TrendingUp, Wallet } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: TrendingUp },
    { name: "AI Predictions", href: "/predictions", icon: TrendingUp },
    { name: "History", href: "/history", icon: TrendingUp },
    { name: "Analytics", href: "/analytics", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-betting-darker/95 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-betting-gold to-betting-green p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-betting-gold to-betting-green bg-clip-text text-transparent">
                BetSim Pro
              </h1>
            </div>
            
            {isAuthenticated && (
              <nav className="hidden md:flex items-center space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`transition-colors ${
                      location === item.href
                        ? "text-betting-gold"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            )}

            <div className="flex items-center space-x-4">
              {isAuthenticated && user && (
                <div className="hidden md:flex items-center space-x-3 bg-gray-800 px-4 py-2 rounded-full">
                  <Wallet className="h-4 w-4 text-betting-green" />
                  <span className="text-sm text-gray-300">Balance:</span>
                  <span className="font-bold text-betting-green">
                    ${parseFloat(user.bankroll || "0").toFixed(2)}
                  </span>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              {!isAuthenticated && (
                <Button
                  onClick={() => window.location.href = "/api/login"}
                  className="bg-gradient-to-r from-betting-gold to-yellow-500 hover:from-yellow-500 hover:to-betting-gold"
                >
                  Sign In
                </Button>
              )}
              {isAuthenticated && (
                <Button
                  onClick={() => window.location.href = "/api/logout"}
                  variant="outline"
                >
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-betting-darker border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-betting-gold to-betting-green p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-xl font-bold">BetSim Pro</h3>
              </div>
              <p className="text-gray-400 text-sm">
                The ultimate sports betting simulator powered by AI predictions and real-time data.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>AI Predictions</li>
                <li>Real-time Data</li>
                <li>Virtual Bankroll</li>
                <li>Analytics Dashboard</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Sports</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>NBA Basketball</li>
                <li>NFL Football</li>
                <li>MLB Baseball</li>
                <li>NHL Hockey</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 BetSim Pro. All rights reserved. This is a simulation platform for entertainment purposes only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
