# ArBETrage.AI Environment Variables
# This file contains sensitive API keys and should NEVER be committed to Git

# The Odds API Configuration
ODDS_API_KEY=18630d83221a5627442cd047a67f1cec
ODDS_API_BASE_URL=https://api.the-odds-api.com/v4

# Rate Limiting (requests per month based on plan)
ODDS_API_RATE_LIMIT=500

# Supported Sports (comma-separated)
SUPPORTED_SPORTS=basketball_nba,americanfootball_nfl,soccer_epl,baseball_mlb,icehockey_nhl

# API Configuration
API_TIMEOUT=10000
CACHE_DURATION=300000

# Development/Production Environment
NODE_ENV=development