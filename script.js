// Language translations
const translations = {
    en: {
        // App
        appTitle: "🚗 Ride Profitability Calculator",
        appSubtitle: "Determine if a ride offer is worth accepting",
        
        // Form labels
        offerAmount: "Ride Offer Amount ($):",
        distance: "Distance (km):",
        duration: "Estimated Duration (minutes):",
        trafficLevel: "Traffic Level:",
        operatingCost: "Operating Cost per km ($):",
        operatingCostHelp: "Includes fuel, maintenance, etc.",
        minHourlyRate: "Minimum Acceptable Hourly Rate ($):",
        calculateBtn: "Calculate Profitability",
        
        // Traffic levels
        lightTraffic: "Light Traffic",
        moderateTraffic: "Moderate Traffic",
        heavyTraffic: "Heavy Traffic",
        severeTraffic: "Severe Traffic",
        
        // Results
        analysisResults: "Analysis Results",
        totalOperatingCost: "Total Operating Cost:",
        netProfit: "Net Profit:",
        effectiveHourlyRate: "Effective Hourly Rate:",
        profitPerKm: "Profit per Kilometer:",
        recommendationDefault: "Recommendation will appear here",
        
        // Meter
        poor: "Poor",
        excellent: "Excellent",
        
        // History
        recentCalculations: "Recent Calculations",
        clearHistory: "Clear History",
        
        // Recommendations
        rejectLoseMoney: "❌ REJECT - You will lose money on this ride",
        excellentProfit: "✅ EXCELLENT - Highly profitable ride!",
        fairProfit: "⚠️ FAIR - Meets your minimum requirements",
        poorProfit: "❌ POOR - Below your acceptable hourly rate",
        
        // Reasoning
        reasoningLoseMoney: "The operating costs exceed the offer amount. You would lose money accepting this ride.",
        reasoningBelowRate: "Your effective hourly rate is below your minimum acceptable rate.",
        reasoningGood: "This ride meets or exceeds your profitability criteria with a good hourly rate."
    },
    es: {
        // App
        appTitle: "🚗 Calculadora de Rentabilidad de Viajes",
        appSubtitle: "Determina si vale la pena aceptar una oferta de viaje",
        
        // Form labels
        offerAmount: "Monto de la Oferta ($):",
        distance: "Distancia (km):",
        duration: "Duración Estimada (minutos):",
        trafficLevel: "Nivel de Tráfico:",
        operatingCost: "Costo Operativo por km ($):",
        operatingCostHelp: "Incluye combustible, mantenimiento, etc.",
        minHourlyRate: "Tarifa Horaria Mínima Aceptable ($):",
        calculateBtn: "Calcular Rentabilidad",
        
        // Traffic levels
        lightTraffic: "Tráfico Liviano",
        moderateTraffic: "Tráfico Moderado",
        heavyTraffic: "Tráfico Pesado",
        severeTraffic: "Tráfico Severo",
        
        // Results
        analysisResults: "Resultados del Análisis",
        totalOperatingCost: "Costo Operativo Total:",
        netProfit: "Ganancia Neta:",
        effectiveHourlyRate: "Tarifa Horaria Efectiva:",
        profitPerKm: "Ganancia por Kilómetro:",
        recommendationDefault: "La recomendación aparecerá aquí",
        
        // Meter
        poor: "Pobre",
        excellent: "Excelente",
        
        // History
        recentCalculations: "Cálculos Recientes",
        clearHistory: "Limpiar Historial",
        
        // Recommendations
        rejectLoseMoney: "❌ RECHAZAR - Perderás dinero en este viaje",
        excellentProfit: "✅ EXCELENTE - ¡Viaje muy rentable!",
        fairProfit: "⚠️ ACEPTABLE - Cumple con tus requisitos mínimos",
        poorProfit: "❌ POBRE - Por debajo de tu tarifa horaria aceptable",
        
        // Reasoning
        reasoningLoseMoney: "Los costos operativos superan el monto de la oferta. Perderías dinero aceptando este viaje.",
        reasoningBelowRate: "Tu tarifa horaria efectiva está por debajo de tu tarifa mínima aceptable.",
        reasoningGood: "Este viaje cumple o supera tus criterios de rentabilidad con una buena tarifa horaria."
    }
};

