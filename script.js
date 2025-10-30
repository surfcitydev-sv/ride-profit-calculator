// Language translations
const translations = {
    en: {
        appTitle: "🚗 Ride Profitability Calculator",
        appSubtitle: "Determine if a ride offer is worth accepting",
        offerAmount: "Ride Offer Amount ($):",
        distance: "Distance (km):",
        duration: "Estimated Duration (minutes):",
        trafficLevel: "Traffic Level:",
        operatingCost: "Operating Cost per km ($):",
        operatingCostHelp: "Includes fuel, maintenance, etc.",
        minHourlyRate: "Minimum Acceptable Hourly Rate ($):",
        calculateBtn: "Calculate Profitability",
        appFeePercentage: "inDriver App Fee (%):",
        appFeeHelp: "Platform commission fee",
        lightTraffic: "Light Traffic",
        moderateTraffic: "Moderate Traffic",
        heavyTraffic: "Heavy Traffic",
        severeTraffic: "Severe Traffic",
        analysisResults: "Analysis Results",
        totalOperatingCost: "Total Operating Cost:",
        netProfit: "Net Profit:",
        effectiveHourlyRate: "Effective Hourly Rate:",
        profitPerKm: "Profit per Kilometer:",
        appFeeAmount: "App Fee Amount:",
        earningsAfterFee: "Earnings After Fee:",
        recommendationDefault: "Recommendation will appear here",
        poor: "Poor",
        excellent: "Excellent",
        recentCalculations: "Recent Calculations",
        clearHistory: "Clear History",
        rejectLoseMoney: "❌ REJECT - You will lose money on this ride",
        excellentProfit: "✅ EXCELLENT - Highly profitable ride!",
        fairProfit: "⚠️ FAIR - Meets your minimum requirements",
        poorProfit: "❌ POOR - Below your acceptable hourly rate",
        reasoningLoseMoney: "The operating costs and app fee exceed the offer amount. You would lose money accepting this ride.",
        reasoningBelowRate: "Your effective hourly rate after fees is below your minimum acceptable rate.",
        reasoningGood: "This ride meets or exceeds your profitability criteria after accounting for all fees."
    },
    es: {
        appTitle: "🚗 Calculadora de Rentabilidad de Viajes",
        appSubtitle: "Determina si vale la pena aceptar una oferta de viaje",
        offerAmount: "Monto de la Oferta ($):",
        distance: "Distancia (km):",
        duration: "Duración Estimada (minutos):",
        trafficLevel: "Nivel de Tráfico:",
        operatingCost: "Costo Operativo por km ($):",
        operatingCostHelp: "Incluye combustible, mantenimiento, etc.",
        minHourlyRate: "Tarifa Horaria Mínima Aceptable ($):",
        calculateBtn: "Calcular Rentabilidad",
        appFeePercentage: "Tarifa de inDriver (%):",
        appFeeHelp: "Comisión de la plataforma",
        lightTraffic: "Tráfico Liviano",
        moderateTraffic: "Tráfico Moderado",
        heavyTraffic: "Tráfico Pesado",
        severeTraffic: "Tráfico Severo",
        analysisResults: "Resultados del Análisis",
        totalOperatingCost: "Costo Operativo Total:",
        netProfit: "Ganancia Neta:",
        effectiveHourlyRate: "Tarifa Horaria Efectiva:",
        profitPerKm: "Ganancia por Kilómetro:",
        appFeeAmount: "Monto de la Tarifa:",
        earningsAfterFee: "Ganancias Después de Tarifa:",
        recommendationDefault: "La recomendación aparecerá aquí",
        poor: "Pobre",
        excellent: "Excelente",
        recentCalculations: "Cálculos Recientes",
        clearHistory: "Limpiar Historial",
        rejectLoseMoney: "❌ RECHAZAR - Perderás dinero en este viaje",
        excellentProfit: "✅ EXCELENTE - ¡Viaje muy rentable!",
        fairProfit: "⚠️ ACEPTABLE - Cumple con tus requisitos mínimos",
        poorProfit: "❌ POBRE - Por debajo de tu tarifa horaria aceptable",
        reasoningLoseMoney: "Los costos operativos y la tarifa de la aplicación superan el monto de la oferta. Perderías dinero aceptando este viaje.",
        reasoningBelowRate: "Tu tarifa horaria efectiva después de las tarifas está por debajo de tu tarifa mínima aceptable.",
        reasoningGood: "Este viaje cumple o supera tus criterios de rentabilidad después de contabilizar todas las tarifas."
    }
};

// Simple language manager
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
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[this.currentLang] && translations[this.currentLang][key]) {
                element.textContent = translations[this.currentLang][key];
            }
        });
        document.documentElement.lang = this.currentLang;
    }

    getText(key) {
        return translations[this.currentLang][key] || key;
    }
}

// Main calculator class
class RideCalculator {
    constructor() {
        this.languageManager = new LanguageManager();
        this.calculationsHistory = JSON.parse(localStorage.getItem('rideCalculations')) || [];
        this.initializeEventListeners();
        this.loadHistory();
        this.initializeLanguage();
        console.log('RideCalculator initialized'); // Debug log
    }

    initializeLanguage() {
        this.languageManager.applyTranslations();
        document.getElementById('languageSelect').value = this.languageManager.currentLang;
    }

