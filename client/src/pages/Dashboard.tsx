import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import PerformanceStats from "@/components/PerformanceStats";
import GamesList from "@/components/GamesList";
import BettingHistory from "@/components/BettingHistory";
import AIPredictions from "@/components/AIPredictions";
import QuickBetForm from "@/components/QuickBetForm";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-betting-darker flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-betting-gold mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-betting-darker">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-betting-gold to-betting-green bg-clip-text text-transparent">
              Your Betting Dashboard
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Track your performance and make informed betting decisions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Cards */}
            <PerformanceStats />

            {/* Live Games */}
            <GamesList />

            {/* Recent Bets */}
            <BettingHistory />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Bet */}
            <QuickBetForm />

            {/* AI Predictions */}
            <AIPredictions />
          </div>
        </div>
      </div>
    </div>
  );
}
