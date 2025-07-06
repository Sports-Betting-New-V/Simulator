import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Target, Calendar, DollarSign } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Analytics() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/user/stats"],
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
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-betting-darker">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-betting-gold to-betting-green bg-clip-text text-transparent">
                Performance Analytics
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Track your betting patterns and optimize your strategy</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-gray-800/50 backdrop-blur-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="h-64 bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-betting-darker">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-betting-gold to-betting-green bg-clip-text text-transparent">
                Performance Analytics
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Track your betting patterns and optimize your strategy</p>
          </div>
          
          <Card className="bg-gray-800/50 backdrop-blur-sm text-center">
            <CardContent className="p-12">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Analytics Data</h3>
              <p className="text-gray-400">Start betting to see your performance analytics.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-betting-darker">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-betting-gold to-betting-green bg-clip-text text-transparent">
              Performance Analytics
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Track your betting patterns and optimize your strategy</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detailed Statistics */}
          <Card className="bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-betting-gold" />
                Detailed Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-betting-green mx-auto mb-2" />
                  <p className="text-2xl font-bold text-betting-green">
                    ${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-400">Total Profit</p>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <Target className="h-8 w-8 text-betting-gold mx-auto mb-2" />
                  <p className="text-2xl font-bold text-betting-gold">
                    {stats.winRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-400">Win Rate</p>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-betting-green mx-auto mb-2" />
                  <p className="text-2xl font-bold text-betting-green">
                    {stats.roi >= 0 ? '+' : ''}{stats.roi.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-400">ROI</p>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats.totalBets}</p>
                  <p className="text-sm text-gray-400">Total Bets</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Win/Loss Breakdown */}
          <Card className="bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-betting-green" />
                Win/Loss Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Wins</span>
                    <span className="text-sm font-medium text-betting-green">
                      {stats.wins} ({stats.totalBets > 0 ? ((stats.wins / stats.totalBets) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                  <Progress 
                    value={stats.totalBets > 0 ? (stats.wins / stats.totalBets) * 100 : 0} 
                    className="h-2"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Losses</span>
                    <span className="text-sm font-medium text-betting-red">
                      {stats.losses} ({stats.totalBets > 0 ? ((stats.losses / stats.totalBets) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                  <Progress 
                    value={stats.totalBets > 0 ? (stats.losses / stats.totalBets) * 100 : 0} 
                    className="h-2"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Pending</span>
                    <span className="text-sm font-medium text-yellow-500">
                      {stats.pending} ({stats.totalBets > 0 ? ((stats.pending / stats.totalBets) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                  <Progress 
                    value={stats.totalBets > 0 ? (stats.pending / stats.totalBets) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Betting Summary */}
          <Card className="bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-betting-gold" />
                Betting Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-300">Total Wagered</span>
                  <span className="font-semibold text-white">${stats.totalWagered.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-300">Total Returned</span>
                  <span className="font-semibold text-betting-green">${stats.totalPayout.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-300">Net Profit/Loss</span>
                  <span className={`font-semibold ${stats.profit >= 0 ? 'text-betting-green' : 'text-betting-red'}`}>
                    ${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-300">Average Bet Size</span>
                  <span className="font-semibold text-white">
                    ${stats.totalBets > 0 ? (stats.totalWagered / stats.totalBets).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card className="bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-betting-green" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Win Rate Analysis</h4>
                  <p className="text-sm text-gray-300">
                    {stats.winRate >= 60 ? "Excellent" : 
                     stats.winRate >= 50 ? "Good" : 
                     stats.winRate >= 40 ? "Average" : "Needs Improvement"} 
                    performance with {stats.winRate.toFixed(1)}% win rate
                  </p>
                </div>
                
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <h4 className="font-semibold mb-2">ROI Analysis</h4>
                  <p className="text-sm text-gray-300">
                    {stats.roi >= 10 ? "Outstanding" : 
                     stats.roi >= 5 ? "Very Good" : 
                     stats.roi >= 0 ? "Profitable" : "Losing"} 
                    return on investment at {stats.roi.toFixed(1)}%
                  </p>
                </div>
                
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Betting Volume</h4>
                  <p className="text-sm text-gray-300">
                    {stats.totalBets >= 100 ? "High volume" : 
                     stats.totalBets >= 50 ? "Moderate volume" : 
                     stats.totalBets >= 10 ? "Low volume" : "Just getting started"} 
                    with {stats.totalBets} total bets
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
