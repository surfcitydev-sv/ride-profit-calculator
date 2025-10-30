// Language translations
const translations = {
    en: {
        appTitle: "🚗 Earnings Calculator",
        appSubtitle: "For Uber and inDriver drivers in El Salvador",
        platform: "Platform:",
        indrive: "inDriver",
        uber: "Uber", 
        custom: "Other Platform",
        offerAmount: "Offer Amount ($):",
        distance: "Distance (km):",
        duration: "Estimated Time (minutes):",
        trafficLevel: "Traffic Level:",
        operatingCost: "Cost per km ($):",
        operatingCostHelp: "Includes gas, maintenance, insurance",
        minHourlyRate: "Minimum Hourly Rate ($):",
        calculateBtn: "Calculate Profitability",
        appFeePercentage: "Platform Commission (%):",
        indriveFee: "inDriver standard commission: 12.99%",
        uberFee: "Uber service fee: ~25%",
        customFee: "Set your custom platform fee",
        lightTraffic: "Light Traffic",
        moderateTraffic: "Moderate Traffic", 
        heavyTraffic: "Heavy Traffic",
        severeTraffic: "Severe Traffic",
        analysisResults: "Analysis Results",
        totalOperatingCost: "Total Operating Cost:",
        earningsAfterFee: "Earnings After Commission:",
        netProfit: "Net Profit:",
        effectiveHourlyRate: "Effective Hourly Rate:",
        profitPerKm: "Profit per Kilometer:",
        recommendationDefault: "Recommendation will appear here",
        poor: "Poor",
        excellent: "Excellent",
        recentCalculations: "Recent Calculations", 
        clearHistory: "Clear History",
        rejectLoseMoney: "❌ REJECT - You will lose money on this ride",
        excellentProfit: "✅ EXCELLENT - Highly profitable ride!",
        fairProfit: "⚠️ FAIR - Meets your minimum requirements", 
        poorProfit: "❌ POOR - Below your acceptable hourly rate",
        reasoningLoseMoney: "Operating costs and platform fee exceed the offer amount.",
        reasoningBelowRate: "Your effective hourly rate is below your minimum acceptable rate.",
        reasoningGood: "This ride meets or exceeds your profitability criteria."
    },
    es: {
        appTitle: "🚗 Calculadora de Ganancias",
        appSubtitle: "Para conductores de Uber e inDriver en El Salvador",
        platform: "Plataforma:",
        indrive: "inDriver",
        uber: "Uber",
        custom: "Otra Plataforma", 
        offerAmount: "Monto de la Oferta ($):",
        distance: "Distancia (km):",
        duration: "Tiempo Estimado (minutos):",
        trafficLevel: "Nivel de Tráfico:",
        operatingCost: "Costo por km ($):",
        operatingCostHelp: "Incluye gasolina, mantenimiento, seguro",
        minHourlyRate: "Tarifa Horaria Mínima ($):",
        calculateBtn: "Calcular Rentabilidad",
        appFeePercentage: "Comisión de Plataforma (%):",
        indriveFee: "Comisión estándar de inDriver: 12.99%",
        uberFee: "Tarifa de servicio de Uber: ~25%",
        customFee: "Establece tu tarifa personalizada",
        lightTraffic: "Tráfico Liviano",
        moderateTraffic: "Tráfico Moderado",
        heavyTraffic: "Tráfico Pesado", 
        severeTraffic: "Tráfico Severo",
        analysisResults: "Resultados del Análisis",
        totalOperatingCost: "Costo Operativo Total:",
        earningsAfterFee: "Ganancias Después de Comisión:",
        netProfit: "Ganancia Neta:",
        effectiveHourlyRate: "Tarifa Horaria Efectiva:",
        profitPerKm: "Ganancia por Kilómetro:",
        recommendationDefault: "La recomendación aparecerá aquí",
        poor: "Pobre",
        excellent: "Excelente",
        recentCalculations: "Cálculos Recientes",
        clearHistory: "Limpiar Historial",
        rejectLoseMoney: "❌ RECHAZAR - Perderás dinero en este viaje",
        excellentProfit: "✅ EXCELENTE - ¡Viaje muy rentable!",
        fairProfit: "⚠️ ACEPTABLE - Cumple con tus requisitos mínimos",
        poorProfit: "❌ POBRE - Por debajo de tu tarifa horaria aceptable", 
        reasoningLoseMoney: "Los costos operativos y la comisión superan el monto de la oferta.",
        reasoningBelowRate: "Tu tarifa horaria efectiva está por debajo de tu tarifa mínima aceptable.",
        reasoningGood: "Este viaje cumple o supera tus criterios de rentabilidad."
    }
};

