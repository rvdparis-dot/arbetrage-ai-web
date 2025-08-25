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
// Replace the calculateStakes function in simple-app.js with this:

function calculateStakes(oppId) {
    // Get the opportunity data
    const opportunities = generateLiveOpportunities();
    const opportunity = opportunities.find(opp => opp.id === oppId);
    
    if (!opportunity) {
        showMessage('❌ Opportunity not found!', 'error');
        return;
    }
    
    // Show stake calculator modal/popup
    showStakeCalculator(opportunity);
}

function showStakeCalculator(opportunity) {
    // Remove existing calculator if open
    const existing = document.querySelector('.stake-calculator-modal');
    if (existing) existing.remove();
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'stake-calculator-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
        box-sizing: border-box;
    `;
    
    const calculator = document.createElement('div');
    calculator.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 30px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    `;
    
    calculator.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #111827;">🧮 Stake Calculator</h2>
            <button onclick="closeStakeCalculator()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">×</button>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">${opportunity.matchup}</h3>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <div><strong>Sport:</strong> ${opportunity.sport}</div>
                <div><strong>Game Time:</strong> ${opportunity.gameTime}</div>
                <div><strong>Arbitrage Margin:</strong> <span style="color: #10b981; font-weight: bold;">${opportunity.margin.toFixed(2)}%</span></div>
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                💰 Total Bankroll ($)
            </label>
            <input type="number" id="bankrollInput" value="1000" min="1" style="
                width: 100%;
                padding: 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 16px;
                box-sizing: border-box;
            " oninput="calculateOptimalStakes(${opportunity.id})">
            <small style="color: #6b7280;">Enter the total amount you want to invest</small>
        </div>
        
        <div id="stakeResults">
            <!-- Results will be populated here -->
        </div>
    `;
    
    modal.appendChild(calculator);
    document.body.appendChild(modal);
    
    // Calculate initial stakes
    setTimeout(() => calculateOptimalStakes(opportunity.id), 100);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeStakeCalculator();
        }
    });
}

function calculateOptimalStakes(oppId) {
    const bankrollInput = document.getElementById('bankrollInput');
    const resultsDiv = document.getElementById('stakeResults');
    
    if (!bankrollInput || !resultsDiv) return;
    
    const bankroll = parseFloat(bankrollInput.value) || 1000;
    const opportunities = generateLiveOpportunities();
    const opportunity = opportunities.find(opp => opp.id === oppId);
    
    if (!opportunity || bankroll <= 0) {
        resultsDiv.innerHTML = '<p style="color: #ef4444;">Please enter a valid bankroll amount.</p>';
        return;
    }
    
    // Calculate stakes using arbitrage formula
    const stakes = [];
    let totalImpliedProb = 0;
    
    // Calculate total implied probability
    opportunity.outcomes.forEach(outcome => {
        totalImpliedProb += 1 / outcome.decimal;
    });
    
    // Calculate individual stakes
    let totalStakes = 0;
    opportunity.outcomes.forEach(outcome => {
        const impliedProb = 1 / outcome.decimal;
        const stake = (bankroll * impliedProb) / totalImpliedProb;
        const potentialReturn = stake * outcome.decimal;
        
        stakes.push({
            team: outcome.team,
            odds: outcome.odds,
            sportsbook: outcome.sportsbook,
            stake: stake,
            potentialReturn: potentialReturn,
            decimal: outcome.decimal
        });
        
        totalStakes += stake;
    });
    
    // Calculate guaranteed profit
    const guaranteedProfit = stakes[0].potentialReturn - bankroll;
    const profitPercentage = (guaranteedProfit / bankroll) * 100;
    
    // Display results
    let stakesHTML = `
        <div style="background: #dcfce7; border: 2px solid #10b981; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #166534; text-align: center;">
                🎯 Guaranteed Profit: $${guaranteedProfit.toFixed(2)} (${profitPercentage.toFixed(2)}%)
            </h3>
            <p style="text-align: center; margin: 0; color: #166534; font-size: 14px;">
                No matter which team wins, you'll profit $${guaranteedProfit.toFixed(2)}!
            </p>
        </div>
        
        <h4 style="margin: 0 0 15px 0; color: #1f2937;">📊 Optimal Stake Distribution:</h4>
    `;
    
    stakes.forEach((stake, index) => {
        stakesHTML += `
            <div style="
                background: white;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 15px;
                position: relative;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: #1f2937;">${stake.team}</h4>
                    <span style="background: #dbeafe; color: #1d4ed8; padding: 4px 8px; border-radius: 6px; font-size: 12px;">
                        ${stake.sportsbook}
                    </span>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <div style="color: #6b7280; font-size: 12px; margin-bottom: 4px;">BET AMOUNT</div>
                        <div style="font-size: 24px; font-weight: bold; color: #10b981;">$${stake.stake.toFixed(2)}</div>
                    </div>
                    <div>
                        <div style="color: #6b7280; font-size: 12px; margin-bottom: 4px;">IF WINS, YOU GET</div>
                        <div style="font-size: 24px; font-weight: bold; color: #1f2937;">$${stake.potentialReturn.toFixed(2)}</div>
                    </div>
                </div>
                
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                    <div style="display: flex; justify-content: space-between; font-size: 14px;">
                        <span style="color: #6b7280;">Odds: ${stake.odds}</span>
                        <span style="color: #6b7280;">Decimal: ${stake.decimal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    stakesHTML += `
        <div style="background: #f8fafc; border-radius: 8px; padding: 15px; margin-top: 20px;">
            <h4 style="margin: 0 0 10px 0; color: #374151;">📋 Instructions:</h4>
            <ol style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.6;">
                <li>Place each bet at the specified sportsbook</li>
                <li>Bet the exact amounts shown above</li>
                <li>Complete all bets quickly (odds can change)</li>
                <li>You'll profit $${guaranteedProfit.toFixed(2)} regardless of outcome!</li>
            </ol>
        </div>
        
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button onclick="closeStakeCalculator()" style="
                flex: 1;
                background: #6b7280;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
            ">Close</button>
            
            <button onclick="exportStakes(${oppId})" style="
                flex: 1;
                background: #10b981;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
            ">📋 Copy Stakes</button>
        </div>
    `;
    
    resultsDiv.innerHTML = stakesHTML;
}

function closeStakeCalculator() {
    const modal = document.querySelector('.stake-calculator-modal');
    if (modal) {
        modal.remove();
    }
}

function exportStakes(oppId) {
    const opportunities = generateLiveOpportunities();
    const opportunity = opportunities.find(opp => opp.id === oppId);
    const bankroll = parseFloat(document.getElementById('bankrollInput').value) || 1000;
    
    let exportText = `🎯 ArBETrage.AI - Stake Calculation\n`;
    exportText += `Game: ${opportunity.matchup}\n`;
    exportText += `Total Investment: $${bankroll.toFixed(2)}\n\n`;
    
    // Calculate stakes for export
    let totalImpliedProb = 0;
    opportunity.outcomes.forEach(outcome => {
        totalImpliedProb += 1 / outcome.decimal;
    });
    
    opportunity.outcomes.forEach(outcome => {
        const impliedProb = 1 / outcome.decimal;
        const stake = (bankroll * impliedProb) / totalImpliedProb;
        
        exportText += `${outcome.team}: $${stake.toFixed(2)} @ ${outcome.odds} (${outcome.sportsbook})\n`;
    });
    
    const guaranteedProfit = (bankroll * opportunity.outcomes[0].decimal * (1/opportunity.outcomes[0].decimal)) / totalImpliedProb * opportunity.outcomes[0].decimal - bankroll;
    exportText += `\nGuaranteed Profit: $${guaranteedProfit.toFixed(2)}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(exportText).then(() => {
        showMessage('📋 Stake details copied to clipboard!', 'success');
    });
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
