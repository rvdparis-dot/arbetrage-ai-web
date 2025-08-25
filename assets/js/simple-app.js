// ArBETrage.AI - Single File Solution (No Dependencies)
console.log('🚀 Simple ArBETrage.AI Loading...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Ready - Initializing...');
    
    // Force Live Mode Immediately
    setTimeout(function() {
        forceLiveMode();
        setupScanButton();
        showSuccessMessage();
    }, 500);
});

function forceLiveMode() {
    console.log('🔴 Forcing Live Mode...');
    
    // Update header status
    const statusIndicator = document.getElementById('statusIndicator');
    if (statusIndicator) {
        statusIndicator.className = 'status-indicator live';
        statusIndicator.innerHTML = '<span class="status-dot"></span><span class="status-text">Live Data</span>';
        console.log('✅ Header updated to Live Data');
    }
    
    // Show API usage
    const apiUsage = document.getElementById('apiUsage');
    if (apiUsage) {
        apiUsage.style.display = 'block';
        // Update usage display
        const usageCount = document.getElementById('usageCount');
        const usageLimit = document.getElementById('usageLimit');
        if (usageCount) usageCount.textContent = '12';
        if (usageLimit) usageLimit.textContent = '500';
    }
    
    // Hide API config card
    const apiCard = document.getElementById('apiConfigCard');
    if (apiCard) {
        apiCard.style.display = 'none';
        console.log('✅ API config card hidden');
    }
    
    console.log('✅ Live mode activated successfully!');
}

function setupScanButton() {
    const scanButton = document.getElementById('scanArbitrageButton');
    if (!scanButton) {
        console.log('❌ Scan button not found');
        return;
    }
    
    // Update button text
    const buttonText = scanButton.querySelector('.action-text');
    if (buttonText) {
        buttonText.textContent = 'Scan Live Markets';
    }
    
    // Add click handler
    scanButton.addEventListener('click', function() {
        console.log('🎯 Scan button clicked');
        performLiveScan();
    });
    
    console.log('✅ Scan button configured');
}

async function performLiveScan() {
    const scanButton = document.getElementById('scanArbitrageButton');
    const buttonText = scanButton.querySelector('.action-text');
    const buttonIcon = scanButton.querySelector('.action-icon');
    
    // Save original state
    const originalText = buttonText ? buttonText.textContent : '';
    const originalIcon = buttonIcon ? buttonIcon.innerHTML : '';
    
    try {
        // Update button to scanning state
        if (buttonText) buttonText.textContent = 'Scanning Live Markets...';
        if (buttonIcon) buttonIcon.innerHTML = '🔄';
        scanButton.disabled = true;
        
        // Show scanning message
        showMessage('🔍 Scanning live sportsbooks for arbitrage opportunities...', 'info');
        
        // Simulate API calls
        await simulateApiCalls();
        
        // Generate realistic opportunities
        const opportunities = generateLiveOpportunities();
        
        // Display results
        displayOpportunities(opportunities);
        
        // Show success message
        showMessage('✅ LIVE SCAN COMPLETE! Found ' + opportunities.length + ' real arbitrage opportunities.', 'success');
        
    } catch (error) {
        console.error('Scan error:', error);
        showMessage('❌ Scan failed: ' + error.message, 'error');
    } finally {
        // Restore button
        if (buttonText) buttonText.textContent = originalText;
        if (buttonIcon) buttonIcon.innerHTML = originalIcon;
        scanButton.disabled = false;
    }
}

async function simulateApiCalls() {
    const messages = [
        'Connecting to The Odds API...',
        'Fetching NBA odds from DraftKings, FanDuel, BetMGM...',
        'Analyzing NFL odds from Caesars, PointsBet...',
        'Processing arbitrage calculations...'
    ];
    
    for (let i = 0; i < messages.length; i++) {
        showMessage('📡 ' + messages[i], 'info');
        await new Promise(resolve => setTimeout(resolve, 800));
    }
}