// Platform fee data for El Salvador
const platformFees = {
    indrive: { fee: 12.99, description: 'indriveFee' },
    uber: { fee: 25.00, description: 'uberFee' },
    custom: { fee: 12.99, description: 'customFee' }
};

// Language manager
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('preferredLanguage') || 'es';
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
    }

    initializeLanguage() {
        this.languageManager.applyTranslations();
        document.getElementById('languageSelect').value = this.languageManager.currentLang;
    }

    initializePlatformListener() {
        const platformSelect = document.getElementById('platform');
        const feeInput = document.getElementById('appFeePercentage');
        const feeDescription = document.getElementById('feeDescription');
        
        if (platformSelect) {
            platformSelect.addEventListener('change', (e) => {
                const platform = e.target.value;
                const platformData = platformFees[platform];
                
                if (platformData) {
                    feeInput.value = platformData.fee;
                    feeDescription.textContent = this.languageManager.getText(platformData.description);
                    feeDescription.setAttribute('data-i18n', platformData.description);
                }
            });
        }
    }

    initializeEventListeners() {
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculate());
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

        this.initializePlatformListener();

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
        const offerAmount = parseFloat(document.getElementById('offerAmount').value) || 0;
        const distance = parseFloat(document.getElementById('distance').value) || 0;
        const duration = parseFloat(document.getElementById('duration').value) || 0;
        const trafficLevel = parseFloat(document.getElementById('trafficLevel').value) || 1.2;
        const operatingCost = parseFloat(document.getElementById('operatingCost').value) || 0.45;
        const minHourlyRate = parseFloat(document.getElementById('minHourlyRate').value) || 8.00;
        const appFeePercentage = parseFloat(document.getElementById('appFeePercentage').value) || 12.99;

        if (!this.validateInputs(offerAmount, distance, duration, appFeePercentage)) {
            return;
        }

        const appFeeAmount = offerAmount * (appFeePercentage / 100);
        const earningsAfterFee = offerAmount - appFeeAmount;
        const adjustedDuration = duration * trafficLevel;
        const totalOperatingCost = distance * operatingCost;
        const netProfit = earningsAfterFee - totalOperatingCost;
        const effectiveHourlyRate = adjustedDuration > 0 ? (netProfit / adjustedDuration) * 60 : 0;
        const profitPerKm = distance > 0 ? netProfit / distance : 0;

        const recommendation = this.getRecommendation(effectiveHourlyRate, minHourlyRate, netProfit);
        
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
            alert(this.languageManager.currentLang === 'es' ? 'Por favor ingrese un porcentaje de comisión válido (0-100%)' : 'Please enter a valid fee percentage (0-100%)');
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
        if (resultsDiv) {
            resultsDiv.classList.remove('hidden');
        }

        document.getElementById('totalCost').textContent = `$${results.totalOperatingCost.toFixed(2)}`;
        document.getElementById('earningsAfterFee').textContent = `$${results.earningsAfterFee.toFixed(2)}`;
        document.getElementById('netProfit').textContent = `$${results.netProfit.toFixed(2)}`;
        document.getElementById('hourlyRate').textContent = `$${results.effectiveHourlyRate.toFixed(2)}/hr`;
        document.getElementById('profitPerKm').textContent = `$${results.profitPerKm.toFixed(2)}/km`;

        const recommendationText = document.getElementById('recommendationText');
        const reasoningText = document.getElementById('reasoningText');
        
        if (recommendationText) {
            recommendationText.textContent = results.recommendation.text;
            recommendationText.className = results.recommendation.class;
        }
        
        if (reasoningText) {
            reasoningText.textContent = this.getReasoning(results);
        }

        const meterFill = document.getElementById('meterFill');
        if (meterFill) {
            meterFill.style.width = `${results.recommendation.score}%`;
        }
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
        const platformSelect = document.getElementById('platform');
        calculation.platform = platformSelect ? platformSelect.value : 'indrive';
        
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

            const platformName = this.languageManager.getText(calc.platform || 'indrive');
            
            item.innerHTML = `
                <div class="history-header">
                    <strong>${platformName}</strong> - 
                    $${calc.offerAmount.toFixed(2)} - 
                    ${calc.distance}km
                </div>
                <div class="history-details">
                    ${calc.effectiveHourlyRate.toFixed(2)}/hr - 
                    <span class="${calc.recommendation.class}">${statusText}</span>
                </div>
                <small>${calc.timestamp}</small>
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