// Demo data for the betting application

const demoUsers = [
  {
    id: 1,
    username: "demo_user",
    email: "demo@example.com",
    password: "$hashed_password", // This would be hashed in real implementation
    bankroll: "9750.00",
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

const demoGames = [
  {
    id: 1,
    homeTeam: "Los Angeles Lakers",
    awayTeam: "Golden State Warriors",
    sport: "nba",
    gameTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    status: "scheduled",
    homeScore: null,
    awayScore: null,
    homeSpread: "-3.5",
    awaySpread: "+3.5",
    homeMoneyline: -165,
    awayMoneyline: +145,
    totalPoints: "225.5",
    overOdds: -110,
    underOdds: -110,
    externalId: "nba_lal_gsw_001"
  },
  {
    id: 2,
    homeTeam: "Dallas Cowboys",
    awayTeam: "New York Giants",
    sport: "nfl",
    gameTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
    status: "scheduled",
    homeScore: null,
    awayScore: null,
    homeSpread: "-7.0",
    awaySpread: "+7.0",
    homeMoneyline: -280,
    awayMoneyline: +230,
    totalPoints: "45.5",
    overOdds: -115,
    underOdds: -105,
    externalId: "nfl_dal_nyg_001"
  },
  {
    id: 3,
    homeTeam: "Boston Celtics",
    awayTeam: "Miami Heat",
    sport: "nba",
    gameTime: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days from now
    status: "scheduled",
    homeScore: null,
    awayScore: null,
    homeSpread: "-5.5",
    awaySpread: "+5.5",
    homeMoneyline: -220,
    awayMoneyline: +180,
    totalPoints: "218.0",
    overOdds: -108,
    underOdds: -112,
    externalId: "nba_bos_mia_001"
  }
];

const demoPredictions = [
  {
    id: 1,
    gameId: 1,
    recommendedPick: "Lakers -3.5",
    betType: "spread",
    edgeScore: "8.2",
    confidenceTier: "high",
    tags: ["home_advantage", "recent_form"],
    reasoning: "Lakers have won 7 of their last 10 games and are 12-5 at home this season. Warriors are missing key defensive players.",
    createdAt: new Date()
  },
  {
    id: 2,
    gameId: 1,
    recommendedPick: "Over 225.5",
    betType: "total",
    edgeScore: "6.8",
    confidenceTier: "medium",
    tags: ["pace", "defense"],
    reasoning: "Both teams rank in top 10 for pace. Lakers averaging 118 PPG at home, Warriors allowing 112 PPG on road.",
    createdAt: new Date()
  },
  {
    id: 3,
    gameId: 2,
    recommendedPick: "Cowboys -7.0",
    betType: "spread",
    edgeScore: "7.5",
    confidenceTier: "high",
    tags: ["home_field", "injuries"],
    reasoning: "Cowboys are 8-2 at home this season. Giants have 3 key offensive players on injury report.",
    createdAt: new Date()
  }
];

const demoBets = [
  {
    id: 1,
    userId: 1,
    gameId: 1,
    predictionId: 1,
    amount: "100.00",
    pick: "Lakers -3.5",
    betType: "spread",
    odds: -110,
    status: "pending",
    payout: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    settledAt: null
  },
  {
    id: 2,
    userId: 1,
    gameId: 2,
    predictionId: 3,
    amount: "150.00",
    pick: "Cowboys -7.0",
    betType: "spread",
    odds: -110,
    status: "won",
    payout: "286.36",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    settledAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: 3,
    userId: 1,
    gameId: 3,
    predictionId: null,
    amount: "75.00",
    pick: "Under 218.0",
    betType: "total",
    odds: -112,
    status: "lost",
    payout: "0.00",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
    settledAt: new Date(Date.now() - 48 * 60 * 60 * 1000) // 2 days ago
  }
];

export {
  demoUsers,
  demoGames,
  demoPredictions,
  demoBets
};