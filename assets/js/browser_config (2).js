// Browser Configuration for GitHub Pages Deployment
// This file provides API configuration when .env is not available

window.ArbitrageConfig = {
    // API Configuration
    ODDS_API_KEY: '18630d83221a5627442cd047a67f1cec',
    ODDS_API_BASE_URL: 'https://api.the-odds-api.com/v4',
    ODDS_API_RATE_LIMIT: 500,
    
    // Supported Sports
    SUPPORTED_SPORTS: ['basketball_nba', 'americanfootball_nfl', 'soccer_epl', 'baseball_mlb', 'icehockey_nhl'],
    
    // Cache Settings
    CACHE_DURATION: 300000, // 5 minutes
    API_TIMEOUT: 10000,
    
    // Environment
    NODE_ENV: 'production',
    DEPLOYMENT_TYPE: 'github-pages'
};

// Auto-initialize if config manager is available
if (typeof configManager !== 'undefined') {
    // Merge browser config into config manager
    configManager.set('api.oddsApiKey', window.ArbitrageConfig.ODDS_API_KEY);
    configManager.set('api.baseUrl', window.ArbitrageConfig.ODDS_API_BASE_URL);
    configManager.set('api.rateLimit', window.ArbitrageConfig.ODDS_API_RATE_LIMIT);
    configManager.set('sports.supported', window.ArbitrageConfig.SUPPORTED_SPORTS);
    configManager.set('cache.duration', window.ArbitrageConfig.CACHE_DURATION);
    configManager.set('api.timeout', window.ArbitrageConfig.API_TIMEOUT);
    
    console.log('🌐 Browser configuration loaded for GitHub Pages deployment');
}