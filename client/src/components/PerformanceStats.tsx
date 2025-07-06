import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, DollarSign, Trophy } from "lucide-react";

export default function PerformanceStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/user/stats"],
    staleTime: 30 * 1000, // 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-gray-800/50 backdrop-blur-sm animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-600 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-600 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-12"></div>
                </div>
                <div className="h-8 w-8 bg-gray-600 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-gray-400">No stats available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Profit",
      value: `${stats.profit >= 0 ? '+' : ''}$${stats.profit.toFixed(2)}`,
      change: stats.profit >= 0 ? `+${((stats.profit / 10000) * 100).toFixed(1)}%` : `${((stats.profit / 10000) * 100).toFixed(1)}%`,
      icon: DollarSign,
      color: stats.profit >= 0 ? "text-betting-green" : "text-betting-red",
      bgColor: stats.profit >= 0 ? "from-betting-green/20 to-betting-green/10 border-betting-green/20" : "from-betting-red/20 to-betting-red/10 border-betting-red/20",
    },
    {
      title: "Win Rate",
      value: `${stats.winRate.toFixed(1)}%`,
      change: stats.winRate >= 50 ? "↗ Above Average" : "↘ Below Average",
      icon: Trophy,
      color: stats.winRate >= 50 ? "text-betting-gold" : "text-gray-400",
      bgColor: stats.winRate >= 50 ? "from-betting-gold/20 to-betting-gold/10 border-betting-gold/20" : "from-gray-500/20 to-gray-500/10 border-gray-500/20",
    },
    {
      title: "ROI",
      value: `${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}%`,
      change: stats.roi >= 0 ? "↗ Positive" : "↘ Negative",
      icon: TrendingUp,
      color: stats.roi >= 0 ? "text-betting-green" : "text-betting-red",
      bgColor: stats.roi >= 0 ? "from-betting-green/20 to-betting-green/10 border-betting-green/20" : "from-betting-red/20 to-betting-red/10 border-betting-red/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <Card
          key={index}
          className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm border`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${stat.color} text-sm font-semibold`}>{stat.title}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className={`text-sm ${stat.color}`}>{stat.change}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
