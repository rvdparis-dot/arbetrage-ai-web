// Real-time Arbitrage Detection Engine for ArBETrage.AI
// Analyzes live odds data to find guaranteed profit opportunities

class ArbitrageDetector {
    constructor() {
        this.minMargin = 0.1; // Minimum 0.1% margin to consider viable
        this.maxMargin = 15.0; // Maximum 15% margin (likely data error above this)
        this.minBookmakers = 2; // Need at least 2 bookmakers for arbitrage
        this.opportunities = [];
        
        console.log('🔍 ArbitrageDetector initialized for real-time opportunity detection');
    }

    // Main function to find arbitrage opportunities from live odds data
    findArbitrageOpportunities(liveOddsData) {
        const opportunities = [];
        
        if (!Array.isArray(liveOddsData) || liveOddsData.length === 0) {
            console.log('No live odds data provided');
            return opportunities;
        }

        console.log(`🔍 Analyzing ${liveOddsData.length} live events for arbitrage opportunities...`);

        liveOddsData.forEach(game => {
            try {
                const gameOpportunities = this.analyzeGame(game);
                opportunities.push(...gameOpportunities);
            } catch (error) {
                console.error('Error analyzing game:', error, game);
            }
        });

        // Sort by margin (highest first) and filter by minimum margin
        const viableOpportunities = opportunities
            .filter(opp => opp.arbitrageMargin >= this.minMargin && opp.arbitrageMargin <= this.maxMargin)
            .sort((a, b) => b.arbitrageMargin - a.arbitrageMargin);

        console.log(`✅ Found ${viableOpportunities.length} viable arbitrage opportunities`);
        
        this.opportunities = viableOpportunities;
        return viableOpportunities;
    }

    // Analyze a single game for arbitrage opportunities
    analyzeGame(game) {
        const opportunities = [];
        
        if (!game.bookmakers || game.bookmakers.length < this.minBookmakers) {
            return opportunities;
        }

        // Group outcomes by name (e.g., "Team A", "Team B", "Draw")
        const outcomeGroups = this.groupOutcomes(game);
        
        // Check if we have odds for all possible outcomes
        const outcomeNames = Object.keys(outcomeGroups);
        if (outcomeNames.length < 2) {
            return opportunities; // Need at least 2 outcomes
        }

        // Find best odds for each outcome across all bookmakers
        const bestOdds = this.findBestOdds(outcomeGroups);
        
        // Calculate if arbitrage exists
        const arbitrageResult = this.calculateArbitrage(bestOdds, game);
        
        if (arbitrageResult.hasArbitrage) {
            opportunities.push({
                id: `arb_${game.id}_${Date.now()}`,
                gameId: game.id,
                sport: game.sport,
                sportKey: game.sportKey,
                matchup: `${game.awayTeam} vs ${game.homeTeam}`,
                homeTeam: game.homeTeam,
                awayTeam: game.awayTeam,
                gameTime: this.formatGameTime(game.commenceTime),
                gameDate: game.commenceTime,
                outcomes: arbitrageResult.outcomes,
                arbitrageMargin: arbitrageResult.margin,
                totalImpliedProbability: arbitrageResult.totalImpliedProb,
                confidence: this.getConfidenceLevel(arbitrageResult.margin, game.bookmakers.length),
                bookmakerCount: game.bookmakers.length,
                lastUpdate: new Date(),
                requiredSpeed: this.getRequiredSpeed(arbitrageResult.margin),
                riskLevel: this.getRiskLevel(arbitrageResult.margin, game.bookmakers.length)
            });
        }

        return opportunities;
    }

    // Group outcomes by name across all bookmakers
    groupOutcomes(game) {
        const groups = {};
        
        game.bookmakers.forEach(bookmaker => {
            if (!bookmaker.odds || !Array.isArray(bookmaker.odds)) return;
            
            bookmaker.odds.forEach(odd => {
                if (!groups[odd.name]) {
                    groups[odd.name] = [];
                }
                
                groups[odd.name].push({
                    ...odd,
                    bookmaker: bookmaker.name,
                    lastUpdate: bookmaker.lastUpdate
                });
            });
        });
        
        return groups;
    }

    // Find best odds for each outcome
    findBestOdds(outcomeGroups) {
        const bestOdds = {};
        
        Object.keys(outcomeGroups).forEach(outcomeName => {
            const outcomes = outcomeGroups[outcomeName];
            
            // Find highest decimal odds (best for bettor)
            const bestOutcome = outcomes.reduce((best, current) => {
                if (!best || !best.decimalOdds || !current.decimalOdds) {
                    return current.decimalOdds ? current : best;
                }
                return current.decimalOdds > best.decimalOdds ? current : best;
            }, null);
            
            if (bestOutcome && bestOutcome.decimalOdds) {
                bestOdds[outcomeName] = bestOutcome;
            }
        });
        
        return bestOdds;
    }

