import axios from "axios";

export class ESPNService {
  constructor() {
    this.baseURL = "https://site.api.espn.com/apis/site/v2/sports";
    this.sports = {
      nba: "basketball/nba",
      nfl: "football/nfl",
      mlb: "baseball/mlb",
      nhl: "hockey/nhl"
    };
  }

  async getGames(sport = "nba", limit = 20) {
    try {
      const sportPath = this.sports[sport.toLowerCase()];
      if (!sportPath) {
        throw new Error(`Unsupported sport: ${sport}`);
      }

      const response = await axios.get(`${this.baseURL}/${sportPath}/scoreboard`, {
        params: {
          limit,
          dates: this.getDateRange()
        },
        timeout: 10000
      });

      return this.parseGames(response.data, sport.toUpperCase());
    } catch (error) {
      console.error(`Error fetching ${sport} games from ESPN:`, error.message);
      return [];
    }
  }

  async getAllSportsGames(limit = 50) {
    const allGames = [];
    const sports = ["nba", "nfl", "mlb", "nhl"];

    for (const sport of sports) {
      try {
        const games = await this.getGames(sport, Math.ceil(limit / sports.length));
        allGames.push(...games);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error fetching ${sport} games:`, error);
      }
    }

    return allGames.slice(0, limit);
  }

  parseGames(data, sport) {
    if (!data.events || !Array.isArray(data.events)) {
      return [];
    }

    return data.events.map(event => {
      const competition = event.competitions[0];
      const competitors = competition.competitors;
      
      const homeTeam = competitors.find(c => c.homeAway === "home");
      const awayTeam = competitors.find(c => c.homeAway === "away");

      // Generate realistic betting lines
      const lines = this.generateBettingLines(homeTeam, awayTeam, sport);

      return {
        externalId: event.id,
        sport,
        homeTeam: homeTeam.team.displayName,
        awayTeam: awayTeam.team.displayName,
        gameTime: new Date(event.date),
        status: this.mapEventStatus(event.status.type.name),
        homeScore: parseInt(homeTeam.score) || null,
        awayScore: parseInt(awayTeam.score) || null,
        ...lines
      };
    });
  }

  generateBettingLines(homeTeam, awayTeam, sport) {
    // Generate realistic betting lines based on sport
    const homeAdvantage = Math.random() * 6 - 3; // -3 to +3 point spread
    const totalBase = this.getTotalPointsBase(sport);
    const totalVariation = Math.random() * 20 - 10; // ±10 points variation
    
    const homeSpread = Math.round(homeAdvantage * 2) / 2; // Round to nearest 0.5
    const awaySpread = -homeSpread;
    
    const homeMoneyline = this.calculateMoneyline(homeSpread, true);
    const awayMoneyline = this.calculateMoneyline(homeSpread, false);
    
    const totalPoints = Math.round((totalBase + totalVariation) * 2) / 2; // Round to nearest 0.5
    const overOdds = -110 + Math.floor(Math.random() * 20 - 10); // -120 to -100
    const underOdds = -110 + Math.floor(Math.random() * 20 - 10);

    return {
      homeSpread: homeSpread.toString(),
      awaySpread: awaySpread.toString(),
      homeMoneyline,
      awayMoneyline,
      totalPoints: totalPoints.toString(),
      overOdds,
      underOdds,
    };
  }

  getTotalPointsBase(sport) {
    const bases = {
      NBA: 220,
      NFL: 47,
      MLB: 9,
      NHL: 6
    };
    return bases[sport] || 220;
  }

  calculateMoneyline(spread, isHome) {
    const favoriteAdjustment = isHome ? spread : -spread;
    
    if (favoriteAdjustment > 0) {
      // Underdog
      return Math.round(100 + (favoriteAdjustment * 30));
    } else {
      // Favorite
      return Math.round(-100 - (Math.abs(favoriteAdjustment) * 30));
    }
  }

  mapEventStatus(espnStatus) {
    const statusMap = {
      "STATUS_SCHEDULED": "scheduled",
      "STATUS_IN_PROGRESS": "live",
      "STATUS_FINAL": "final",
      "STATUS_POSTPONED": "postponed",
      "STATUS_CANCELED": "canceled",
    };
    return statusMap[espnStatus] || "scheduled";
  }

  getDateRange() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return `${yesterday.toISOString().split('T')[0]}-${nextWeek.toISOString().split('T')[0]}`;
  }
}

export const espnService = new ESPNService();
