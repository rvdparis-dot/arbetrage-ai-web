// ArBETrage.AI - Enhanced with Real Live Data Integration
// Updated app.js with live API integration and real arbitrage detection

// Load environment variables if available (for Node.js environments)
if (typeof process !== 'undefined' && process.env) {
    // Environment variables are available
    console.log('🌍 Environment variables loaded');
} else {
    console.log('🌐 Running in browser environment');
}

// Global state management
const appState = {
    currentStep: 1,
    scanResults: [],
    selectedOpportunity: null,
    isLiveMode: false,
    apiConnected: false,
    requestCount: 0,
    lastScanTime: null
};

// Initialize services
let realOddsService = null;
let arbitrageDetector = null;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ArBETrage.AI initializing with live data capabilities...');
    
    // Initialize services
    arbitrageDetector = new ArbitrageDetector();
    
    // Initialize API configuration UI
    initializeAPIConfiguration();
    
    // Initialize existing functionality
    initializeEventListeners();
    initializeCalculator();
    
    console.log('✅ ArBETrage.AI ready for live arbitrage detection!');
});

// Initialize API configuration interface
function initializeAPIConfiguration() {
    // Add API configuration card to DOM if it doesn't exist
    const apiCard = document.getElementById('apiConfigCard');
    if (!apiCard) {
        insertAPIConfigurationHTML();
    }
    
    // Connect API button
    const connectButton = document.getElementById('connectAPIButton');
    if (connectButton) {
        connectButton.addEventListener('click', handleAPIConnection);
    }
    
    // Demo mode button
    const demoButton = document.getElementById('useDemoButton');
    if (demoButton) {
        demoButton.addEventListener('click', () => {
            document.getElementById('apiConfigCard').style.display = 'none';
            appState.lastScanTime = new Date();
        
    } catch (error) {
        console.error('Scan failed:', error);
        showFeedback(`❌ Scan failed: ${error.message}`, false);
    } finally {
        // Restore button state
        icon.innerHTML = originalIconHTML;
        text.textContent = originalText;
        button.disabled = false;
    }
}

// Scan live markets using real API
async function scanLiveMarkets() {
    showFeedback('🔍 Fetching real-time odds from multiple sportsbooks...');
    
    try {
        const supportedSports = realOddsService.getSupportedSports();
        const allOpportunities = [];
        
        // Fetch odds for each supported sport
        for (const sport of supportedSports.slice(0, 3)) { // Limit to 3 sports to conserve API calls
            showFeedback(`🔍 Analyzing ${sport.replace('_', ' ').toUpperCase()} markets...`);
            
            const liveOdds = await realOddsService.fetchLiveOdds(sport);
            
            if (liveOdds && liveOdds.length > 0) {
                const opportunities = arbitrageDetector.findArbitrageOpportunities(liveOdds);
                allOpportunities.push(...opportunities);
                
                console.log(`Found ${opportunities.length} opportunities in ${sport}`);
            }
            
            // Small delay to respect API rate limits
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // Display results
        if (allOpportunities.length > 0) {
            displayArbitrageResults(allOpportunities);
            
            const stats = arbitrageDetector.getStatistics();
            showFeedback(`✅ LIVE SCAN COMPLETE! Found ${allOpportunities.length} real arbitrage opportunities. Best margin: ${stats.bestOpportunity ? stats.bestOpportunity.arbitrageMargin.toFixed(2) + '%' : 'N/A'}`);
        } else {
            showFeedback('📊 Live scan complete. No arbitrage opportunities found in current markets. This is normal - markets are generally efficient!');
        }
        
        // Show API usage
        const usage = realOddsService.getRequestUsage();
        console.log(`📊 API Usage: ${usage.requests} requests used, ${usage.remaining} remaining`);
        
    } catch (error) {
        console.error('Live scan failed:', error);
        showFeedback(`❌ Live scan failed: ${error.message}. Falling back to demo data.`, false);
        
        // Fallback to demo data
        await scanDemoData();
    }
}

// Fallback demo data scan (original functionality)
async function scanDemoData() {
    showFeedback('🔍 Scanning demo sportsbooks for arbitrage opportunities...');
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate demo arbitrage opportunities
    const demoOpportunities = generateDemoOpportunities();
    
    if (demoOpportunities.length > 0) {
        displayArbitrageResults(demoOpportunities);
        showFeedback(`✅ DEMO SCAN COMPLETE! Found ${demoOpportunities.length} educational arbitrage examples.`);
    } else {
        showFeedback('📊 Demo scan complete. No demo opportunities generated.');
    }
}

// Display arbitrage results (works for both live and demo data)
function displayArbitrageResults(opportunities) {
    appState.scanResults = opportunities.sort((a, b) => b.arbitrageMargin - a.arbitrageMargin);
    displayScanResults();
    advanceToStep(2);
}

// Enhanced display scan results with live data features
function displayScanResults() {
    const resultsContainer = document.querySelector('.scan-results');
    if (!resultsContainer || !appState.scanResults.length) return;
    
    resultsContainer.innerHTML = '';
    
    // Add header with statistics
    const header = document.createElement('div');
    header.className = 'results-header';
    header.innerHTML = `
        <div class="results-stats">
            <div class="stat-item">
                <span class="stat-value">${appState.scanResults.length}</span>
                <span class="stat-label">Opportunities Found</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${appState.scanResults[0]?.arbitrageMargin.toFixed(2) || 0}%</span>
                <span class="stat-label">Best Margin</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${appState.isLiveMode ? 'LIVE' : 'DEMO'}</span>
                <span class="stat-label">Data Source</span>
            </div>
            ${appState.isLiveMode ? `
            <div class="stat-item">
                <span class="stat-value">${realOddsService?.getRequestUsage().requests || 0}</span>
                <span class="stat-label">API Calls Used</span>
            </div>
            ` : ''}
        </div>
    `;
    resultsContainer.appendChild(header);
    
    // Display each opportunity
    appState.scanResults.forEach((opportunity, index) => {
        const card = createOpportunityCard(opportunity, index);
        resultsContainer.appendChild(card);
    });
}

// Create enhanced opportunity card with live data features
function createOpportunityCard(opportunity, index) {
    const card = document.createElement('div');
    card.className = 'opportunity-card';
    card.setAttribute('data-index', index);
    
    // Determine card styling based on margin
    let cardClass = 'opportunity-low';
    if (opportunity.arbitrageMargin > 3) cardClass = 'opportunity-high';
    else if (opportunity.arbitrageMargin > 1.5) cardClass = 'opportunity-medium';
    
    card.classList.add(cardClass);
    
    const gameTime = opportunity.gameTime || 'TBD';
    const confidence = opportunity.confidence || 'Medium';
    const riskLevel = opportunity.riskLevel || 'Medium';
    
    card.innerHTML = `
        <div class="opportunity-header">
            <div class="opportunity-sport">${opportunity.sport}</div>
            <div class="opportunity-margin ${confidence.toLowerCase().replace(' ', '-')}-confidence">
                ${opportunity.arbitrageMargin.toFixed(2)}% Margin
            </div>
        </div>
        
        <div class="opportunity-matchup">
            <strong>${opportunity.matchup}</strong>
        </div>
        
        <div class="opportunity-time">
            <span class="time-label">Game Time:</span> ${gameTime}
            ${appState.isLiveMode ? `<span class="live-badge">LIVE DATA</span>` : '<span class="demo-badge">DEMO</span>'}
        </div>
        
        <div class="opportunity-outcomes">
            ${opportunity.outcomes.map((outcome, i) => `
                <div class="outcome-item">
                    <div class="outcome-name">${outcome.name}</div>
                    <div class="outcome-details">
                        <span class="outcome-odds">${outcome.odds}</span>
                        <span class="outcome-bookmaker">${outcome.bookmaker}</span>
                    </div>
                </div>
            `).join('')}
        </div>
        
        ${appState.isLiveMode ? `
        <div class="opportunity-metadata">
            <div class="meta-item">
                <span class="meta-label">Confidence:</span>
                <span class="meta-value confidence-${confidence.toLowerCase().replace(' ', '-')}">${confidence}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Risk Level:</span>
                <span class="meta-value risk-${riskLevel.toLowerCase()}">${riskLevel}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Speed Req:</span>
                <span class="meta-value">${opportunity.requiredSpeed || 'Moderate'}</span>
            </div>
            ${opportunity.lastUpdate ? `
            <div class="meta-item">
                <span class="meta-label">Updated:</span>
                <span class="meta-value">${new Date(opportunity.lastUpdate).toLocaleTimeString()}</span>
            </div>
            ` : ''}
        </div>
        ` : ''}
        
        <div class="opportunity-actions">
            <button class="button-primary calculate-btn" onclick="selectOpportunity(${index})">
                Calculate Stakes
            </button>
            ${appState.isLiveMode ? `
            <button class="button-secondary refresh-btn" onclick="refreshOpportunity(${index})">
                🔄 Refresh Odds
            </button>
            ` : ''}
        </div>
    `;
    
    return card;
}

// Refresh a specific opportunity's odds
async function refreshOpportunity(index) {
    if (!appState.isLiveMode || !realOddsService) {
        showFeedback('⚠️ Refresh only available in live mode', false);
        return;
    }
    
    const opportunity = appState.scanResults[index];
    if (!opportunity) return;
    
    const refreshBtn = document.querySelector(`[data-index="${index}"] .refresh-btn`);
    const originalHTML = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '<div class="loading" style="width: 12px; height: 12px;"></div> Refreshing...';
    refreshBtn.disabled = true;
    
    try {
        showFeedback('🔄 Refreshing odds for this opportunity...');
        
        // Fetch fresh odds for this sport
        const freshOdds = await realOddsService.fetchLiveOdds(opportunity.sportKey);
        
        // Find the specific game
        const updatedGame = freshOdds.find(game => 
            game.homeTeam === opportunity.homeTeam && 
            game.awayTeam === opportunity.awayTeam
        );
        
        if (updatedGame) {
            const updatedOpportunities = arbitrageDetector.findArbitrageOpportunities([updatedGame]);
            
            if (updatedOpportunities.length > 0) {
                appState.scanResults[index] = updatedOpportunities[0];
                displayScanResults();
                showFeedback('✅ Odds refreshed successfully!');
            } else {
                showFeedback('⚠️ Arbitrage opportunity no longer exists after refresh', false);
                // Mark as expired
                appState.scanResults[index].expired = true;
                displayScanResults();
            }
        } else {
            showFeedback('⚠️ Game not found in current odds feed', false);
        }
        
    } catch (error) {
        console.error('Failed to refresh opportunity:', error);
        showFeedback(`❌ Refresh failed: ${error.message}`, false);
    }
    
    refreshBtn.innerHTML = originalHTML;
    refreshBtn.disabled = false;
}

// Generate demo opportunities (fallback)
function generateDemoOpportunities() {
    return [
        {
            id: 'demo_1',
            sport: 'Basketball',
            matchup: 'Lakers vs Warriors',
            gameTime: '2h',
            outcomes: [
                { id: 1, name: 'Lakers', odds: '+125', bookmaker: 'DraftKings', decimalOdds: 2.25 },
                { id: 2, name: 'Warriors', odds: '-135', bookmaker: 'FanDuel', decimalOdds: 1.74 }
            ],
            arbitrageMargin: 2.1,
            confidence: 'High',
            riskLevel: 'Low'
        },
        {
            id: 'demo_2', 
            sport: 'Football',
            matchup: 'Chiefs vs Bills',
            gameTime: '1d 3h',
            outcomes: [
                { id: 1, name: 'Chiefs', odds: '+110', bookmaker: 'BetMGM', decimalOdds: 2.10 },
                { id: 2, name: 'Bills', odds: '-105', bookmaker: 'Caesars', decimalOdds: 1.95 }
            ],
            arbitrageMargin: 1.7,
            confidence: 'Medium',
            riskLevel: 'Low'
        }
    ];
}

// Insert API configuration HTML into DOM
function insertAPIConfigurationHTML() {
    const workflow = document.querySelector('.workflow-container');
    if (!workflow) return;
    
    const apiHTML = `
    <div class="api-config-card" id="apiConfigCard">
        <div class="step-card">
            <div class="step-header">
                <div class="step-number">🔑</div>
                <div class="step-title">API Configuration</div>
            </div>
            <div class="step-description">Connect to live sportsbook data or use demo mode</div>
            
            <div class="api-options">
                <div class="input-group">
                    <label class="input-label">The Odds API Key (Optional)</label>
                    <div class="search-container">
                        <input type="password" id="apiKeyInput" class="input-field" placeholder="Enter your API key for live data">
                        <button id="connectAPIButton" class="button-primary">🔗 Connect</button>
                    </div>
                    <small>Get your free API key at <a href="https://the-odds-api.com" target="_blank">the-odds-api.com</a> (500 free requests/month)</small>
                </div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <strong>OR</strong>
                </div>
                
                <button id="useDemoButton" class="button-secondary" style="width: 100%;">
                    📊 Use Demo Data (Educational Mode)
                </button>
            </div>
        </div>
    </div>
    `;
    
    workflow.insertAdjacentHTML('afterbegin', apiHTML);
}

// Enhanced feedback function with live data context
function showFeedback(message, success = true) {
    const existingFeedback = document.querySelector('.feedback-message');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    const feedback = document.createElement('div');
    feedback.className = `feedback-message ${success ? 'success' : 'error'}`;
    feedback.textContent = message;
    
    // Add API usage info for live mode
    if (appState.isLiveMode && realOddsService) {
        const usage = realOddsService.getRequestUsage();
        const usageText = ` (${usage.requests}/${usage.rateLimit} API calls used)`;
        feedback.textContent += usageText;
    }
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 5000);
    
    console.log(`${success ? '✅' : '❌'} ${message}`);
}

// Initialize existing event listeners and calculator
function initializeEventListeners() {
    // Scan button
    const scanButton = document.getElementById('scanArbitrageButton');
    if (scanButton) {
        scanButton.addEventListener('click', scanForArbitrage);
    }
    
    // Other existing event listeners...
    // (Include your existing event listener code here)
}

function initializeCalculator() {
    // Include your existing calculator initialization code here
}

// Utility functions
function selectOpportunity(index) {
    appState.selectedOpportunity = appState.scanResults[index];
    // Navigate to calculator or show stakes calculation
    advanceToStep(3);
}

function advanceToStep(step) {
    appState.currentStep = step;
    // Update UI to show the specified step
    console.log(`Advanced to step ${step}`);
}isLiveMode = false;
            showFeedback('📊 Demo mode active. Using educational data for learning purposes.');
        });
    }
    
    // Auto-connect if API key is available in environment
    const envApiKey = typeof process !== 'undefined' && process.env ? process.env.ODDS_API_KEY : null;
    if (envApiKey) {
        console.log('🔑 API key found in environment, auto-connecting...');
        initializeRealAPI(envApiKey);
    }
}

