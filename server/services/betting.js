import { storage } from "../storage.js";

export class BettingService {
  async placeBet(userId, betData) {
    try {
      // Get user's current bankroll
      const user = await storage.getUser(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const betAmount = parseFloat(betData.amount);
      const userBankroll = parseFloat(user.bankroll);

      if (betAmount <= 0) {
        throw new Error("Bet amount must be positive");
      }

      if (betAmount > userBankroll) {
        throw new Error("Insufficient bankroll");
      }

      // Get game to validate it exists and is upcoming
      const game = await storage.getGameById(betData.gameId);
      if (!game) {
        throw new Error("Game not found");
      }

      if (new Date(game.gameTime) <= new Date()) {
        throw new Error("Cannot bet on games that have already started");
      }

      // Deduct bet amount from user's bankroll
      const newBankroll = userBankroll - betAmount;
      await storage.updateUserBankroll(userId, newBankroll);

      // Place the bet
      const bet = await storage.placeBet({
        userId,
        gameId: betData.gameId,
        predictionId: betData.predictionId || null,
        amount: betData.amount,
        pick: betData.pick,
        betType: betData.betType,
        odds: betData.odds,
        status: "pending",
      });

      return { bet, newBankroll };
    } catch (error) {
      console.error("Error placing bet:", error);
      throw error;
    }
  }

  async simulateGameResults(gameId) {
    try {
      const game = await storage.getGameById(gameId);
      if (!game) {
        throw new Error("Game not found");
      }

      // Generate realistic game results
      const results = this.generateGameResults(game);
      
      // Update game with results
      await storage.updateGame(gameId, {
        status: "final",
        homeScore: results.homeScore,
        awayScore: results.awayScore,
      });

      // Settle all bets for this game
      await this.settleBetsForGame(gameId, results);

      return results;
    } catch (error) {
      console.error("Error simulating game results:", error);
      throw error;
    }
  }

  generateGameResults(game) {
    const homeSpread = parseFloat(game.homeSpread) || 0;
    const totalPoints = parseFloat(game.totalPoints) || 200;
    
    // Generate realistic scores based on sport
    let baseScore = this.getBaseScore(game.sport);
    
    // Add some randomness
    const variation = Math.random() * 40 - 20; // ±20 points variation
    const homeScore = Math.max(0, Math.round(baseScore + (homeSpread / 2) + variation));
    const awayScore = Math.max(0, Math.round(baseScore - (homeSpread / 2) + (Math.random() * 20 - 10)));
    
    return {
      homeScore,
      awayScore,
      totalPoints: homeScore + awayScore,
      homeSpreadCover: (homeScore - awayScore) > Math.abs(homeSpread),
      awaySpreadCover: (awayScore - homeScore) > Math.abs(homeSpread),
      overHit: (homeScore + awayScore) > totalPoints,
      underHit: (homeScore + awayScore) < totalPoints,
    };
  }

  getBaseScore(sport) {
    const baseSores = {
      NBA: 110,
      NFL: 24,
      MLB: 5,
      NHL: 3,
    };
    return baseSores[sport] || 110;
  }

  async settleBetsForGame(gameId, results) {
    // This would typically get all pending bets for the game
    // For now, we'll implement a basic settlement system
    // In a real implementation, you'd fetch all pending bets and settle them
    console.log(`Settling bets for game ${gameId} with results:`, results);
  }

  calculatePayout(betAmount, odds) {
    if (odds > 0) {
      // Positive odds (underdog)
      return betAmount * (odds / 100);
    } else {
      // Negative odds (favorite)
      return betAmount * (100 / Math.abs(odds));
    }
  }

  async getUserStats(userId) {
    return await storage.getUserStats(userId);
  }
}

export const bettingService = new BettingService();