    // Calculate if arbitrage exists and return details
    calculateArbitrage(bestOdds, game) {
        const outcomes = Object.values(bestOdds);
        
        if (outcomes.length < 2 || outcomes.some(o => !o.decimalOdds || o.decimalOdds <= 1)) {
            return { hasArbitrage: false };
        }

        // Calculate total implied probability
        const totalImpliedProb = outcomes.reduce((sum, outcome) => {
            return sum + (1.0 / outcome.decimalOdds);
        }, 0);

        const hasArbitrage = totalImpliedProb < 1.0;
        const margin = hasArbitrage ? (1.0 - totalImpliedProb) * 100 : 0;

        return {
            hasArbitrage,
            margin,
            totalImpliedProb,
            outcomes: outcomes.map((outcome, index) => ({
                id: index + 1,
                name: outcome.name,
                odds: outcome.odds,
                decimalOdds: outcome.decimalOdds,
                bookmaker: outcome.bookmaker,
                impliedProbability: ((1.0 / outcome.decimalOdds) * 100).toFixed(2),
                lastUpdate: outcome.lastUpdate
            }))
        };
    }

    // Format game time for display
    formatGameTime(commenceTime) {
        if (!commenceTime) return 'TBD';
        
        const date = new Date(commenceTime);
        const now = new Date();
        const diff = date.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        
        if (hours < 0) {
            return 'LIVE';
        } else if (hours < 24) {
            return `${hours}h`;
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
    }

    // Determine confidence level based on margin and bookmaker count
    getConfidenceLevel(margin, bookmakerCount) {
        if (margin > 3 && bookmakerCount >= 4) return 'Very High';
        if (margin > 2 && bookmakerCount >= 3) return 'High';
        if (margin > 1 && bookmakerCount >= 2) return 'Medium';
        return 'Low';
    }

    // Determine required execution speed
    getRequiredSpeed(margin) {
        if (margin > 5) return 'Relaxed'; // High margin, more time
        if (margin > 2) return 'Moderate'; // Medium margin
        if (margin > 1) return 'Fast'; // Low margin, need speed
        return 'Very Fast'; // Very low margin, immediate execution needed
    }

    // Assess risk level
    getRiskLevel(margin, bookmakerCount) {
        if (margin < 0.5) return 'Very High'; // Very tight margin
        if (margin < 1) return 'High'; // Tight margin
        if (bookmakerCount < 3) return 'Medium'; // Few bookmakers
        return 'Low'; // Good margin with multiple books
    }

    // Get statistics for current session
    getStatistics() {
        const now = new Date();
        const recentOpportunities = this.opportunities.filter(opp => 
            (now.getTime() - opp.lastUpdate.getTime()) < 3600000 // Last hour
        );

        return {
            total: this.opportunities.length,
            recent: recentOpportunities.length,
            highValue: this.opportunities.filter(opp => opp.arbitrageMargin > 2).length,
            averageMargin: this.opportunities.length > 0 
                ? (this.opportunities.reduce((sum, opp) => sum + opp.arbitrageMargin, 0) / this.opportunities.length).toFixed(2)
                : 0,
            topSport: this.getTopSport(),
            bestOpportunity: this.opportunities[0] || null
        };
    }

    // Get sport with most opportunities
    getTopSport() {
        if (this.opportunities.length === 0) return 'None';
        
        const sportCounts = {};
        this.opportunities.forEach(opp => {
            sportCounts[opp.sport] = (sportCounts[opp.sport] || 0) + 1;
        });

        return Object.keys(sportCounts).reduce((top, sport) => 
            !top || sportCounts[sport] > sportCounts[top] ? sport : top
        , null) || 'None';
    }

    // Filter opportunities by criteria
    filterOpportunities(criteria = {}) {
        let filtered = [...this.opportunities];

        if (criteria.minMargin) {
            filtered = filtered.filter(opp => opp.arbitrageMargin >= criteria.minMargin);
        }

        if (criteria.sport) {
            filtered = filtered.filter(opp => opp.sportKey === criteria.sport);
        }

        if (criteria.confidence) {
            filtered = filtered.filter(opp => opp.confidence === criteria.confidence);
        }

        if (criteria.maxHours) {
            const cutoff = new Date(Date.now() + criteria.maxHours * 3600000);
            filtered = filtered.filter(opp => opp.gameDate <= cutoff);
        }

        return filtered;
    }

    // Clear old opportunities
    cleanupOldOpportunities(maxAge = 86400000) { // 24 hours default
        const cutoff = new Date(Date.now() - maxAge);
        const before = this.opportunities.length;
        
        this.opportunities = this.opportunities.filter(opp => opp.lastUpdate > cutoff);
        
        const removed = before - this.opportunities.length;
        if (removed > 0) {
            console.log(`🧹 Cleaned up ${removed} old arbitrage opportunities`);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArbitrageDetector;
} else {
    window.ArbitrageDetector = ArbitrageDetector;
}