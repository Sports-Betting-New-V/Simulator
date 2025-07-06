import { demoUsers, demoGames, demoPredictions, demoBets } from '../demo-data.js';

class DemoDataService {
  constructor() {
    this.games = [...demoGames];
    this.predictions = [...demoPredictions];
    this.bets = [...demoBets];
    this.users = [...demoUsers];
  }

  // Game operations
  async getGames(limit = 20, sport = null) {
    let games = this.games;
    if (sport) {
      games = games.filter(game => game.sport === sport);
    }
    return games.slice(0, limit);
  }

  async getGameById(id) {
    return this.games.find(game => game.id === parseInt(id));
  }

  async getUpcomingGames(limit = 20) {
    const now = new Date();
    return this.games
      .filter(game => new Date(game.gameTime) > now && game.status === 'scheduled')
      .slice(0, limit);
  }

  // Prediction operations
  async getPredictions(limit = 10) {
    return this.predictions.slice(0, limit);
  }

  async getPredictionsByGameId(gameId) {
    return this.predictions.filter(pred => pred.gameId === parseInt(gameId));
  }

  async generatePredictionsForGames(games) {
    // In a real app, this would call AI service
    // For demo, return existing predictions for the games
    const gameIds = games.map(g => g.id);
    return this.predictions.filter(pred => gameIds.includes(pred.gameId));
  }

  // Betting operations
  async placeBet(betData) {
    const newId = Math.max(...this.bets.map(b => b.id)) + 1;
    const newBet = {
      id: newId,
      ...betData,
      status: 'pending',
      payout: null,
      createdAt: new Date(),
      settledAt: null
    };
    this.bets.push(newBet);
    return newBet;
  }

  async getUserBets(userId, limit = 50) {
    return this.bets
      .filter(bet => bet.userId === parseInt(userId))
      .slice(0, limit)
      .map(bet => {
        const game = this.games.find(g => g.id === bet.gameId);
        return {
          ...bet,
          homeTeam: game?.homeTeam,
          awayTeam: game?.awayTeam,
          sport: game?.sport
        };
      });
  }

  async getRecentBets(userId, limit = 5) {
    return this.bets
      .filter(bet => bet.userId === parseInt(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
      .map(bet => {
        const game = this.games.find(g => g.id === bet.gameId);
        return {
          ...bet,
          homeTeam: game?.homeTeam,
          awayTeam: game?.awayTeam,
          sport: game?.sport
        };
      });
  }

  async getUserStats(userId) {
    const userBets = this.bets.filter(bet => bet.userId === parseInt(userId));
    const settledBets = userBets.filter(bet => bet.status !== 'pending');
    
    const stats = {
      totalBets: userBets.length,
      totalWagered: settledBets.reduce((sum, bet) => sum + parseFloat(bet.amount), 0),
      totalPayout: settledBets.reduce((sum, bet) => sum + parseFloat(bet.payout || 0), 0),
      wins: userBets.filter(bet => bet.status === 'won').length,
      losses: userBets.filter(bet => bet.status === 'lost').length,
      pending: userBets.filter(bet => bet.status === 'pending').length
    };

    stats.winRate = stats.wins + stats.losses > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0;
    stats.profit = stats.totalPayout - stats.totalWagered;
    stats.roi = stats.totalWagered > 0 ? (stats.profit / stats.totalWagered) * 100 : 0;

    return stats;
  }

  async simulateGameResults(gameId) {
    const game = this.games.find(g => g.id === parseInt(gameId));
    if (!game) {
      throw new Error('Game not found');
    }

    // Generate random scores
    const homeScore = Math.floor(Math.random() * 50) + 80; // 80-130 range
    const awayScore = Math.floor(Math.random() * 50) + 80;

    // Update game
    game.homeScore = homeScore;
    game.awayScore = awayScore;
    game.status = 'final';

    // Settle related bets
    const gameBets = this.bets.filter(bet => bet.gameId === parseInt(gameId) && bet.status === 'pending');
    
    gameBets.forEach(bet => {
      let won = false;
      
      if (bet.betType === 'spread') {
        const spread = parseFloat(bet.pick.includes('-') ? bet.pick.split('-')[1] : bet.pick.split('+')[1]);
        const isHome = bet.pick.includes(game.homeTeam.split(' ').pop());
        
        if (isHome) {
          won = (homeScore - awayScore) > spread;
        } else {
          won = (awayScore - homeScore) > spread;
        }
      } else if (bet.betType === 'total') {
        const total = parseFloat(bet.pick.replace('Over ', '').replace('Under ', ''));
        const actualTotal = homeScore + awayScore;
        
        if (bet.pick.includes('Over')) {
          won = actualTotal > total;
        } else {
          won = actualTotal < total;
        }
      } else if (bet.betType === 'moneyline') {
        const isHome = bet.pick.includes(game.homeTeam.split(' ').pop());
        won = isHome ? homeScore > awayScore : awayScore > homeScore;
      }

      bet.status = won ? 'won' : 'lost';
      bet.settledAt = new Date();
      
      if (won) {
        const odds = Math.abs(bet.odds);
        const payout = bet.odds > 0 
          ? parseFloat(bet.amount) * (odds / 100) + parseFloat(bet.amount)
          : parseFloat(bet.amount) * (100 / odds) + parseFloat(bet.amount);
        bet.payout = payout.toFixed(2);
      } else {
        bet.payout = "0.00";
      }
    });

    return {
      gameId,
      homeScore,
      awayScore,
      settledBets: gameBets.length
    };
  }
}

const demoDataService = new DemoDataService();
export { demoDataService };