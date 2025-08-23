// ArBETrage.AI Configuration Manager
// Handles environment variables, API configuration, and app settings

class ConfigManager {
    constructor() {
        this.config = {};
        this.loadConfiguration();
        
        console.log('⚙️ ConfigManager initialized');
    }

    // Load configuration from multiple sources
    loadConfiguration() {
        // Default configuration
        this.config = {
            // API Configuration
            api: {
                oddsApiKey: '',
                baseUrl: 'https://api.the-odds-api.com/v4',
                timeout: 10000,
                rateLimit: 500,
                retryAttempts: 3,
                retryDelay: 1000
            },
            
            // Supported sports and markets
            sports: {
                supported: [
                    'basketball_nba',
                    'americanfootball_nfl', 
                    'soccer_epl',
                    'baseball_mlb',
                    'icehockey_nhl'
                ],
                markets: ['h2h', 'spreads', 'totals'],
                regions: ['us', 'uk', 'eu']
            },
            
            // Arbitrage detection settings
            arbitrage: {
                minMargin: 0.1,
                maxMargin: 15.0,
                minBookmakers: 2,
                confidenceThresholds: {
                    high: 2.0,
                    medium: 1.0,
                    low: 0.1
                }
            },
            
            // Cache settings
            cache: {
                duration: 300000, // 5 minutes
                maxEntries: 100,
                enableCaching: true
            },
            
            // UI Settings
            ui: {
                autoRefresh: false,
                refreshInterval: 60000, // 1 minute
                showAdvancedMetrics: false,
                theme: 'default',
                notifications: true
            },
            
            // Security settings
            security: {
                apiKeyMasking: true,
                logApiCalls: false,
                secureStorage: true
            },
            
            // Development settings
            development: {
                debugMode: false,
                mockData: false,
                verboseLogging: false
            }
        };

        // Load from environment variables (Node.js/server-side)
        this.loadFromEnvironment();
        
        // Load from localStorage (browser-side)
        this.loadFromLocalStorage();
        
        // Load from URL parameters
        this.loadFromUrlParams();
        
        console.log('📋 Configuration loaded:', this.getSafeConfig());
    }

    // Load configuration from environment variables
    loadFromEnvironment() {
        if (typeof process === 'undefined' || !process.env) return;
        
        const env = process.env;
        
        // API configuration
        if (env.ODDS_API_KEY) {
            this.config.api.oddsApiKey = env.ODDS_API_KEY;
        }
        
        if (env.ODDS_API_BASE_URL) {
            this.config.api.baseUrl = env.ODDS_API_BASE_URL;
        }
        
        if (env.ODDS_API_RATE_LIMIT) {
            this.config.api.rateLimit = parseInt(env.ODDS_API_RATE_LIMIT) || 500;
        }
        
        if (env.API_TIMEOUT) {
            this.config.api.timeout = parseInt(env.API_TIMEOUT) || 10000;
        }
        
        // Sports configuration
        if (env.SUPPORTED_SPORTS) {
            this.config.sports.supported = env.SUPPORTED_SPORTS.split(',');
        }
        
        // Cache configuration
        if (env.CACHE_DURATION) {
            this.config.cache.duration = parseInt(env.CACHE_DURATION) || 300000;
        }
        
        // Development settings
        if (env.NODE_ENV === 'development') {
            this.config.development.debugMode = true;
            this.config.development.verboseLogging = true;
        }
        
        if (env.DEBUG_MODE === 'true') {
            this.config.development.debugMode = true;
        }
        
        console.log('🌍 Environment variables loaded');
    }

    // Load configuration from localStorage
    loadFromLocalStorage() {
        if (typeof localStorage === 'undefined') return;
        
        try {
            const stored = localStorage.getItem('arbitrage_config');
            if (stored) {
                const parsedConfig = JSON.parse(stored);
                this.mergeConfig(parsedConfig);
                console.log('💾 Configuration loaded from localStorage');
            }
        } catch (error) {
            console.warn('Failed to load configuration from localStorage:', error);
        }
    }

    // Load configuration from URL parameters
    loadFromUrlParams() {
        if (typeof window === 'undefined' || !window.location) return;
        
        const urlParams = new URLSearchParams(window.location.search);
        
        // Debug mode
        if (urlParams.get('debug') === 'true') {
            this.config.development.debugMode = true;
        }
        
        // Mock data mode
        if (urlParams.get('mock') === 'true') {
            this.config.development.mockData = true;
        }
        
        // API key (for testing - not recommended for production)
        if (urlParams.get('api_key')) {
            console.warn('⚠️ API key provided via URL - this is not secure for production');
            this.config.api.oddsApiKey = urlParams.get('api_key');
        }
        
        console.log('🔗 URL parameters processed');
    }

