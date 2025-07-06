import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Zap } from "lucide-react";

export default function QuickBetForm() {
  const [selectedGame, setSelectedGame] = useState("");
  const [betType, setBetType] = useState("spread");
  const [amount, setAmount] = useState("");
  const [pick, setPick] = useState("");
  const [odds, setOdds] = useState(-110);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: games, isLoading: gamesLoading } = useQuery({
    queryKey: ["/api/games"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const placeBetMutation = useMutation({
    mutationFn: async (betData: any) => {
      const response = await apiRequest("POST", "/api/bets", betData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Bet Placed Successfully",
        description: `Your bet has been placed. New balance: $${data.newBankroll}`,
      });
      
      // Reset form
      setSelectedGame("");
      setBetType("spread");
      setAmount("");
      setPick("");
      setOdds(-110);
      
      // Refresh user data and bets
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bets/recent"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to place bet",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGame || !amount || !pick) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const betAmount = parseFloat(amount);
    if (betAmount <= 0) {
      toast({
        title: "Error",
        description: "Bet amount must be positive",
        variant: "destructive",
      });
      return;
    }

    placeBetMutation.mutate({
      gameId: parseInt(selectedGame),
      betType,
      amount: betAmount.toString(),
      pick,
      odds,
    });
  };

  const selectedGameData = games?.find((g: any) => g.id.toString() === selectedGame);

  return (
    <Card className="bg-gradient-to-br from-betting-gold/10 to-betting-green/10 border-betting-gold/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-betting-gold" />
          Quick Bet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="game">Select Game</Label>
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a game" />
              </SelectTrigger>
              <SelectContent>
                {games?.map((game: any) => (
                  <SelectItem key={game.id} value={game.id.toString()}>
                    {game.awayTeam} @ {game.homeTeam}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="betType">Bet Type</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={betType === "spread" ? "default" : "outline"}
                size="sm"
                onClick={() => setBetType("spread")}
              >
                Spread
              </Button>
              <Button
                type="button"
                variant={betType === "total" ? "default" : "outline"}
                size="sm"
                onClick={() => setBetType("total")}
              >
                Total
              </Button>
              <Button
                type="button"
                variant={betType === "moneyline" ? "default" : "outline"}
                size="sm"
                onClick={() => setBetType("moneyline")}
              >
                Moneyline
              </Button>
            </div>
          </div>

          {selectedGameData && (
            <div>
              <Label htmlFor="pick">Pick</Label>
              <Select value={pick} onValueChange={setPick}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your pick" />
                </SelectTrigger>
                <SelectContent>
                  {betType === "spread" && (
                    <>
                      <SelectItem value={`${selectedGameData.homeTeam} ${selectedGameData.homeSpread}`}>
                        {selectedGameData.homeTeam} {selectedGameData.homeSpread}
                      </SelectItem>
                      <SelectItem value={`${selectedGameData.awayTeam} ${selectedGameData.awaySpread}`}>
                        {selectedGameData.awayTeam} {selectedGameData.awaySpread}
                      </SelectItem>
                    </>
                  )}
                  {betType === "total" && (
                    <>
                      <SelectItem value={`Over ${selectedGameData.totalPoints}`}>
                        Over {selectedGameData.totalPoints}
                      </SelectItem>
                      <SelectItem value={`Under ${selectedGameData.totalPoints}`}>
                        Under {selectedGameData.totalPoints}
                      </SelectItem>
                    </>
                  )}
                  {betType === "moneyline" && (
                    <>
                      <SelectItem value={selectedGameData.homeTeam}>
                        {selectedGameData.homeTeam} ({selectedGameData.homeMoneyline > 0 ? "+" : ""}{selectedGameData.homeMoneyline})
                      </SelectItem>
                      <SelectItem value={selectedGameData.awayTeam}>
                        {selectedGameData.awayTeam} ({selectedGameData.awayMoneyline > 0 ? "+" : ""}{selectedGameData.awayMoneyline})
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="amount">Bet Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0.01"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-betting-gold to-betting-green hover:from-betting-green hover:to-betting-gold"
            disabled={placeBetMutation.isPending}
          >
            {placeBetMutation.isPending ? "Placing Bet..." : "Place Bet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
