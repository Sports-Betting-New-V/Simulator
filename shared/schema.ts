import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (email/password auth)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  bankroll: decimal("bankroll", { precision: 10, scale: 2 }).default("10000.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Games table for sports betting
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  homeTeam: varchar("home_team", { length: 100 }).notNull(),
  awayTeam: varchar("away_team", { length: 100 }).notNull(),
  sport: varchar("sport", { length: 20 }).notNull(),
  gameTime: timestamp("game_time").notNull(),
  status: varchar("status", { length: 20 }).default("scheduled"),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  homeSpread: decimal("home_spread", { precision: 4, scale: 1 }),
  awaySpread: decimal("away_spread", { precision: 4, scale: 1 }),
  homeMoneyline: integer("home_moneyline"),
  awayMoneyline: integer("away_moneyline"),
  totalPoints: decimal("total_points", { precision: 4, scale: 1 }),
  overOdds: integer("over_odds"),
  underOdds: integer("under_odds"),
  externalId: varchar("external_id", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Predictions table
export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").references(() => games.id),
  recommendedPick: varchar("recommended_pick", { length: 100 }).notNull(),
  betType: varchar("bet_type", { length: 20 }).notNull(), // 'spread', 'moneyline', 'total'
  edgeScore: decimal("edge_score", { precision: 3, scale: 1 }).notNull(),
  confidenceTier: varchar("confidence_tier", { length: 10 }).notNull(), // 'low', 'medium', 'high'
  tags: jsonb("tags").default([]),
  reasoning: text("reasoning"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bets table
export const bets = pgTable("bets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  gameId: integer("game_id").references(() => games.id),
  predictionId: integer("prediction_id").references(() => predictions.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  pick: varchar("pick", { length: 100 }).notNull(),
  betType: varchar("bet_type", { length: 20 }).notNull(),
  odds: integer("odds").notNull(),
  status: varchar("status", { length: 20 }).default("pending"), // 'pending', 'won', 'lost', 'push'
  payout: decimal("payout", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  settledAt: timestamp("settled_at"),
});

// Type definitions
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Game = typeof games.$inferSelect;
export type InsertGame = typeof games.$inferInsert;
export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = typeof predictions.$inferInsert;
export type Bet = typeof bets.$inferSelect;
export type InsertBet = typeof bets.$inferInsert;

// Zod schemas
export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
  createdAt: true,
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true,
});

export const insertBetSchema = createInsertSchema(bets).omit({
  id: true,
  createdAt: true,
  settledAt: true,
  payout: true,
  status: true,
});

export const placeBetSchema = z.object({
  gameId: z.number(),
  predictionId: z.number().optional(),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Amount must be a positive number"),
  pick: z.string().min(1, "Pick is required"),
  betType: z.enum(["spread", "moneyline", "total"]),
  odds: z.number(),
});

export type PlaceBetInput = z.infer<typeof placeBetSchema>;