// Handle API connection
async function handleAPIConnection() {
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
        showFeedback('⚠️ Please enter your API key', false);
        return;
    }
    
    const button = document.getElementById('connectAPIButton');
    const originalHTML = button.innerHTML;
    button.innerHTML = '<div class="loading" style="width: 16px; height: 16px;"></div> Connecting...';
    button.disabled = true;
    
    try {
        const success = await initializeRealAPI(apiKey);
        
        if (success) {
            document.getElementById('apiConfigCard').style.display = 'none';
            showFeedback('✅ Connected to live API! Ready for real-time arbitrage detection.');
            
            // Update scan button text
            const scanButton = document.getElementById('scanArbitrageButton');
            if (scanButton) {
                const buttonText = scanButton.querySelector('.action-text');
                if (buttonText) {
                    buttonText.textContent = 'Scan Live Markets';
                }
            }
        }
    } catch (error) {
        showFeedback(`❌ Connection failed: ${error.message}`, false);
        console.error('API connection error:', error);
    }
    
    button.innerHTML = originalHTML;
    button.disabled = false;
}

// Initialize real API service
async function initializeRealAPI(apiKey) {
    try {
        if (!apiKey || apiKey.length < 20) {
            throw new Error('Invalid API key format');
        }
        
        realOddsService = new RealOddsService(apiKey);
        
        // Test the connection
        const testResult = await realOddsService.testConnection();
        
        if (testResult.success) {
            appState.apiConnected = true;
            appState.isLiveMode = true;
            
            console.log(`✅ API connected: ${testResult.message}`);
            return true;
        } else {
            throw new Error(testResult.message);
        }
    } catch (error) {
        console.error('Failed to initialize real API:', error);
        throw error;
    }
}

// Enhanced scan function for live data
async function scanForArbitrage() {
    const button = document.getElementById('scanArbitrageButton');
    const icon = button.querySelector('.action-icon');
    const text = button.querySelector('.action-text');
    const originalIconHTML = icon.innerHTML;
    const originalText = text.textContent;
    
    // Update UI to show scanning
    icon.innerHTML = '<div class="loading" style="width: 20px; height: 20px;"></div>';
    text.textContent = appState.isLiveMode ? 'Scanning Live Markets...' : 'Scanning Demo Data...';
    button.disabled = true;
    
    try {
        if (appState.isLiveMode && realOddsService) {
            await scanLiveMarkets();
        } else {
            await scanDemoData();
        }
        
        appState.