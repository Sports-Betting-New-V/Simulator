import { storage } from "../storage.js";
import { predictionService } from "./openai.js";

export class PredictionManager {
  async generatePredictionsForGames(games) {
    const predictions = [];
    
    for (const game of games) {
      try {
        // Check if we already have a prediction for this game
        const existingPredictions = await storage.getPredictionsByGameId(game.id);
        if (existingPredictions.length > 0) {
          continue;
        }

        const prediction = await predictionService.generatePrediction(game);
        const savedPrediction = await storage.insertPrediction({
          gameId: game.id,
          ...prediction,
        });
        
        predictions.push(savedPrediction);
        
        // Add delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Error generating prediction for game ${game.id}:`, error);
      }
    }
    
    return predictions;
  }

  async getTopPredictions(limit = 10) {
    return await storage.getRecentPredictions(limit);
  }

  async getPredictionsByGame(gameId) {
    return await storage.getPredictionsByGameId(gameId);
  }
}

export const predictionManager = new PredictionManager();
