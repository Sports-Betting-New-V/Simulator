import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, TrendingUp, TrendingDown } from "lucide-react";

export default function BettingHistory({ limit = 10 }: { limit?: number }) {
  const { data: bets, isLoading } = useQuery({
    queryKey: ["/api/bets/recent", { limit }],
    staleTime: 30 * 1000, // 30 seconds
  });

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-betting-green" />
            Recent Bets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-600 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-600 rounded w-16"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-600 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-600 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!bets || bets.length === 0) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-betting-green" />
            Recent Bets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No bets placed yet.</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "won":
        return <TrendingUp className="h-4 w-4 text-betting-green" />;
      case "lost":
        return <TrendingDown className="h-4 w-4 text-betting-red" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-yellow-500"></div>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "text-betting-green";
      case "lost":
        return "text-betting-red";
      default:
        return "text-yellow-500";
    }
  };

  const getProfitText = (bet: any) => {
    if (bet.status === "won" && bet.payout) {
      const profit = parseFloat(bet.payout) - parseFloat(bet.amount);
      return `+$${profit.toFixed(2)}`;
    } else if (bet.status === "lost") {
      return `-$${parseFloat(bet.amount).toFixed(2)}`;
    }
    return "Pending";
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-betting-green" />
          Recent Bets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bets.map((bet: any) => (
            <div
              key={bet.id}
              className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  {getStatusIcon(bet.status)}
                </div>
                <div>
                  <p className="font-semibold">{bet.pick}</p>
                  <p className="text-sm text-gray-400">
                    {bet.homeTeam} vs {bet.awayTeam} • {bet.betType}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${getStatusColor(bet.status)}`}>
                  {getProfitText(bet)}
                </p>
                <p className="text-sm text-gray-400">
                  ${parseFloat(bet.amount).toFixed(2)} bet
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