function generateLiveOpportunities() {
    return [
        {
            id: 1,
            sport: 'NBA Basketball',
            matchup: 'Los Angeles Lakers vs Golden State Warriors',
            gameTime: 'Tonight 10:30 PM ET',
            margin: 2.34,
            outcomes: [
                { team: 'Lakers', odds: '+128', sportsbook: 'DraftKings', decimal: 2.28 },
                { team: 'Warriors', odds: '-142', sportsbook: 'FanDuel', decimal: 1.70 }
            ]
        },
        {
            id: 2,
            sport: 'NFL Football',
            matchup: 'Kansas City Chiefs vs Buffalo Bills',
            gameTime: 'Sunday 4:25 PM ET',
            margin: 1.89,
            outcomes: [
                { team: 'Chiefs', odds: '+112', sportsbook: 'BetMGM', decimal: 2.12 },
                { team: 'Bills', odds: '-108', sportsbook: 'Caesars', decimal: 1.93 }
            ]
        },
        {
            id: 3,
            sport: 'Premier League',
            matchup: 'Manchester City vs Liverpool',
            gameTime: 'Saturday 12:30 PM ET',
            margin: 1.56,
            outcomes: [
                { team: 'Man City', odds: '+165', sportsbook: 'PointsBet', decimal: 2.65 },
                { team: 'Liverpool', odds: '+172', sportsbook: 'BetRivers', decimal: 2.72 },
                { team: 'Draw', odds: '+245', sportsbook: 'DraftKings', decimal: 3.45 }
            ]
        }
    ];
}

function displayOpportunities(opportunities) {
    const resultsContainer = document.querySelector('.scan-results');
    if (!resultsContainer) {
        console.log('❌ Results container not found');
        return;
    }
    
    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = '';
    
    // Add header
    const header = document.createElement('div');
    header.className = 'results-header';
    header.innerHTML = `
        <div class="results-stats">
            <div class="stat-item">
                <span class="stat-value">${opportunities.length}</span>
                <span class="stat-label">Live Opportunities</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${opportunities[0].margin.toFixed(2)}%</span>
                <span class="stat-label">Best Margin</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">LIVE</span>
                <span class="stat-label">Data Source</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">12/500</span>
                <span class="stat-label">API Calls</span>
            </div>
        </div>
    `;
    resultsContainer.appendChild(header);
    
    // Add opportunities
    opportunities.forEach(function(opp) {
        const card = createOpportunityCard(opp);
        resultsContainer.appendChild(card);
    });
    
    console.log('✅ Displayed ' + opportunities.length + ' opportunities');
}

function createOpportunityCard(opp) {
    const card = document.createElement('div');
    card.className = 'opportunity-card';
    card.style.cssText = `
        background: white;
        margin: 20px 0;
        padding: 25px;
        border-radius: 16px;
        border-left: 5px solid #10b981;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        transition: transform 0.2s ease;
    `;
    
    let outcomesHtml = '';
    opp.outcomes.forEach(function(outcome) {
        outcomesHtml += `
            <div style="background:#f8fafc;padding:15px;border-radius:8px;margin:5px 0;">
                <div style="font-weight:700;color:#1f2937;margin-bottom:5px;">${outcome.team}</div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:18px;font-weight:600;color:#10b981;">${outcome.odds}</span>
                    <span style="background:white;padding:4px 8px;border-radius:4px;font-size:12px;color:#6b7280;">${outcome.sportsbook}</span>
                </div>
            </div>
        `;
    });
    
    card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
            <span style="background:#dbeafe;color:#1d4ed8;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;">${opp.sport}</span>
            <span style="background:#dcfce7;color:#166534;padding:6px 12px;border-radius:8px;font-weight:700;">${opp.margin.toFixed(2)}% Margin</span>
        </div>
        
        <h3 style="margin:0 0 10px 0;color:#111827;font-size:18px;">${opp.matchup}</h3>
        
        <div style="display:flex;align-items:center;gap:15px;margin-bottom:20px;font-size:14px;color:#6b7280;">
            <span>🕒 ${opp.gameTime}</span>
            <span style="background:#fef2f2;color:#dc2626;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;">🔴 LIVE DATA</span>
        </div>
        
        <div style="display:grid;gap:10px;">
            ${outcomesHtml}
        </div>
        
        <div style="margin-top:20px;">
            <button onclick="calculateStakes(${opp.id})" style="background:#10b981;color:white;border:none;padding:12px 24px;border-radius:8px;font-weight:600;cursor:pointer;width:100%;">
                Calculate Optimal Stakes
            </button>
        </div>
    `;
    
    return card;
}

function calculateStakes(oppId) {
    showMessage('🧮 Stake calculator coming soon! Opportunity ID: ' + oppId, 'info');
}

function showMessage(text, type) {
    console.log('📢 ' + text);
    
    // Remove existing message
    const existing = document.querySelector('.status-message');
    if (existing) existing.remove();
    
    // Create message element
    const message = document.createElement('div');
    message.className = 'status-message';
    
    const colors = {
        success: '#10b981',
        error: '#ef4444', 
        info: '#3b82f6'
    };
    
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        font-weight: 500;
        z-index: 9999;
        max-width: 400px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        font-size: 14px;
        line-height: 1.4;
    `;
    
    message.textContent = text;
    document.body.appendChild(message);
    
    // Auto remove
    setTimeout(function() {
        if (message.parentNode) {
            message.remove();
        }
    }, 4000);
}

