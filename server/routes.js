import { createServer } from "http";
import { storage } from "./storage.js";
import { setupAuth } from "./auth.js";
import { demoDataService } from "./services/demo-data-service.js";
import { placeBetSchema } from "../shared/schema.js";
import { ZodError } from "zod";

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

async function registerRoutes(app) {
  // Auth middleware
  await setupAuth(app);

  // User stats endpoint
  app.get('/api/user/stats', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const stats = await demoDataService.getUserStats(userId);
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
      
      const games = await demoDataService.getGames(limit, sport);
      res.json(games);
    } catch (error) {
      console.error("Error fetching games:", error);
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  app.get('/api/games/predictions', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const predictions = await demoDataService.getPredictions(limit);
      res.json(predictions);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      res.status(500).json({ message: "Failed to fetch predictions" });
    }
  });

  // Betting endpoints
  app.post('/api/bets', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const validatedData = placeBetSchema.parse(req.body);
      
      const result = await demoDataService.placeBet({ userId, ...validatedData });
      
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
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 50;
      
      const bets = await demoDataService.getUserBets(userId, limit);
      res.json(bets);
    } catch (error) {
      console.error("Error fetching bets:", error);
      res.status(500).json({ message: "Failed to fetch bets" });
    }
  });

  app.get('/api/bets/recent', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 5;
      
      const bets = await demoDataService.getRecentBets(userId, limit);
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
      const results = await demoDataService.simulateGameResults(gameId);
      
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
