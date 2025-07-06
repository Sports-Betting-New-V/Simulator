import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export class PredictionService {
  async generatePrediction(game) {
    try {
      const prompt = `
        Analyze this ${game.sport} game and provide a betting recommendation:
        
        Game: ${game.awayTeam} @ ${game.homeTeam}
        Date: ${game.gameTime}
        
        Available betting lines:
        - Spread: ${game.homeTeam} ${game.homeSpread}, ${game.awayTeam} ${game.awaySpread}
        - Moneyline: ${game.homeTeam} ${game.homeMoneyline}, ${game.awayTeam} ${game.awayMoneyline}
        - Total: ${game.totalPoints} (Over ${game.overOdds}, Under ${game.underOdds})
        
        Please provide your analysis in the following JSON format:
        {
          "recommendedPick": "team/pick description",
          "betType": "spread|moneyline|total",
          "edgeScore": number between 1-10,
          "confidenceTier": "low|medium|high",
          "tags": ["Smart Money", "Value", "Fade Public", "Weather", "Injury"],
          "reasoning": "detailed explanation for the pick"
        }
        
        Consider factors like:
        - Team form and recent performance
        - Home/away advantage
        - Head-to-head history
        - Key player injuries
        - Weather conditions (if applicable)
        - Public betting sentiment
        - Line movement and value
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional sports betting analyst with expertise in identifying value bets and market inefficiencies. Provide detailed, data-driven analysis for each prediction."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
      });

      const prediction = JSON.parse(response.choices[0].message.content);
      
      // Validate and sanitize the prediction
      return {
        recommendedPick: prediction.recommendedPick,
        betType: prediction.betType,
        edgeScore: Math.max(1, Math.min(10, Number(prediction.edgeScore))),
        confidenceTier: prediction.confidenceTier,
        tags: Array.isArray(prediction.tags) ? prediction.tags : [],
        reasoning: prediction.reasoning,
      };
    } catch (error) {
      console.error("Error generating AI prediction:", error);
      
      // Fallback prediction if OpenAI fails
      return {
        recommendedPick: `${game.homeTeam} ${game.homeSpread}`,
        betType: "spread",
        edgeScore: 5.0,
        confidenceTier: "medium",
        tags: ["Value"],
        reasoning: "AI prediction service temporarily unavailable. This is a conservative spread recommendation based on home field advantage.",
      };
    }
  }

  async generateMultiplePredictions(games) {
    const predictions = [];
    
    for (const game of games) {
      try {
        const prediction = await this.generatePrediction(game);
        predictions.push({
          gameId: game.id,
          ...prediction,
        });
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error generating prediction for game ${game.id}:`, error);
      }
    }
    
    return predictions;
  }
}

export const predictionService = new PredictionService();