    // Merge configuration objects
    mergeConfig(newConfig) {
        this.config = this.deepMerge(this.config, newConfig);
    }

    // Deep merge utility function
    deepMerge(target, source) {
        const output = { ...target };
        
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this.deepMerge(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        
        return output;
    }

    // Check if value is an object
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    // Get configuration value by path
    get(path, defaultValue = null) {
        const keys = path.split('.');
        let current = this.config;
        
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return defaultValue;
            }
        }
        
        return current;
    }

    // Set configuration value by path
    set(path, value) {
        const keys = path.split('.');
        let current = this.config;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[keys[keys.length - 1]] = value;
        
        // Save to localStorage if available
        this.saveToLocalStorage();
    }

    // Save configuration to localStorage
    saveToLocalStorage() {
        if (typeof localStorage === 'undefined') return;
        
        try {
            // Create safe config without sensitive data
            const safeConfig = this.getSafeConfig();
            localStorage.setItem('arbitrage_config', JSON.stringify(safeConfig));
            console.log('💾 Configuration saved to localStorage');
        } catch (error) {
            console.warn('Failed to save configuration to localStorage:', error);
        }
    }

    // Get configuration without sensitive data
    getSafeConfig() {
        const safe = { ...this.config };
        
        // Mask API key
        if (safe.api && safe.api.oddsApiKey) {
            const key = safe.api.oddsApiKey;
            safe.api.oddsApiKey = key.length > 8 
                ? key.substring(0, 4) + '...' + key.substring(key.length - 4)
                : '***masked***';
        }
        
        return safe;
    }

    // Validate configuration
    validate() {
        const errors = [];
        
        // Validate API key
        if (this.config.api.oddsApiKey && this.config.api.oddsApiKey.length < 20) {
            errors.push('API key appears to be invalid (too short)');
        }
        
        // Validate URLs
        try {
            new URL(this.config.api.baseUrl);
        } catch {
            errors.push('Invalid API base URL');
        }
        
        // Validate numeric values
        if (this.config.api.timeout <= 0) {
            errors.push('API timeout must be positive');
        }
        
        if (this.config.api.rateLimit <= 0) {
            errors.push('Rate limit must be positive');
        }
        
        // Validate arbitrage settings
        if (this.config.arbitrage.minMargin < 0) {
            errors.push('Minimum arbitrage margin cannot be negative');
        }
        
        if (this.config.arbitrage.maxMargin <= this.config.arbitrage.minMargin) {
            errors.push('Maximum arbitrage margin must be greater than minimum');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Get API configuration
    getApiConfig() {
        return {
            apiKey: this.config.api.oddsApiKey,
            baseUrl: this.config.api.baseUrl,
            timeout: this.config.api.timeout,
            rateLimit: this.config.api.rateLimit,
            retryAttempts: this.config.api.retryAttempts,
            retryDelay: this.config.api.retryDelay
        };
    }

    // Get sports configuration
    getSportsConfig() {
        return {
            supported: this.config.sports.supported,
            markets: this.config.sports.markets,
            regions: this.config.sports.regions
        };
    }

    // Get arbitrage detection settings
    getArbitrageConfig() {
        return {
            minMargin: this.config.arbitrage.minMargin,
            maxMargin: this.config.arbitrage.maxMargin,
            minBookmakers: this.config.arbitrage.minBookmakers,
            confidenceThresholds: this.config.arbitrage.confidenceThresholds
        };
    }

    // Check if feature is enabled
    isFeatureEnabled(feature) {
        const featureMap = {
            'caching': this.config.cache.enableCaching,
            'autoRefresh': this.config.ui.autoRefresh,
            'notifications': this.config.ui.notifications,
            'advancedMetrics': this.config.ui.showAdvancedMetrics,
            'debugMode': this.config.development.debugMode,
            'mockData': this.config.development.mockData,
            'verboseLogging': this.config.development.verboseLogging
        };
        
        return featureMap[feature] || false;
    }

    // Reset configuration to defaults
    reset() {
        this.config = {};
        this.loadConfiguration();
        
        // Clear localStorage
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('arbitrage_config');
        }
        
        console.log('🔄 Configuration reset to defaults');
    }

    // Export configuration for backup
    export() {
        return {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            config: this.getSafeConfig()
        };
    }

    // Import configuration from backup
    import(exportedConfig) {
        try {
            if (exportedConfig.config) {
                this.mergeConfig(exportedConfig.config);
                this.saveToLocalStorage();
                console.log('📥 Configuration imported successfully');
                return true;
            }
        } catch (error) {
            console.error('Failed to import configuration:', error);
        }
        return false;
    }
}

// Create global instance
const configManager = new ConfigManager();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigManager;
} else {
    window.ConfigManager = ConfigManager;
    window.configManager = configManager;
}