// Language management
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('preferredLanguage') || 'en';
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        this.applyTranslations();
    }

    applyTranslations() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[this.currentLang] && translations[this.currentLang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'OPTION') {
                    element.textContent = translations[this.currentLang][key];
                } else {
                    element.textContent = translations[this.currentLang][key];
                }
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;
    }

    getText(key) {
        return translations[this.currentLang][key] || key;
    }
}

class RideCalculator {
    constructor() {
        this.languageManager = new LanguageManager();
        this.calculationsHistory = JSON.parse(localStorage.getItem('rideCalculations')) || [];
        this.initializeEventListeners();
        this.loadHistory();
        this.initializeLanguage();
    }

    initializeLanguage() {
        // Set initial language
        this.languageManager.applyTranslations();
        
        // Set dropdown to current language
        document.getElementById('languageSelect').value = this.languageManager.currentLang;
    }

    initializeEventListeners() {
        document.getElementById('calculateBtn').addEventListener('click', () => this.calculate());
        document.getElementById('clearHistory').addEventListener('click', () => this.clearHistory());
        
        // Language switcher
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.languageManager.setLanguage(e.target.value);
            this.updateHistoryDisplay(); // Update history in new language
        });
        
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
            alert(this.languageManager.currentLang === 'es' ? 'Por favor ingrese un monto de oferta válido' : 'Please enter a valid offer amount');
            return false;
        }
        if (!distance || distance <= 0) {
            alert(this.languageManager.currentLang === 'es' ? 'Por favor ingrese una distancia válida' : 'Please enter a valid distance');
            return false;
        }
        if (!duration || duration <= 0) {
            alert(this.languageManager.currentLang === 'es' ? 'Por favor ingrese una duración válida' : 'Please enter a valid duration');
            return false;
        }
        return true;
    }

    getRecommendation(hourlyRate, minHourlyRate, netProfit) {
        if (netProfit <= 0) {
            return {
                text: this.languageManager.getText('rejectLoseMoney'),
                class: 'poor',
                score: 0
            };
        }

        if (hourlyRate >= minHourlyRate * 1.5) {
            return {
                text: this.languageManager.getText('excellentProfit'),
                class: 'good',
                score: 100
            };
        } else if (hourlyRate >= minHourlyRate) {
            return {
                text: this.languageManager.getText('fairProfit'),
                class: 'fair',
                score: 60
            };
        } else {
            return {
                text: this.languageManager.getText('poorProfit'),
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
            return this.languageManager.getText('reasoningLoseMoney');
        } else if (results.effectiveHourlyRate < parseFloat(document.getElementById('minHourlyRate').value)) {
            return `${this.languageManager.getText('reasoningBelowRate')} ($${results.effectiveHourlyRate.toFixed(2)})`;
        } else {
            return this.languageManager.getText('reasoningGood');
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
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';

        if (this.calculationsHistory.length === 0) {
            historyList.innerHTML = `<div class="history-item">${this.languageManager.currentLang === 'es' ? 'Aún no hay cálculos' : 'No calculations yet'}</div>`;
            return;
        }

        this.calculationsHistory.forEach(calc => {
            const item = document.createElement('div');
            item.className = `history-item ${calc.recommendation.class}`;
            
            const recommendationText = calc.recommendation.text.split(' - ')[0];
            const statusText = this.languageManager.currentLang === 'es' ? 
                this.getSpanishStatus(recommendationText) : recommendationText;

            item.innerHTML = `
                <strong>$${calc.offerAmount.toFixed(2)}</strong> - 
                ${calc.distance}km - 
                ${calc.effectiveHourlyRate.toFixed(2)}/hr - 
                <span class="${calc.recommendation.class}">${statusText}</span>
                <br><small>${calc.timestamp}</small>
            `;
            historyList.appendChild(item);
        });
    }

    getSpanishStatus(englishStatus) {
        const statusMap = {
            '❌ REJECT': '❌ RECHAZAR',
            '✅ EXCELLENT': '✅ EXCELENTE',
            '⚠️ FAIR': '⚠️ ACEPTABLE',
            '❌ POOR': '❌ POBRE'
        };
        return statusMap[englishStatus] || englishStatus;
    }

    clearHistory() {
        const message = this.languageManager.currentLang === 'es' 
            ? '¿Estás seguro de que quieres limpiar el historial de cálculos?'
            : 'Are you sure you want to clear calculation history?';
            
        if (confirm(message)) {
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