// Real Live Odds API Service for ArBETrage.AI
// This replaces the demo data with actual live sportsbook odds

class RealOddsService {
    constructor(apiKey) {
        // Load from environment or fallback to parameter
        this.apiKey = apiKey || process.env.ODDS_API_KEY || '';
        this.baseUrl = process.env.ODDS_API_BASE_URL || 'https://api.the-odds-api.com/v4';
        this.rateLimit = parseInt(process.env.ODDS_API_RATE_LIMIT) || 500;
        this.timeout = parseInt(process.env.API_TIMEOUT) || 10000;
        
        // Request tracking
        this.requestCount = 0;
        this.lastFetch = null;
        this.cache = new Map();
        this.cacheDuration = parseInt(process.env.CACHE_DURATION) || 300000; // 5 minutes
        
        // Supported sports
        this.supportedSports = (process.env.SUPPORTED_SPORTS || 'basketball_nba,americanfootball_nfl,soccer_epl').split(',');
        
        console.log('🔗 RealOddsService initialized with live API integration');
    }

    // Test API connection and get available sports
    async testConnection() {
        try {
            const sports = await this.fetchLiveSports();
            return {
                success: true,
                sports: sports?.length || 0,
                requestsRemaining: this.rateLimit - this.requestCount,
                message: `Connected! ${sports?.length || 0} sports available.`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: `Connection failed: ${error.message}`
            };
        }
    }

    // Fetch available sports from The Odds API
    async fetchLiveSports() {
        const url = `${this.baseUrl}/sports?apiKey=${this.apiKey}`;
        
        try {
            const response = await this.makeRequest(url);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${await response.text()}`);
            }
            
            this.requestCount++;
            const sports = await response.json();
            
            // Filter to supported sports only
            return sports.filter(sport => 
                this.supportedSports.includes(sport.key) && sport.active
            );
        } catch (error) {
            console.error('Failed to fetch sports:', error);
            throw error;
        }
    }

    // Fetch live odds for a specific sport
    async fetchLiveOdds(sport = 'upcoming', regions = 'us', markets = 'h2h') {
        const cacheKey = `${sport}_${regions}_${markets}`;
        
        // Check cache first
        if (this.isValidCache(cacheKey)) {
            console.log(`📦 Using cached data for ${sport}`);
            return this.cache.get(cacheKey).data;
        }

        const url = `${this.baseUrl}/sports/${sport}/odds?apiKey=${this.apiKey}&regions=${regions}&markets=${markets}&oddsFormat=american&dateFormat=iso`;
        
        try {
            const response = await this.makeRequest(url);
            
            if (!response.ok) {
                const errorText = await response.text();
                
                if (response.status === 422) {
                    throw new Error(`Invalid sport "${sport}" or parameters. Check supported sports list.`);
                } else if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your credentials.');
                } else if (response.status === 429) {
                    throw new Error('Rate limit exceeded. Please wait before making more requests.');
                }
                
                throw new Error(`API Error ${response.status}: ${errorText}`);
            }
            
            this.requestCount++;
            this.lastFetch = new Date();
            
            const data = await response.json();
            const parsedData = this.parseOddsData(data);
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: parsedData,
                timestamp: Date.now()
            });
            
            console.log(`✅ Fetched ${parsedData.length} live events for ${sport}`);
            return parsedData;
            
        } catch (error) {
            console.error(`Failed to fetch live odds for ${sport}:`, error);
            throw error;
        }
    }

    // Make HTTP request with timeout
    async makeRequest(url) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'ArBETrage.AI/1.0'
                }
            });
            
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout. API might be slow or unavailable.');
            }
            throw error;
        }
    }

    // Parse API response into standardized format
    parseOddsData(apiData) {
        if (!Array.isArray(apiData)) {
            console.warn('API returned unexpected data format');
            return [];
        }

        return apiData.map(game => {
            try {
                return {
                    id: game.id,
                    sport: game.sport_title,
                    sportKey: game.sport_key,
                    homeTeam: game.home_team,
                    awayTeam: game.away_team,
                    commenceTime: new Date(game.commence_time),
                    bookmakers: this.parseBookmakers(game.bookmakers || [])
                };
            } catch (error) {
                console.error('Error parsing game data:', error, game);
                return null;
            }
        }).filter(Boolean);
    }

    // Parse bookmaker data
    parseBookmakers(bookmakers) {
        return bookmakers.map(bookmaker => {
            try {
                const market = bookmaker.markets?.[0]; // Get first market (usually h2h)
                
                if (!market || !market.outcomes) {
                    return null;
                }

                return {
                    name: this.standardizeBookmakerName(bookmaker.title),
                    lastUpdate: new Date(bookmaker.last_update),
                    odds: market.outcomes.map(outcome => ({
                        name: outcome.name,
                        odds: this.formatOdds(outcome.price),
                        decimalOdds: outcome.price
                    }))
                };
            } catch (error) {
                console.error('Error parsing bookmaker:', error, bookmaker);
                return null;
            }
        }).filter(Boolean);
    }

    // Standardize bookmaker names
    standardizeBookmakerName(name) {
        const nameMap = {
            'DraftKings': 'DraftKings',
            'FanDuel': 'FanDuel', 
            'BetMGM': 'BetMGM',
            'Caesars Sportsbook': 'Caesars',
            'PointsBet': 'PointsBet',
            'BetRivers': 'BetRivers',
            'William Hill (Caesars)': 'William Hill',
            'Fox Bet': 'Fox Bet'
        };
        
        return nameMap[name] || name;
    }

    // Convert decimal odds to American format
    formatOdds(decimal) {
        if (!decimal || decimal <= 1) return 'N/A';
        
        if (decimal >= 2.0) {
            return `+${Math.round((decimal - 1) * 100)}`;
        } else {
            return `-${Math.round(100 / (decimal - 1))}`;
        }
    }

    // Check if cached data is still valid
    isValidCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return false;
        
        return (Date.now() - cached.timestamp) < this.cacheDuration;
    }

    // Get usage statistics
    getRequestUsage() {
        return {
            requests: this.requestCount,
            remaining: Math.max(0, this.rateLimit - this.requestCount),
            lastFetch: this.lastFetch,
            cacheSize: this.cache.size,
            rateLimit: this.rateLimit
        };
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }

    // Get supported sports list
    getSupportedSports() {
        return this.supportedSports;
    }

    // Validate API key format
    isValidApiKey(apiKey = this.apiKey) {
        return apiKey && typeof apiKey === 'string' && apiKey.length >= 20;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealOddsService;
} else {
    window.RealOddsService = RealOddsService;
}