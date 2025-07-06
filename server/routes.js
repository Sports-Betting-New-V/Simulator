import { createServer } from "http";
import { storage } from "./storage.js";
import { setupAuth, isAuthenticated } from "./replitAuth.js";
import { espnService } from "./services/espn.js";
import { predictionManager } from "./services/predictions.js";
import { bettingService } from "./services/betting.js";
import { placeBetSchema } from "../shared/schema.js";
import { ZodError } from "zod";

async function registerRoutes(app) {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User stats endpoint
  app.get('/api/user/stats', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await bettingService.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Games endpoints
  app.get('/api/games', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const sport = req.query.sport;
      
      // First, try to get games from database
      let games = await storage.getUpcomingGames(limit);
      
      // If we don't have enough games, fetch from ESPN
      if (games.length < limit / 2) {
        console.log("Fetching fresh games from ESPN...");
        const espnGames = sport 
          ? await espnService.getGames(sport, limit)
          : await espnService.getAllSportsGames(limit);
        
        // Save new games to database
        for (const gameData of espnGames) {
          try {
            await storage.insertGame(gameData);
          } catch (error) {
            // Game might already exist, skip
            continue;
          }
        }
        
        // Fetch updated games from database
        games = await storage.getUpcomingGames(limit);
      }
      
      res.json(games);
    } catch (error) {
      console.error("Error fetching games:", error);
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  app.get('/api/games/predictions', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      // Get recent games
      const games = await storage.getUpcomingGames(20);
      
      // Generate predictions for games that don't have them
      if (games.length > 0) {
        await predictionManager.generatePredictionsForGames(games);
      }
      
      // Get predictions with game data
      const predictions = await predictionManager.getTopPredictions(limit);
      
      res.json(predictions);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      res.status(500).json({ message: "Failed to fetch predictions" });
    }
  });

  // Betting endpoints
  app.post('/api/bets', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = placeBetSchema.parse(req.body);
      
      const result = await bettingService.placeBet(userId, validatedData);
      
      res.json({
        message: "Bet placed successfully",
        bet: result.bet,
        newBankroll: result.newBankroll,
      });
    } catch (error) {
      console.error("Error placing bet:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid bet data", 
          errors: error.errors 
        });
      }
      
      res.status(400).json({ 
        message: error.message || "Failed to place bet" 
      });
    }
  });

  app.get('/api/bets', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit) || 50;
      
      const bets = await storage.getUserBets(userId, limit);
      res.json(bets);
    } catch (error) {
      console.error("Error fetching bets:", error);
      res.status(500).json({ message: "Failed to fetch bets" });
    }
  });

  app.get('/api/bets/recent', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit) || 5;
      
      const bets = await storage.getRecentBets(userId, limit);
      res.json(bets);
    } catch (error) {
      console.error("Error fetching recent bets:", error);
      res.status(500).json({ message: "Failed to fetch recent bets" });
    }
  });

  // Game simulation endpoint (for testing)
  app.post('/api/games/:id/simulate', isAuthenticated, async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const results = await bettingService.simulateGameResults(gameId);
      
      res.json({
        message: "Game simulated successfully",
        results,
      });
    } catch (error) {
      console.error("Error simulating game:", error);
      res.status(500).json({ message: "Failed to simulate game" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

export { registerRoutes };
