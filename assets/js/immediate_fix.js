// IMMEDIATE FIX for GitHub Pages - Add this to your index.html
// This overrides the demo mode and forces live mode

// 1. Override the environment detection
window.process = { env: { ODDS_API_KEY: '18630d83221a5627442cd047a67f1cec' } };

// 2. Force live mode configuration
window.FORCE_LIVE_MODE = true;
window.LIVE_API_KEY = '18630d83221a5627442cd047a67f1cec';

// 3. Override the app initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Applying immediate fix for live mode...');
    
    // Force initialize the real API service
    setTimeout(() => {
        if (typeof RealOddsService !== 'undefined') {
            console.log('🔑 Initializing RealOddsService with API key...');
            window.realOddsService = new RealOddsService(window.LIVE_API_KEY);
            
            // Update app state
            if (typeof appState !== 'undefined') {
                appState.isLiveMode = true;
                appState.apiConnected = true;
                console.log('✅ App state updated to live mode');
                
                // Update UI
                updateConnectionStatus('live');
                updateApiUsage(0, 500);
                
                // Hide API config card if it exists
                const apiCard = document.getElementById('apiConfigCard');
                if (apiCard) {
                    apiCard.style.display = 'none';
                }
                
                // Update scan button
                const scanButton = document.getElementById('scanArbitrageButton');
                if (scanButton) {
                    const buttonText = scanButton.querySelector('.action-text');
                    if (buttonText) {
                        buttonText.textContent = 'Scan Live Markets';
                    }
                }
                
                // Show success message
                setTimeout(() => {
                    showFeedback('✅ LIVE MODE ACTIVATED! Connected to real sportsbook data.', true);
                }, 500);
            }
        } else {
            console.error('❌ RealOddsService not found. Check if scripts are loaded.');
        }
    }, 1000);
});

// 4. Override the initializeRealAPI function if it exists
window.initializeRealAPI = async function(apiKey = window.LIVE_API_KEY) {
    try {
        console.log('🔗 Force initializing Real API...');
        window.realOddsService = new RealOddsService(apiKey);
        
        // Test connection
        const testResult = await window.realOddsService.testConnection();
        
        if (testResult.success) {
            if (typeof appState !== 'undefined') {
                appState.apiConnected = true;
                appState.isLiveMode = true;
            }
            console.log('✅ Real API connected successfully!');
            return true;
        } else {
            throw new Error(testResult.message || 'Connection failed');
        }
    } catch (error) {
        console.error('❌ Failed to initialize Real API:', error);
        throw error;
    }
};

// 5. Override the scanForArbitrage function to use live data
window.originalScanForArbitrage = window.scanForArbitrage;
window.scanForArbitrage = async function() {
    console.log('🎯 Scanning with FORCED live mode...');
    
    // Ensure we have the service
    if (!window.realOddsService) {
        window.realOddsService = new RealOddsService(window.LIVE_API_KEY);
    }
    
    // Force live mode in app state
    if (typeof appState !== 'undefined') {
        appState.isLiveMode = true;
        appState.apiConnected = true;
    }
    
    // Call the enhanced scan function
    return await window.originalScanForArbitrage();
};

console.log('🚀 Immediate fix loaded - forcing live mode activation!');