    initializeEventListeners() {
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculate());
            console.log('Calculate button event listener added'); // Debug log
        } else {
            console.error('Calculate button not found!'); // Debug log
        }

        const clearHistoryBtn = document.getElementById('clearHistory');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        }

        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.languageManager.setLanguage(e.target.value);
                this.updateHistoryDisplay();
            });
        }

        // Input validation
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
        console.log('Calculate function called'); // Debug log
        
        // Get input values with safe parsing
        const offerAmount = parseFloat(document.getElementById('offerAmount').value) || 0;
        const distance = parseFloat(document.getElementById('distance').value) || 0;
        const duration = parseFloat(document.getElementById('duration').value) || 0;
        const trafficLevel = parseFloat(document.getElementById('trafficLevel').value) || 1.2;
        const operatingCost = parseFloat(document.getElementById('operatingCost').value) || 0.30;
        const minHourlyRate = parseFloat(document.getElementById('minHourlyRate').value) || 20.00;
        const appFeePercentage = parseFloat(document.getElementById('appFeePercentage').value) || 12.99;

        console.log('Input values:', { offerAmount, distance, duration, trafficLevel, operatingCost, minHourlyRate, appFeePercentage }); // Debug log

        // Validate inputs
        if (!this.validateInputs(offerAmount, distance, duration, appFeePercentage)) {
            return;
        }

        // Calculate app fee and adjusted offer
        const appFeeAmount = offerAmount * (appFeePercentage / 100);
        const earningsAfterFee = offerAmount - appFeeAmount;

        // Adjust duration for traffic
        const adjustedDuration = duration * trafficLevel;

        // Calculate costs and profits
        const totalOperatingCost = distance * operatingCost;
        const netProfit = earningsAfterFee - totalOperatingCost;
        const effectiveHourlyRate = adjustedDuration > 0 ? (netProfit / adjustedDuration) * 60 : 0;
        const profitPerKm = distance > 0 ? netProfit / distance : 0;

        console.log('Calculation results:', { 
            appFeeAmount, earningsAfterFee, totalOperatingCost, netProfit, effectiveHourlyRate, profitPerKm 
        }); // Debug log

        // Determine recommendation
        const recommendation = this.getRecommendation(effectiveHourlyRate, minHourlyRate, netProfit);
        
        // Display results
        this.displayResults({
            totalOperatingCost,
            netProfit,
            effectiveHourlyRate,
            profitPerKm,
            recommendation,
            adjustedDuration,
            appFeeAmount,
            earningsAfterFee,
            originalOffer: offerAmount
        });

        // Save to history
        this.saveToHistory({
            offerAmount,
            distance,
            duration: adjustedDuration,
            netProfit,
            effectiveHourlyRate,
            recommendation,
            appFeeAmount,
            earningsAfterFee,
            timestamp: new Date().toLocaleString()
        });
    }

    validateInputs(offerAmount, distance, duration, appFeePercentage) {
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
        if (appFeePercentage < 0 || appFeePercentage > 100) {
            alert(this.languageManager.currentLang === 'es' ? 'Por favor ingrese un porcentaje de tarifa válido (0-100%)' : 'Please enter a valid fee percentage (0-100%)');
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
        console.log('Displaying results:', results); // Debug log
        
        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.classList.remove('hidden');
        }

        // Update basic values
        this.updateElementText('totalCost', `$${results.totalOperatingCost.toFixed(2)}`);
        this.updateElementText('netProfit', `$${results.netProfit.toFixed(2)}`);
        this.updateElementText('hourlyRate', `$${results.effectiveHourlyRate.toFixed(2)}/hr`);
        this.updateElementText('profitPerKm', `$${results.profitPerKm.toFixed(2)}/km`);

        // Update recommendation
        const recommendationText = document.getElementById('recommendationText');
        const reasoningText = document.getElementById('reasoningText');
        
        if (recommendationText) {
            recommendationText.textContent = results.recommendation.text;
            recommendationText.className = results.recommendation.class;
        }
        
        if (reasoningText) {
            reasoningText.textContent = this.getReasoning(results);
        }

        // Update meter
        const meterFill = document.getElementById('meterFill');
        if (meterFill) {
            meterFill.style.width = `${results.recommendation.score}%`;
        }

        // Add app fee information
        this.displayAppFeeResults(results);
    }

    updateElementText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }

    displayAppFeeResults(results) {
        // Create or update app fee result items
        this.createResultItem('appFeeItem', 'appFeeAmount', `-$${results.appFeeAmount.toFixed(2)}`, 'appFeeAmount');
        this.createResultItem('earningsAfterFeeItem', 'earningsAfterFee', `$${results.earningsAfterFee.toFixed(2)}`, 'earningsAfterFee');
    }

    createResultItem(itemId, valueId, valueText, translationKey) {
        let item = document.getElementById(itemId);
        
        if (!item) {
            item = document.createElement('div');
            item.id = itemId;
            item.className = 'result-item';
            
            const labelSpan = document.createElement('span');
            labelSpan.className = 'label';
            labelSpan.setAttribute('data-i18n', translationKey);
            labelSpan.textContent = this.languageManager.getText(translationKey);
            
            const valueSpan = document.createElement('span');
            valueSpan.className = 'value';
            valueSpan.id = valueId;
            
            item.appendChild(labelSpan);
            item.appendChild(valueSpan);
            
            // Insert after total operating cost
            const totalCostItem = document.getElementById('totalCost').closest('.result-item');
            if (totalCostItem && totalCostItem.parentNode) {
                totalCostItem.parentNode.insertBefore(item, totalCostItem.nextSibling);
            }
        }

        // Update value
        this.updateElementText(valueId, valueText);
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
        if (!historyList) return;

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
    console.log('DOM loaded, initializing calculator...'); // Debug log
    new RideCalculator();
});