import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, TrendingUp, Star } from "lucide-react";

export default function AIPredictions({ limit = 5 }: { limit?: number }) {
  const { data: predictions, isLoading } = useQuery({
    queryKey: ["/api/games/predictions", { limit }],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-betting-green" />
            AI Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-700/50 p-4 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-600 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!predictions || predictions.length === 0) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-betting-green" />
            AI Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No predictions available at the moment.</p>
        </CardContent>
      </Card>
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

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-betting-green" />
          AI Predictions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {predictions.map((prediction: any) => (
            <div
              key={prediction.id}
              className={`bg-gradient-to-r ${getConfidenceGradient(prediction.confidenceTier)} p-4 rounded-lg border`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{prediction.recommendedPick}</span>
                  <Badge className={getConfidenceColor(prediction.confidenceTier)}>
                    {prediction.confidenceTier}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-betting-gold" />
                  <span className="text-sm font-medium">{prediction.edgeScore}/10</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-300">
                  {prediction.homeTeam} vs {prediction.awayTeam}
                </span>
                <span className="text-xs text-gray-500">
                  {prediction.sport}
                </span>
              </div>
              
              {prediction.reasoning && (
                <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                  {prediction.reasoning}
                </p>
              )}
              
              {prediction.tags && Array.isArray(prediction.tags) && prediction.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {prediction.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
