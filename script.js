class RideCalculator {
    constructor() {
        this.calculationsHistory = JSON.parse(localStorage.getItem('rideCalculations')) || [];
        this.initializeEventListeners();
        this.loadHistory();
    }

    initializeEventListeners() {
        document.getElementById('calculateBtn').addEventListener('click', () => this.calculate());
        document.getElementById('clearHistory').addEventListener('click', () => this.clearHistory());
        
        // Add input validation
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
        });
    }

    validateInput(input) {
        if (input.value < 0) {
            input.value = 0;
        }
    }

    calculate() {
        // Get input values
        const offerAmount = parseFloat(document.getElementById('offerAmount').value);
        const distance = parseFloat(document.getElementById('distance').value);
        const duration = parseFloat(document.getElementById('duration').value);
        const trafficLevel = parseFloat(document.getElementById('trafficLevel').value);
        const operatingCost = parseFloat(document.getElementById('operatingCost').value);
        const minHourlyRate = parseFloat(document.getElementById('minHourlyRate').value);

        // Validate inputs
        if (!this.validateInputs(offerAmount, distance, duration)) {
            return;
        }

        // Adjust duration for traffic
        const adjustedDuration = duration * trafficLevel;

        // Calculate costs and profits
        const totalOperatingCost = distance * operatingCost;
        const netProfit = offerAmount - totalOperatingCost;
        const effectiveHourlyRate = (netProfit / adjustedDuration) * 60;
        const profitPerKm = netProfit / distance;

        // Determine recommendation
        const recommendation = this.getRecommendation(effectiveHourlyRate, minHourlyRate, netProfit);
        
        // Display results
        this.displayResults({
            totalOperatingCost,
            netProfit,
            effectiveHourlyRate,
            profitPerKm,
            recommendation,
            adjustedDuration
        });

        // Save to history
        this.saveToHistory({
            offerAmount,
            distance,
            duration: adjustedDuration,
            netProfit,
            effectiveHourlyRate,
            recommendation,
            timestamp: new Date().toLocaleString()
        });
    }

    validateInputs(offerAmount, distance, duration) {
        if (!offerAmount || offerAmount <= 0) {
            alert('Please enter a valid offer amount');
            return false;
        }
        if (!distance || distance <= 0) {
            alert('Please enter a valid distance');
            return false;
        }
        if (!duration || duration <= 0) {
            alert('Please enter a valid duration');
            return false;
        }
        return true;
    }

    getRecommendation(hourlyRate, minHourlyRate, netProfit) {
        if (netProfit <= 0) {
            return {
                text: '❌ REJECT - You will lose money on this ride',
                class: 'poor',
                score: 0
            };
        }

        if (hourlyRate >= minHourlyRate * 1.5) {
            return {
                text: '✅ EXCELLENT - Highly profitable ride!',
                class: 'good',
                score: 100
            };
        } else if (hourlyRate >= minHourlyRate) {
            return {
                text: '⚠️ FAIR - Meets your minimum requirements',
                class: 'fair',
                score: 60
            };
        } else {
            return {
                text: '❌ POOR - Below your acceptable hourly rate',
                class: 'poor',
                score: 20
            };
        }
    }

    displayResults(results) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.classList.remove('hidden');

        // Update values
        document.getElementById('totalCost').textContent = `$${results.totalOperatingCost.toFixed(2)}`;
        document.getElementById('netProfit').textContent = `$${results.netProfit.toFixed(2)}`;
        document.getElementById('hourlyRate').textContent = `$${results.effectiveHourlyRate.toFixed(2)}/hr`;
        document.getElementById('profitPerKm').textContent = `$${results.profitPerKm.toFixed(2)}/km`;

        // Update recommendation
        const recommendationText = document.getElementById('recommendationText');
        const reasoningText = document.getElementById('reasoningText');
        
        recommendationText.textContent = results.recommendation.text;
        recommendationText.className = results.recommendation.class;

        // Add reasoning
        reasoningText.textContent = this.getReasoning(results);

        // Update meter
        document.getElementById('meterFill').style.width = `${results.recommendation.score}%`;
    }

    getReasoning(results) {
        if (results.netProfit <= 0) {
            return "The operating costs exceed the offer amount. You would lose money accepting this ride.";
        } else if (results.effectiveHourlyRate < parseFloat(document.getElementById('minHourlyRate').value)) {
            return `Your effective hourly rate ($${results.effectiveHourlyRate.toFixed(2)}) is below your minimum acceptable rate.`;
        } else {
            return `This ride meets or exceeds your profitability criteria with a good hourly rate.`;
        }
    }

    saveToHistory(calculation) {
        this.calculationsHistory.unshift(calculation);
        if (this.calculationsHistory.length > 10) {
            this.calculationsHistory = this.calculationsHistory.slice(0, 10);
        }
        localStorage.setItem('rideCalculations', JSON.stringify(this.calculationsHistory));
        this.loadHistory();
    }

    loadHistory() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';

        if (this.calculationsHistory.length === 0) {
            historyList.innerHTML = '<div class="history-item">No calculations yet</div>';
            return;
        }

        this.calculationsHistory.forEach(calc => {
            const item = document.createElement('div');
            item.className = `history-item ${calc.recommendation.class}`;
            item.innerHTML = `
                <strong>$${calc.offerAmount.toFixed(2)}</strong> - 
                ${calc.distance}km - 
                ${calc.effectiveHourlyRate.toFixed(2)}/hr - 
                <span class="${calc.recommendation.class}">${calc.recommendation.text.split(' - ')[0]}</span>
                <br><small>${calc.timestamp}</small>
            `;
            historyList.appendChild(item);
        });
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear calculation history?')) {
            this.calculationsHistory = [];
            localStorage.removeItem('rideCalculations');
            this.loadHistory();
        }
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RideCalculator();
});