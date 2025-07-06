import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, TrendingUp, TrendingDown, Clock, Target } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function HistoryPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const { data: bets, isLoading: betsLoading } = useQuery({
    queryKey: ["/api/bets", { limit: 50 }],
    staleTime: 30 * 1000, // 30 seconds
  });

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

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-betting-darker flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-betting-gold mx-auto mb-4"></div>
          <p className="text-gray-400">Loading betting history...</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "won":
        return <Badge className="bg-betting-green text-white">Won</Badge>;
      case "lost":
        return <Badge className="bg-betting-red text-white">Lost</Badge>;
      case "push":
        return <Badge className="bg-gray-500 text-white">Push</Badge>;
      default:
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "won":
        return <TrendingUp className="h-5 w-5 text-betting-green" />;
      case "lost":
        return <TrendingDown className="h-5 w-5 text-betting-red" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getProfitLoss = (bet: any) => {
    if (bet.status === "won" && bet.payout) {
      const profit = parseFloat(bet.payout) - parseFloat(bet.amount);
      return {
        value: profit,
        text: `+$${profit.toFixed(2)}`,
        color: "text-betting-green",
      };
    } else if (bet.status === "lost") {
      return {
        value: -parseFloat(bet.amount),
        text: `-$${parseFloat(bet.amount).toFixed(2)}`,
        color: "text-betting-red",
      };
    } else if (bet.status === "push") {
      return {
        value: 0,
        text: "$0.00",
        color: "text-gray-400",
      };
    }
    return {
      value: 0,
      text: "Pending",
      color: "text-yellow-500",
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-betting-darker">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-betting-gold to-betting-green bg-clip-text text-transparent">
              Betting History
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Complete record of all your betting activity</p>
        </div>

        {betsLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="bg-gray-800/50 backdrop-blur-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-600 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-600 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-gray-600 rounded w-16 mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-12"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !bets || bets.length === 0 ? (
          <Card className="bg-gray-800/50 backdrop-blur-sm text-center">
            <CardContent className="p-12">
              <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Betting History</h3>
              <p className="text-gray-400">Your bets will appear here once you start betting.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bets.map((bet: any) => {
              const profitLoss = getProfitLoss(bet);
              return (
                <Card key={bet.id} className="bg-gray-800/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          {getStatusIcon(bet.status)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-lg">{bet.pick}</p>
                            {getStatusBadge(bet.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>{bet.homeTeam} vs {bet.awayTeam}</span>
                            <span className="capitalize">{bet.betType}</span>
                            <span>{bet.sport}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(bet.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${profitLoss.color}`}>
                          {profitLoss.text}
                        </p>
                        <p className="text-sm text-gray-400">
                          ${parseFloat(bet.amount).toFixed(2)} bet
                        </p>
                        <p className="text-xs text-gray-500">
                          {bet.odds > 0 ? "+" : ""}{bet.odds}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
