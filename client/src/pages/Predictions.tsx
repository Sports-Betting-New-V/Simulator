import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Star, TrendingUp, Calendar, Target } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Predictions() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const { data: predictions, isLoading: predictionsLoading } = useQuery({
    queryKey: ["/api/games/predictions", { limit: 20 }],
    staleTime: 2 * 60 * 1000, // 2 minutes
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
          <p className="text-gray-400">Loading predictions...</p>
        </div>
      </div>
    );
  }

  const getConfidenceColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "high":
        return "bg-betting-green text-white";
      case "medium":
        return "bg-betting-gold text-white";
      case "low":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getConfidenceGradient = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "high":
        return "from-betting-green/20 to-betting-green/10 border-betting-green/20";
      case "medium":
        return "from-betting-gold/20 to-betting-gold/10 border-betting-gold/20";
      case "low":
        return "from-gray-500/20 to-gray-500/10 border-gray-500/20";
      default:
        return "from-gray-500/20 to-gray-500/10 border-gray-500/20";
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
    <div className="min-h-screen bg-betting-darker">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-betting-gold to-betting-green bg-clip-text text-transparent">
              AI Predictions
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Advanced betting insights powered by artificial intelligence</p>
        </div>

        {predictionsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-gray-800/50 backdrop-blur-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-600 rounded mb-4"></div>
                  <div className="h-6 bg-gray-600 rounded mb-4"></div>
                  <div className="h-20 bg-gray-600 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-600 rounded w-20"></div>
                    <div className="h-6 bg-gray-600 rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !predictions || predictions.length === 0 ? (
          <Card className="bg-gray-800/50 backdrop-blur-sm text-center">
            <CardContent className="p-12">
              <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Predictions Available</h3>
              <p className="text-gray-400">AI predictions will appear here once games are loaded.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {predictions.map((prediction: any) => (
              <Card
                key={prediction.id}
                className={`bg-gradient-to-r ${getConfidenceGradient(prediction.confidenceTier)} backdrop-blur-sm border`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-betting-green" />
                      <CardTitle className="text-lg">
                        {prediction.homeTeam} vs {prediction.awayTeam}
                      </CardTitle>
                    </div>
                    <Badge className={getConfidenceColor(prediction.confidenceTier)}>
                      {prediction.confidenceTier}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>{prediction.sport}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatGameTime(prediction.gameTime)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Recommended Pick</p>
                        <p className="text-xl font-bold">{prediction.recommendedPick}</p>
                        <p className="text-sm text-gray-400 capitalize">{prediction.betType}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-betting-gold" />
                          <span className="text-lg font-bold">{prediction.edgeScore}/10</span>
                        </div>
                        <p className="text-sm text-gray-400">Edge Score</p>
                      </div>
                    </div>
                    
                    {prediction.reasoning && (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Analysis</p>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {prediction.reasoning}
                        </p>
                      </div>
                    )}
                    
                    {prediction.tags && Array.isArray(prediction.tags) && prediction.tags.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Tags</p>
                        <div className="flex flex-wrap gap-1">
                          {prediction.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Button className="w-full bg-gradient-to-r from-betting-gold to-betting-green hover:from-betting-green hover:to-betting-gold">
                      Place Bet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
