#!/usr/bin/env node

// ArBETrage.AI Environment Setup Script
// Helps users set up their environment variables and configuration

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class EnvironmentSetup {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        this.config = {
            ODDS_API_KEY: '',
            ODDS_API_BASE_URL: 'https://api.the-odds-api.com/v4',
            ODDS_API_RATE_LIMIT: '500',
            SUPPORTED_SPORTS: 'basketball_nba,americanfootball_nfl,soccer_epl,baseball_mlb,icehockey_nhl',
            API_TIMEOUT: '10000',
            CACHE_DURATION: '300000',
            NODE_ENV: 'development'
        };
        
        console.log('🚀 ArBETrage.AI Environment Setup');
        console.log('=====================================\n');
    }

    async run() {
        try {
            await this.welcomeMessage();
            await this.checkExistingEnv();
            await this.setupApiKey();
            await this.configureSports();
            await this.configureSettings();
            await this.createEnvFile();
            await this.updateGitignore();
            await this.validateSetup();
            await this.showFinalInstructions();
            
        } catch (error) {
            console.error('❌ Setup failed:', error.message);
            process.exit(1);
        } finally {
            this.rl.close();
        }
    }

    async welcomeMessage() {
        console.log('This script will help you set up ArBETrage.AI with live data integration.');
        console.log('You will need:');
        console.log('  • The Odds API key (get free at https://the-odds-api.com)');
        console.log('  • Basic configuration preferences\n');
        
        const proceed = await this.question('Do you want to continue? (y/N): ');
        if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
            console.log('Setup cancelled.');
            process.exit(0);
        }
        console.log();
    }

    async checkExistingEnv() {
        if (fs.existsSync('.env')) {
            console.log('⚠️  Found existing .env file.');
            const overwrite = await this.question('Do you want to overwrite it? (y/N): ');
            
            if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
                console.log('Setup cancelled to preserve existing configuration.');
                process.exit(0);
            }
            
            // Backup existing file
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            fs.copyFileSync('.env', `.env.backup.${timestamp}`);
            console.log(`✅ Existing .env backed up as .env.backup.${timestamp}`);
        }
        console.log();
    }

    async setupApiKey() {
        console.log('📋 API Configuration');
        console.log('--------------------');
        
        const hasApiKey = await this.question('Do you have The Odds API key? (y/N): ');
        
        if (hasApiKey.toLowerCase() === 'y' || hasApiKey.toLowerCase() === 'yes') {
            const apiKey = await this.question('Enter your Odds API key: ');
            
            if (apiKey && apiKey.length > 10) {
                this.config.ODDS_API_KEY = apiKey;
                console.log('✅ API key configured');
            } else {
                console.log('⚠️  API key seems invalid, but continuing...');
                this.config.ODDS_API_KEY = apiKey;
            }
        } else {
            console.log('🔗 You can get a free API key at: https://the-odds-api.com');
            console.log('   • Free tier: 500 requests/month');
            console.log('   • Paid plans: Starting at $10/month for 5,000 requests');
            
            const continueWithoutKey = await this.question('Continue without API key? (demo mode only) (y/N): ');
            if (continueWithoutKey.toLowerCase() !== 'y' && continueWithoutKey.toLowerCase() !== 'yes') {
                console.log('Please get an API key and run setup again.');
                process.exit(0);
            }
            
            this.config.ODDS_API_KEY = ''; // Empty for demo mode
        }
        console.log();
    }

    async configureSports() {
        console.log('🏈 Sports Configuration');
        console.log('-----------------------');
        
        const availableSports = {
            'basketball_nba': 'NBA Basketball',
            'americanfootball_nfl': 'NFL Football',
            'soccer_epl': 'Premier League Soccer',
            'baseball_mlb': 'MLB Baseball',
            'icehockey_nhl': 'NHL Hockey',
            'basketball_ncaab': 'College Basketball',
            'americanfootball_ncaaf': 'College Football'
        };

        console.log('Available sports:');
        Object.entries(availableSports).forEach(([key, name], index) => {
            console.log(`  ${index + 1}. ${name} (${key})`);
        });
        
        const useDefault = await this.question('Use default sports selection (NBA, NFL, Premier League, MLB, NHL)? (Y/n): ');
        
        if (useDefault.toLowerCase() === 'n' || useDefault.toLowerCase() === 'no') {
            const sportsList = await this.question('Enter sport keys separated by commas: ');
            if (sportsList.trim()) {
                this.config.SUPPORTED_SPORTS = sportsList.trim();
            }
        }
        
        console.log(`✅ Sports configured: ${this.config.SUPPORTED_SPORTS.replace(/,/g, ', ')}`);
        console.log();
    }

    async configureSettings() {
        console.log('⚙️  Advanced Settings');
        console.log('---------------------');
        
        // Rate limit
        const rateLimit = await this.question(`API rate limit per month (${this.config.ODDS_API_RATE_LIMIT}): `);
        if (rateLimit && !isNaN(rateLimit)) {
            this.config.ODDS_API_RATE_LIMIT = rateLimit;
        }
        
        // Cache duration
        const cacheDuration = await this.question('Cache duration in milliseconds (300000 = 5 minutes): ');
        if (cacheDuration && !isNaN(cacheDuration)) {
            this.config.CACHE_DURATION = cacheDuration;
        }
        
        // Environment
        const isDevelopment = await this.question('Development environment? (Y/n): ');
        if (isDevelopment.toLowerCase() === 'n' || isDevelopment.toLowerCase() === 'no') {
            this.config.NODE_ENV = 'production';
        }
        
        console.log('✅ Settings configured');
        console.log();
    }

    async createEnvFile() {
        console.log('📁 Creating .env file');
        console.log('---------------------');
        
        const envContent = this.generateEnvContent();
        
        try {
            fs.writeFileSync('.env', envContent, 'utf8');
            console.log('✅ .env file created successfully');
            
            // Set appropriate permissions (Unix/Linux/macOS)
            if (process.platform !== 'win32') {
                fs.chmodSync('.env', 0o600); // Read/write for owner only
                console.log('✅ File permissions set to 600 (owner read/write only)');
            }
        } catch (error) {
            throw new Error(`Failed to create .env file: ${error.message}`);
        }
        console.log();
    }

    async updateGitignore() {
        console.log('📝 Updating .gitignore');
        console.log('----------------------');
        
        const gitignoreEntries = [
            '# Environment variables and sensitive data',
            '.env',
            '.env.local',
            '.env.development.local',
            '.env.test.local',
            '.env.production.local',
            '',
            '# API keys and configuration files',
            'config.js',
            'api-keys.txt',
            'secrets.json',
            '',
            '# Backup files',
            '.env.backup.*'
        ];
        
        let gitignoreContent = '';
        
        if (fs.existsSync('.gitignore')) {
            gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
            console.log('✅ Found existing .gitignore');
        }
        
        // Check if .env is already in .gitignore
        if (!gitignoreContent.includes('.env')) {
            const newContent = gitignoreContent + '\n' + gitignoreEntries.join('\n') + '\n';
            fs.writeFileSync('.gitignore', newContent, 'utf8');
            console.log('✅ Added environment files to .gitignore');
        } else {
            console.log('✅ Environment files already in .gitignore');
        }
        console.log();
    }

    async validateSetup() {
        console.log('🔍 Validating Setup');
        console.log('-------------------');
        
        const validations = [
            { check: () => fs.existsSync('.env'), message: '.env file exists' },
            { check: () => fs.existsSync('.gitignore'), message: '.gitignore file exists' },
            { check: () => this.config.ODDS_API_KEY || true, message: 'API key configured (or demo mode)' },
            { check: () => this.config.SUPPORTED_SPORTS.length > 0, message: 'Sports configured' },
            { check: () => !fs.readFileSync('.gitignore', 'utf8').includes('.env'), message: '.env is in .gitignore' }
        ];
        
        let allValid = true;
        
        validations.forEach(({ check, message }) => {
            const isValid = check();
            console.log(`${isValid ? '✅' : '❌'} ${message}`);
            if (!isValid) allValid = false;
        });
        
        if (!allValid) {
            throw new Error('Validation failed. Please check the issues above.');
        }
        
        console.log('\n🎉 Setup validation passed!');
        console.log();
    }

    async showFinalInstructions() {
        console.log('🎯 Setup Complete!');
        console.log('==================');
        console.log('Your ArBETrage.AI environment is now configured.\n');
        
        console.log('📋 What was created:');
        console.log('  • .env file with your configuration');
        console.log('  • Updated .gitignore to protect sensitive data');
        console.log('  • Backup of any existing .env file\n');
        
        console.log('🚀 Next steps:');
        console.log('  1. Start the application: npm start');
        console.log('  2. Open http://localhost:8080 in your browser');
        
        if (this.config.ODDS_API_KEY) {
            console.log('  3. Connect to live data using your API key');
            console.log(`  4. You have ${this.config.ODDS_API_RATE_LIMIT} API calls per month`);
        } else {
            console.log('  3. Use demo mode for learning');
            console.log('  4. Get API key from https://the-odds-api.com for live data');
        }
        
        console.log('\n⚠️  Important reminders:');
        console.log('  • Never commit the .env file to version control');
        console.log('  • Keep your API key secure and private');
        console.log('  • Check local gambling laws before using');
        console.log('  • Sportsbooks may limit accounts using arbitrage\n');
        
        console.log('🔗 Useful links:');
        console.log('  • The Odds API: https://the-odds-api.com');
        console.log('  • Documentation: See README.md');
        console.log('  • Support: Check GitHub issues\n');
        
        console.log('Happy arbitraging! 🎯💰');
    }

    generateEnvContent() {
        const header = `# ArBETrage.AI Environment Configuration
# Generated on ${new Date().toISOString()}
# This file contains sensitive API keys - NEVER commit to version control

# ============================================================================
# THE ODDS API CONFIGURATION
# ============================================================================
# Get your free API key at: https://the-odds-api.com
# Free tier: 500 requests/month
# Paid plans: Starting at $10/month for 5,000 requests
`;

        const envVars = Object.entries(this.config)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        const footer = `
# ============================================================================
# ADDITIONAL SETTINGS
# ============================================================================

# Development/Production mode
# NODE_ENV=development

# Security settings
# LOG_API_CALLS=false
# MASK_API_KEYS=true

# UI Settings  
# AUTO_REFRESH=false
# REFRESH_INTERVAL=60000
# SHOW_ADVANCED_METRICS=false

# ============================================================================
# IMPORTANT NOTES
# ============================================================================
# 1. Keep this file secure and never share publicly
# 2. Add .env to your .gitignore file  
# 3. Use environment-specific files (.env.development, .env.production)
# 4. Restart the application after changing these values
# 5. Check your API usage regularly to avoid overages
# ============================================================================
`;

        return header + '\n' + envVars + footer;
    }

    question(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, resolve);
        });
    }
}

// Run the setup if this script is executed directly
if (require.main === module) {
    const setup = new EnvironmentSetup();
    setup.run().catch(console.error);
}

module.exports = EnvironmentSetup;