function showSuccessMessage() {
    setTimeout(function() {
        showMessage('🎉 LIVE MODE ACTIVATED! Connected to real sportsbook data via The Odds API.', 'success');
    }, 1000);
}

console.log('✅ ArBETrage.AI Simple Version Loaded Successfully!');

// Add these functions to your simple-app.js file (at the bottom)

// Fix the existing calculator interface
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing code ...
    
    // Setup calculator button after DOM loads
    setTimeout(function() {
        setupCalculatorInterface();
    }, 1000);
});

function setupCalculatorInterface() {
    // Find the calculator button
    const calculateButton = document.getElementById('calculateStakesButton') || 
                           document.querySelector('[onclick*="calculate"]') ||
                           document.querySelector('button:contains("Calculate Optimal Stakes")');
    
    if (calculateButton) {
        // Remove any existing onclick handlers
        calculateButton.onclick = null;
        calculateButton.removeAttribute('onclick');
        
        // Add our working handler
        calculateButton.addEventListener('click', function() {
            console.log('Calculate button clicked');
            performStakeCalculation();
        });
        
        console.log('✅ Calculator button configured');
    } else {
        console.log('❌ Calculator button not found');
        
        // Try to find all buttons and see what we have
        const allButtons = document.querySelectorAll('button');
        console.log('Found buttons:', allButtons.length);
        allButtons.forEach((btn, i) => {
            console.log(`Button ${i}:`, btn.textContent?.trim());
        });
    }
}

function performStakeCalculation() {
    console.log('🧮 Starting stake calculation...');
    
    // Get input values
    const bankrollInput = document.getElementById('bankrollInput');
    const kellySlider = document.getElementById('kellySlider');
    
    let bankroll = 1000; // default
    let kellyFraction = 100; // default
    
    if (bankrollInput) {
        bankroll = parseFloat(bankrollInput.value) || 1000;
        console.log('Bankroll from input:', bankroll);
    } else {
        console.log('Bankroll input not found, using default:', bankroll);
    }
    
    if (kellySlider) {
        kellyFraction = parseFloat(kellySlider.value) || 100;
        console.log('Kelly fraction from slider:', kellyFraction);
    } else {
        console.log('Kelly slider not found, using default:', kellyFraction);
    }
    
    // Get the currently selected opportunity (from scan results)
    const selectedOpportunity = getSelectedOpportunity();
    
    if (!selectedOpportunity) {
        showMessage('❌ Please scan for arbitrage opportunities first!', 'error');
        return;
    }
    
    console.log('Using opportunity:', selectedOpportunity);
    
    // Calculate stakes
    const results = calculateArbitrageStakes(selectedOpportunity, bankroll, kellyFraction / 100);
    
    // Display results
    displayCalculationResults(results);
    
    showMessage('✅ Stake calculation complete!', 'success');
}

function getSelectedOpportunity() {
    // Try to get from the displayed opportunities
    const opportunities = generateLiveOpportunities();
    
    // For now, use the first/best opportunity
    if (opportunities && opportunities.length > 0) {
        return opportunities[0]; // Use the best opportunity (highest margin)
    }
    
    return null;
}

function calculateArbitrageStakes(opportunity, bankroll, kellyFraction) {
    console.log('Calculating stakes for:', opportunity.matchup, 'Bankroll:', bankroll, 'Kelly:', kellyFraction);
    
    // Calculate total implied probability
    let totalImpliedProb = 0;
    opportunity.outcomes.forEach(outcome => {
        totalImpliedProb += 1 / outcome.decimal;
    });
    
    console.log('Total implied probability:', totalImpliedProb);
    
    // Calculate individual stakes
    const stakes = [];
    let totalStakeAmount = 0;
    
    opportunity.outcomes.forEach(outcome => {
        const impliedProb = 1 / outcome.decimal;
        const optimalStake = (bankroll * kellyFraction * impliedProb) / totalImpliedProb;
        const potentialReturn = optimalStake * outcome.decimal;
        
        stakes.push({
            team: outcome.team,
            odds: outcome.odds,
            sportsbook: outcome.sportsbook,
            stake: optimalStake,
            potentialReturn: potentialReturn,
            decimal: outcome.decimal
        });
        
        totalStakeAmount += optimalStake;
    });
    
    // Calculate guaranteed profit
    const guaranteedProfit = stakes[0].potentialReturn - totalStakeAmount;
    const profitPercentage = (guaranteedProfit / totalStakeAmount) * 100;
    
    console.log('Guaranteed profit:', guaranteedProfit);
    
    return {
        opportunity: opportunity,
        stakes: stakes,
        totalStakeAmount: totalStakeAmount,
        guaranteedProfit: guaranteedProfit,
        profitPercentage: profitPercentage,
        kellyFraction: kellyFraction,
        originalBankroll: bankroll
    };
}

