import {
  users,
  games,
  predictions,
  bets,
} from "../shared/schema.js";
import { db } from "./db.js";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";

class DatabaseStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData) {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserBankroll(userId, newBankroll) {
    const [user] = await db
      .update(users)
      .set({ bankroll: newBankroll.toString(), updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Game operations
  async getGames(limit = 50) {
    return await db
      .select()
      .from(games)
      .orderBy(desc(games.gameTime))
      .limit(limit);
  }

  async getGameById(id) {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game;
  }

  async insertGame(gameData) {
    const [game] = await db.insert(games).values(gameData).returning();
    return game;
  }

  async updateGame(id, gameData) {
    const [game] = await db
      .update(games)
      .set(gameData)
      .where(eq(games.id, id))
      .returning();
    return game;
  }

  async getUpcomingGames(limit = 20) {
    return await db
      .select()
      .from(games)
      .where(gte(games.gameTime, new Date()))
      .orderBy(games.gameTime)
      .limit(limit);
  }

  // Prediction operations
  async insertPrediction(predictionData) {
    const [prediction] = await db
      .insert(predictions)
      .values(predictionData)
      .returning();
    return prediction;
  }

  async getPredictionsByGameId(gameId) {
    return await db
      .select()
      .from(predictions)
      .where(eq(predictions.gameId, gameId))
      .orderBy(desc(predictions.edgeScore));
  }

  async getRecentPredictions(limit = 10) {
    return await db
      .select({
        id: predictions.id,
        gameId: predictions.gameId,
        recommendedPick: predictions.recommendedPick,
        betType: predictions.betType,
        edgeScore: predictions.edgeScore,
        confidenceTier: predictions.confidenceTier,
        tags: predictions.tags,
        reasoning: predictions.reasoning,
        createdAt: predictions.createdAt,
        homeTeam: games.homeTeam,
        awayTeam: games.awayTeam,
        sport: games.sport,
        gameTime: games.gameTime,
      })
      .from(predictions)
      .leftJoin(games, eq(predictions.gameId, games.id))
      .orderBy(desc(predictions.createdAt))
      .limit(limit);
  }

  // Bet operations
  async placeBet(betData) {
    const [bet] = await db.insert(bets).values(betData).returning();
    return bet;
  }

  async getUserBets(userId, limit = 50) {
    return await db
      .select({
        id: bets.id,
        amount: bets.amount,
        pick: bets.pick,
        betType: bets.betType,
        odds: bets.odds,
        status: bets.status,
        payout: bets.payout,
        createdAt: bets.createdAt,
        settledAt: bets.settledAt,
        homeTeam: games.homeTeam,
        awayTeam: games.awayTeam,
        sport: games.sport,
        gameTime: games.gameTime,
      })
      .from(bets)
      .leftJoin(games, eq(bets.gameId, games.id))
      .where(eq(bets.userId, userId))
      .orderBy(desc(bets.createdAt))
      .limit(limit);
  }

  async getRecentBets(userId, limit = 5) {
    return await db
      .select({
        id: bets.id,
        amount: bets.amount,
        pick: bets.pick,
        betType: bets.betType,
        odds: bets.odds,
        status: bets.status,
        payout: bets.payout,
        createdAt: bets.createdAt,
        homeTeam: games.homeTeam,
        awayTeam: games.awayTeam,
        sport: games.sport,
      })
      .from(bets)
      .leftJoin(games, eq(bets.gameId, games.id))
      .where(eq(bets.userId, userId))
      .orderBy(desc(bets.createdAt))
      .limit(limit);
  }

  async updateBetStatus(betId, status, payout = null) {
    const updateData = {
      status,
      settledAt: new Date(),
    };
    if (payout !== null) {
      updateData.payout = payout.toString();
    }

    const [bet] = await db
      .update(bets)
      .set(updateData)
      .where(eq(bets.id, betId))
      .returning();
    return bet;
  }

  async getUserStats(userId) {
    const [stats] = await db
      .select({
        totalBets: sql`COUNT(*)`,
        totalWagered: sql`SUM(CASE WHEN status != 'pending' THEN amount ELSE 0 END)`,
        totalPayout: sql`COALESCE(SUM(payout), 0)`,
        wins: sql`COUNT(CASE WHEN status = 'won' THEN 1 END)`,
        losses: sql`COUNT(CASE WHEN status = 'lost' THEN 1 END)`,
        pending: sql`COUNT(CASE WHEN status = 'pending' THEN 1 END)`,
      })
      .from(bets)
      .where(eq(bets.userId, userId));

    return {
      totalBets: Number(stats.totalBets),
      totalWagered: Number(stats.totalWagered),
      totalPayout: Number(stats.totalPayout),
      wins: Number(stats.wins),
      losses: Number(stats.losses),
      pending: Number(stats.pending),
      winRate: stats.totalBets > 0 ? (Number(stats.wins) / (Number(stats.wins) + Number(stats.losses))) * 100 : 0,
      profit: Number(stats.totalPayout) - Number(stats.totalWagered),
      roi: Number(stats.totalWagered) > 0 ? ((Number(stats.totalPayout) - Number(stats.totalWagered)) / Number(stats.totalWagered)) * 100 : 0,
    };
  }
}

const storage = new DatabaseStorage();
export { storage };
