import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tv, Clock } from "lucide-react";

export default function GamesList({ limit = 10 }: { limit?: number }) {
  const { data: games, isLoading } = useQuery({
    queryKey: ["/api/games", { limit }],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tv className="h-5 w-5 text-betting-gold" />
            Live Games
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-700/50 p-4 rounded-xl animate-pulse">
                <div className="h-4 bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-8 bg-gray-600 rounded"></div>
                  <div className="h-8 bg-gray-600 rounded"></div>
                  <div className="h-8 bg-gray-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!games || games.length === 0) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tv className="h-5 w-5 text-betting-gold" />
            Live Games
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No games available at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-red-500 text-white">LIVE</Badge>;
      case "scheduled":
        return <Badge className="bg-betting-green text-white">UPCOMING</Badge>;
      case "final":
        return <Badge className="bg-gray-500 text-white">FINAL</Badge>;
      default:
        return <Badge variant="secondary">{status.toUpperCase()}</Badge>;
    }
  };

  const formatGameTime = (gameTime: string) => {
    const date = new Date(gameTime);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tv className="h-5 w-5 text-betting-gold" />
          Live Games
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {games.map((game: any) => (
            <div key={game.id} className="bg-gray-700/50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-betting-gold/20 to-betting-green/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">{game.sport}</span>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {game.awayTeam} @ {game.homeTeam}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="h-3 w-3" />
                      {formatGameTime(game.gameTime)}
                    </div>
                  </div>
                </div>
                {getStatusBadge(game.status)}
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-400 mb-1">Spread</p>
                  <p className="font-semibold">{game.homeTeam.split(' ').pop()} {game.homeSpread}</p>
                  <p className="text-betting-gold">-110</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 mb-1">Total</p>
                  <p className="font-semibold">O {game.totalPoints}</p>
                  <p className="text-betting-gold">{game.overOdds}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 mb-1">Moneyline</p>
                  <p className="font-semibold">{game.homeTeam.split(' ').pop()}</p>
                  <p className="text-betting-gold">
                    {game.homeMoneyline > 0 ? "+" : ""}{game.homeMoneyline}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
