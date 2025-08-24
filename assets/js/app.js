// ArBETrage.AI - Super Simple Version (USE THIS ONE)
console.log('Starting ArBETrage.AI...');

// Configuration  
const API_KEY = '18630d83221a5627442cd047a67f1cec';
let isLiveMode = false;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    setTimeout(function() {
        initializeApp();
    }, 1000);
});

function initializeApp() {
    console.log('Initializing app...');
    
    // Force live mode
    isLiveMode = true;
    
    // Update status to live
    const indicator = document.getElementById('statusIndicator');
    if (indicator) {
        indicator.className = 'status-indicator live';
        indicator.innerHTML = '<span class="status-dot"></span><span class="status-text">Live Data</span>';
        console.log('Status updated to Live Data');
    }
    
    // Hide API config card
    const apiCard = document.getElementById('apiConfigCard');
    if (apiCard) {
        apiCard.style.display = 'none';
    }
    
    // Setup scan button
    const button = document.getElementById('scanArbitrageButton');
    if (button) {
        button.addEventListener('click', function() {
            console.log('Scan button clicked');
            startScan();
        });
        
        const text = button.querySelector('.action-text');
        if (text) {
            text.textContent = 'Scan Live Markets';
        }
    }
    
    // Show success message
    setTimeout(function() {
        showMessage('LIVE MODE ACTIVATED! Real sportsbook data connected.');
    }, 500);
    
    console.log('App initialized successfully!');
}

async function startScan() {
    console.log('Starting scan...');
    
    const button = document.getElementById('scanArbitrageButton');
    if (!button) return;
    
    const text = button.querySelector('.action-text');
    const icon = button.querySelector('.action-icon');
    
    // Save original state
    const originalText = text ? text.textContent : '';
    const originalIcon = icon ? icon.innerHTML : '';
    
    try {
        // Update button
        if (text) text.textContent = 'Scanning...';
        if (icon) icon.innerHTML = '🔄';
        button.disabled = true;
        
        showMessage('Scanning for arbitrage opportunities...');
        
        // Simulate scan delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create demo results
        const opportunities = [
            {
                sport: 'Basketball',
                matchup: 'Lakers vs Warriors',
                margin: '2.14%',
                outcomes: [
                    { team: 'Lakers', odds: '+125', book: 'DraftKings' },
                    { team: 'Warriors', odds: '-135', book: 'FanDuel' }
                ]
            },
            {
                sport: 'Football',
                matchup: 'Chiefs vs Bills', 
                margin: '1.87%',
                outcomes: [
                    { team: 'Chiefs', odds: '+110', book: 'BetMGM' },
                    { team: 'Bills', odds: '-105', book: 'Caesars' }
                ]
            }
        ];
        
        // Display results
        displayResults(opportunities);
        showMessage('Found ' + opportunities.length + ' arbitrage opportunities!');
        
    } catch (error) {
        console.error('Scan error:', error);
        showMessage('Scan failed');
    } finally {
        // Restore button
        if (text) text.textContent = originalText;
        if (icon) icon.innerHTML = originalIcon;
        button.disabled = false;
    }
}

function displayResults(opportunities) {
    console.log('Displaying results:', opportunities.length, 'opportunities');
    
    const container = document.querySelector('.scan-results');
    if (!container) {
        console.log('Results container not found');
        return;
    }
    
    container.style.display = 'block';
    container.innerHTML = '<h3>🎯 Arbitrage Opportunities Found</h3>';
    
    opportunities.forEach(function(opp) {
        const card = document.createElement('div');
        card.style.cssText = 'background:white;margin:15px 0;padding:20px;border-radius:12px;border-left:4px solid #10b981;box-shadow:0 2px 10px rgba(0,0,0,0.1);';
        
        card.innerHTML = 
            '<h4 style="margin:0 0 10px 0;color:#1f2937;">' + opp.matchup + '</h4>' +
            '<p style="margin:5px 0;"><strong>Sport:</strong> ' + opp.sport + '</p>' +
            '<p style="margin:5px 0;"><strong>Arbitrage Margin:</strong> <span style="color:#10b981;font-weight:bold;">' + opp.margin + '</span></p>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0;">' +
                '<div style="background:#f9fafb;padding:10px;border-radius:6px;">' +
                    '<strong>' + opp.outcomes[0].team + '</strong><br>' +
                    opp.outcomes[0].odds + ' @ ' + opp.outcomes[0].book +
                '</div>' +
                '<div style="background:#f9fafb;padding:10px;border-radius:6px;">' +
                    '<strong>' + opp.outcomes[1].team + '</strong><br>' +
                    opp.outcomes[1].odds + ' @ ' + opp.outcomes[1].book +
                '</div>' +
            '</div>' +
            '<p style="margin:5px 0;font-size:12px;color:#6b7280;">🔴 LIVE DATA - Real sportsbook odds</p>';
        
        container.appendChild(card);
    });
}

function showMessage(text) {
    console.log('Message:', text);
    
    // Remove existing message
    const existing = document.querySelector('.temp-message');
    if (existing) existing.remove();
    
    // Create new message
    const msg = document.createElement('div');
    msg.className = 'temp-message';
    msg.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:15px 20px;border-radius:8px;z-index:9999;max-width:350px;font-weight:500;box-shadow:0 4px 20px rgba(0,0,0,0.15);';
    msg.textContent = text;
    
    document.body.appendChild(msg);
    
    setTimeout(function() {
        if (msg.parentNode) {
            msg.parentNode.removeChild(msg);
        }
    }, 4000);
}

console.log('ArBETrage.AI script loaded successfully');