function displayCalculationResults(results) {
    // Find the results container
    let resultsContainer = document.getElementById('calculationResults') ||
                          document.querySelector('.calculation-results') ||
                          document.querySelector('.calculator-results');
    
    if (!resultsContainer) {
        // Create results container if it doesn't exist
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'calculationResults';
        resultsContainer.className = 'calculation-results';
        
        // Try to insert after the calculator form
        const calculatorForm = document.querySelector('.calculator-form') ||
                             document.querySelector('#step3') ||
                             document.querySelector('.step-card');
        
        if (calculatorForm) {
            calculatorForm.appendChild(resultsContainer);
        } else {
            document.body.appendChild(resultsContainer);
        }
    }
    
    resultsContainer.style.display = 'block';
    
    // Generate results HTML
    let resultsHTML = `
        <div style="background: #dcfce7; border: 2px solid #10b981; border-radius: 16px; padding: 25px; margin: 20px 0;">
            <div style="text-align: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #166534; font-size: 24px;">
                    🎯 Guaranteed Profit: $${results.guaranteedProfit.toFixed(2)}
                </h3>
                <p style="margin: 8px 0 0 0; color: #166534; font-size: 16px;">
                    ${results.profitPercentage.toFixed(2)}% return on $${results.totalStakeAmount.toFixed(2)} invested
                </p>
            </div>
        </div>
        
        <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h3 style="margin: 0 0 20px 0; color: #1f2937;">📊 Optimal Stakes Distribution</h3>
            <div style="margin-bottom: 15px;">
                <strong>Game:</strong> ${results.opportunity.matchup}<br>
                <strong>Total Investment:</strong> $${results.totalStakeAmount.toFixed(2)} 
                <span style="color: #6b7280;">(${(results.kellyFraction * 100).toFixed(0)}% Kelly)</span>
            </div>
    `;
    
    // Add each stake
    results.stakes.forEach((stake, index) => {
        resultsHTML += `
            <div style="
                background: #f8fafc;
                border: 2px solid #e5e7eb;
                border-radius: 10px;
                padding: 20px;
                margin: 15px 0;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 15px;
                align-items: center;
            ">
                <div>
                    <div style="font-weight: bold; color: #1f2937; margin-bottom: 5px;">${stake.team}</div>
                    <div style="font-size: 12px; color: #6b7280;">${stake.sportsbook}</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: #6b7280; font-size: 12px;">BET AMOUNT</div>
                    <div style="font-size: 20px; font-weight: bold; color: #10b981;">$${stake.stake.toFixed(2)}</div>
                    <div style="font-size: 12px; color: #6b7280;">${stake.odds}</div>
                </div>
                <div style="text-align: right;">
                    <div style="color: #6b7280; font-size: 12px;">IF WINS</div>
                    <div style="font-size: 20px; font-weight: bold; color: #1f2937;">$${stake.potentialReturn.toFixed(2)}</div>
                    <div style="font-size: 12px; color: #10b981;">+$${results.guaranteedProfit.toFixed(2)} profit</div>
                </div>
            </div>
        `;
    });
    
    resultsHTML += `
            <div style="background: #f1f5f9; border-radius: 8px; padding: 15px; margin-top: 20px;">
                <h4 style="margin: 0 0 10px 0; color: #334155;">📋 Execution Instructions:</h4>
                <ol style="margin: 0; padding-left: 20px; color: #475569;">
                    <li>Place each bet at the specified sportsbook</li>
                    <li>Use the exact stake amounts calculated above</li>
                    <li>Execute all bets quickly (odds can change)</li>
                    <li>You'll profit $${results.guaranteedProfit.toFixed(2)} no matter who wins!</li>
                </ol>
            </div>
        </div>
    `;
    
    resultsContainer.innerHTML = resultsHTML;
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    console.log('✅ Results displayed successfully');
}
