/**
 * ATLAS v5.0 - WASM Loader (com Web Worker)
 * Mantém compatibilidade com AtlasWASM v3.0
 * Adiciona AtlasEngine com Worker para cálculos em background
 */

// ============================================
// AtlasWASM - API Legada (compatibilidade v3.0)
// ============================================

var AtlasWASM = (function() {
    'use strict';
    
    var Module = null;
    var isReady = false;
    var useWasm = false;
    var readyCallbacks = [];
    
    // Funções wrapped do WASM
    var wasm = {
        seedRng: null,
        monteCarloFire: null,
        monteCarloInvestment: null,
        getFireMedian: null,
        getFireP10: null,
        getFireP25: null,
        getFireP75: null,
        getFireP90: null,
        getFireSuccessRate: null,
        getFireYears: null,
        getInvMedian: null,
        getInvP10: null,
        getInvP90: null,
        getInvDrawdown: null,
        compoundGrowth: null,
        periodsToTarget: null,
        dcfValuation: null
    };
    
    // Resultados do Monte Carlo
    var fireResults = { median: 0, p10: 0, p25: 0, p75: 0, p90: 0, successRate: 0, years: 0 };
    var invResults = { median: 0, p10: 0, p90: 0, drawdown: 0 };
    
    /**
     * Inicializa o módulo WASM
     */
    async function init() {
        if (isReady) return true;
        
        try {
            if (typeof createFinancialModule === 'undefined') {
                console.log('[AtlasWASM] Módulo não encontrado. Usando fallback JavaScript.');
                initFallback();
                return false;
            }
            
            Module = await createFinancialModule();
            
            wasm.seedRng = Module.cwrap('seed_rng', null, ['number']);
            wasm.monteCarloFire = Module.cwrap('monte_carlo_fire', null, 
                ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);
            wasm.monteCarloInvestment = Module.cwrap('monte_carlo_investment', null,
                ['number', 'number', 'number', 'number', 'number', 'number']);
            wasm.getFireMedian = Module.cwrap('get_fire_median', 'number', []);
            wasm.getFireP10 = Module.cwrap('get_fire_p10', 'number', []);
            wasm.getFireP25 = Module.cwrap('get_fire_p25', 'number', []);
            wasm.getFireP75 = Module.cwrap('get_fire_p75', 'number', []);
            wasm.getFireP90 = Module.cwrap('get_fire_p90', 'number', []);
            wasm.getFireSuccessRate = Module.cwrap('get_fire_success_rate', 'number', []);
            wasm.getFireYears = Module.cwrap('get_fire_years', 'number', []);
            wasm.getInvMedian = Module.cwrap('get_inv_median', 'number', []);
            wasm.getInvP10 = Module.cwrap('get_inv_p10', 'number', []);
            wasm.getInvP90 = Module.cwrap('get_inv_p90', 'number', []);
            wasm.getInvDrawdown = Module.cwrap('get_inv_drawdown', 'number', []);
            wasm.compoundGrowth = Module.cwrap('compound_growth', 'number', ['number', 'number', 'number']);
            wasm.periodsToTarget = Module.cwrap('periods_to_target', 'number', ['number', 'number', 'number', 'number']);
            wasm.dcfValuation = Module.cwrap('dcf_valuation', 'number', ['number', 'number', 'number', 'number', 'number']);
            
            wasm.seedRng(Date.now());
            
            useWasm = true;
            isReady = true;
            console.log('[AtlasWASM] Módulo financeiro carregado!');
            
            readyCallbacks.forEach(function(cb) { cb(); });
            readyCallbacks = [];
            
            return true;
            
        } catch (e) {
            console.warn('[AtlasWASM] Erro ao carregar:', e);
            initFallback();
            return false;
        }
    }
    
    function initFallback() {
        useWasm = false;
        isReady = true;
        console.log('[AtlasWASM] Usando implementação JavaScript pura.');
        readyCallbacks.forEach(function(cb) { cb(); });
        readyCallbacks = [];
    }
    
    function onReady(callback) {
        if (isReady) callback();
        else readyCallbacks.push(callback);
    }
    
    // Gerador de números aleatórios (Box-Muller)
    function randomNormal(mean, stdDev) {
        var u1 = Math.random();
        var u2 = Math.random();
        var z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return mean + z * stdDev;
    }
    
    function monteCarloFire(savings, contribution, expenses, returnRate, volatility, withdrawalRate, years, iterations) {
        if (useWasm && wasm.monteCarloFire) {
            wasm.monteCarloFire(savings, contribution, expenses, returnRate, volatility, withdrawalRate, years, iterations);
            fireResults.median = wasm.getFireMedian();
            fireResults.p10 = wasm.getFireP10();
            fireResults.p25 = wasm.getFireP25();
            fireResults.p75 = wasm.getFireP75();
            fireResults.p90 = wasm.getFireP90();
            fireResults.successRate = wasm.getFireSuccessRate();
            fireResults.years = wasm.getFireYears();
            return fireResults;
        }
        
        // Fallback JavaScript
        var results = [];
        var successes = 0;
        var yearsToFire = [];
        var fireTarget = expenses * 12 / (withdrawalRate || 0.04);
        
        for (var i = 0; i < iterations; i++) {
            var balance = savings;
            var fireYear = -1;
            
            for (var y = 0; y < years; y++) {
                var yearReturn = randomNormal(returnRate, volatility);
                balance = balance * (1 + yearReturn) + contribution * 12;
                
                if (balance >= fireTarget && fireYear === -1) {
                    fireYear = y + 1;
                }
            }
            
            results.push(balance);
            if (balance >= fireTarget) successes++;
            if (fireYear > 0) yearsToFire.push(fireYear);
        }
        
        results.sort(function(a, b) { return a - b; });
        yearsToFire.sort(function(a, b) { return a - b; });
        
        fireResults.median = results[Math.floor(iterations * 0.5)];
        fireResults.p10 = results[Math.floor(iterations * 0.1)];
        fireResults.p25 = results[Math.floor(iterations * 0.25)];
        fireResults.p75 = results[Math.floor(iterations * 0.75)];
        fireResults.p90 = results[Math.floor(iterations * 0.9)];
        fireResults.successRate = (successes / iterations) * 100;
        fireResults.years = yearsToFire.length > 0 ? yearsToFire[Math.floor(yearsToFire.length * 0.5)] : years;
        
        return fireResults;
    }
    
    function monteCarloInvestment(initial, monthly, returnRate, volatility, years, iterations) {
        if (useWasm && wasm.monteCarloInvestment) {
            wasm.monteCarloInvestment(initial, monthly, returnRate, volatility, years, iterations);
            invResults.median = wasm.getInvMedian();
            invResults.p10 = wasm.getInvP10();
            invResults.p90 = wasm.getInvP90();
            invResults.drawdown = wasm.getInvDrawdown();
            return invResults;
        }
        
        var results = [];
        var maxDrawdowns = [];
        
        for (var i = 0; i < iterations; i++) {
            var balance = initial;
            var peak = initial;
            var maxDrawdown = 0;
            
            for (var y = 0; y < years; y++) {
                var yearReturn = randomNormal(returnRate, volatility);
                balance = balance * (1 + yearReturn) + monthly * 12;
                
                if (balance > peak) peak = balance;
                var drawdown = (peak - balance) / peak;
                if (drawdown > maxDrawdown) maxDrawdown = drawdown;
            }
            
            results.push(balance);
            maxDrawdowns.push(maxDrawdown);
        }
        
        results.sort(function(a, b) { return a - b; });
        
        invResults.median = results[Math.floor(iterations * 0.5)];
        invResults.p10 = results[Math.floor(iterations * 0.1)];
        invResults.p90 = results[Math.floor(iterations * 0.9)];
        invResults.drawdown = maxDrawdowns.reduce(function(a, b) { return a + b; }, 0) / iterations * 100;
        
        return invResults;
    }
    
    function compoundGrowth(principal, rate, periods) {
        if (useWasm && wasm.compoundGrowth) {
            return wasm.compoundGrowth(principal, rate, periods);
        }
        return principal * Math.pow(1 + rate, periods);
    }
    
    function periodsToTarget(current, target, rate, contribution) {
        if (useWasm && wasm.periodsToTarget) {
            return wasm.periodsToTarget(current, target, rate, contribution);
        }
        
        if (rate <= 0 && contribution <= 0) return -1;
        var balance = current;
        var periods = 0;
        while (balance < target && periods < 1000) {
            balance = balance * (1 + rate) + contribution;
            periods++;
        }
        return periods < 1000 ? periods : -1;
    }
    
    function dcfValuation(cashflow, growthRate, terminalGrowth, discountRate, years) {
        if (useWasm && wasm.dcfValuation) {
            return wasm.dcfValuation(cashflow, growthRate, terminalGrowth, discountRate, years);
        }
        
        var pv = 0;
        var cf = cashflow;
        
        for (var i = 1; i <= years; i++) {
            cf = cf * (1 + growthRate);
            pv += cf / Math.pow(1 + discountRate, i);
        }
        
        var terminalCF = cf * (1 + terminalGrowth);
        var terminalValue = terminalCF / (discountRate - terminalGrowth);
        pv += terminalValue / Math.pow(1 + discountRate, years);
        
        return pv;
    }
    
    // Auto-inicializa
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            setTimeout(init, 0);
        }
    }
    
    return {
        init: init,
        onReady: onReady,
        isReady: function() { return isReady; },
        isUsingWasm: function() { return useWasm; },
        monteCarloFire: monteCarloFire,
        monteCarloInvestment: monteCarloInvestment,
        getFireMedian: function() { return fireResults.median; },
        getFireP10: function() { return fireResults.p10; },
        getFireP25: function() { return fireResults.p25; },
        getFireP75: function() { return fireResults.p75; },
        getFireP90: function() { return fireResults.p90; },
        getFireSuccessRate: function() { return fireResults.successRate; },
        getFireYears: function() { return fireResults.years; },
        getInvMedian: function() { return invResults.median; },
        getInvP10: function() { return invResults.p10; },
        getInvP90: function() { return invResults.p90; },
        getInvDrawdown: function() { return invResults.drawdown; },
        compoundGrowth: compoundGrowth,
        periodsToTarget: periodsToTarget,
        dcfValuation: dcfValuation
    };
})();


// ============================================
// AtlasEngine - Nova API com Web Worker
// ============================================

var AtlasEngine = (function() {
    'use strict';
    
    var worker = null;
    var isReady = false;
    var isInitializing = false;
    var pendingRequests = new Map();
    var requestId = 0;
    var initPromise = null;
    var moduleStatus = { forecast: false, kpis: false, financial: false };
    var progressCallbacks = new Map();
    
    function nextId() {
        return ++requestId;
    }
    
    function init(options) {
        if (initPromise) return initPromise;
        if (isReady) return Promise.resolve({ status: 'ready', modules: moduleStatus });
        
        isInitializing = true;
        
        initPromise = new Promise(function(resolve, reject) {
            try {
                worker = new Worker('scripts/workers/calculation.worker.js');
                
                worker.onmessage = function(event) {
                    handleWorkerMessage(event.data);
                };
                
                worker.onerror = function(error) {
                    console.error('[AtlasEngine] Worker error:', error);
                    isInitializing = false;
                    // Fallback: marca como pronto mesmo sem worker
                    isReady = true;
                    resolve({ status: 'fallback', modules: moduleStatus });
                };
                
                var id = nextId();
                pendingRequests.set(id, {
                    resolve: function(result) {
                        isReady = true;
                        isInitializing = false;
                        moduleStatus = result.modules || {};
                        console.log('[AtlasEngine] Inicializado:', result);
                        resolve(result);
                    },
                    reject: reject
                });
                
                worker.postMessage({ id: id, command: 'INIT', data: options || {} });
                
            } catch (e) {
                isInitializing = false;
                isReady = true; // Marca como pronto para usar fallbacks
                console.warn('[AtlasEngine] Worker não disponível:', e);
                resolve({ status: 'fallback', modules: moduleStatus });
            }
        });
        
        return initPromise;
    }
    
    function handleWorkerMessage(data) {
        if (data.type === 'PROGRESS') {
            progressCallbacks.forEach(function(callback) {
                callback(data.progress);
            });
            return;
        }
        
        var pending = pendingRequests.get(data.id);
        if (pending) {
            pendingRequests.delete(data.id);
            if (data.success) {
                pending.resolve(data.result);
            } else {
                pending.reject(new Error(data.error));
            }
        }
    }
    
    function sendCommand(command, data, onProgress) {
        return new Promise(function(resolve, reject) {
            if (!worker) {
                // Fallback para cálculo local
                resolve(runFallback(command, data));
                return;
            }
            
            var id = nextId();
            
            if (onProgress) {
                progressCallbacks.set(id, onProgress);
            }
            
            pendingRequests.set(id, {
                resolve: function(result) {
                    progressCallbacks.delete(id);
                    resolve(result);
                },
                reject: function(error) {
                    progressCallbacks.delete(id);
                    reject(error);
                }
            });
            
            worker.postMessage({ id: id, command: command, data: data });
        });
    }
    
    // Fallbacks JavaScript locais
    function runFallback(command, data) {
        switch (command) {
            case 'FORECAST':
                return runForecastFallback(data);
            case 'STRESS_TEST':
                return runStressTestFallback(data);
            case 'KPIS':
                return runKPIsFallback(data);
            case 'BREAKEVEN':
                return runBreakevenFallback(data);
            default:
                return {};
        }
    }
    
    function runForecastFallback(params) {
        var currentSavings = params.currentSavings || 0;
        var monthlyContribution = params.monthlyContribution || 0;
        var annualReturn = params.annualReturn || 0.10;
        var months = params.months || 12;
        var monthlyReturn = annualReturn / 12;
        var balance = currentSavings;
        var totalReturns = 0;
        var balances = [];
        
        for (var m = 0; m < months; m++) {
            var monthReturn = balance * monthlyReturn;
            totalReturns += monthReturn;
            balance = balance + monthReturn + monthlyContribution;
            balances.push(balance);
        }
        
        var percentGrowth = currentSavings > 0 ? ((balance - currentSavings) / currentSavings) * 100 : 0;
        var years = months / 12;
        var cagr = currentSavings > 0 && years > 0 ? (Math.pow(balance / currentSavings, 1 / years) - 1) * 100 : 0;
        
        return {
            finalBalance: balance,
            totalReturns: totalReturns,
            totalContributions: monthlyContribution * months,
            cagr: cagr,
            percentGrowth: percentGrowth,
            balances: balances
        };
    }
    
    function runStressTestFallback(params) {
        var income = params.income || 0;
        var expenses = params.expenses || 0;
        var savings = params.savings || 0;
        
        var changes = [
            { name: 'mild', income: -0.10, expenses: 0.05 },
            { name: 'moderate', income: -0.25, expenses: 0.10 },
            { name: 'severe', income: -0.40, expenses: 0.15 },
            { name: 'extreme', income: -0.60, expenses: 0.25 }
        ];
        
        var scenarios = changes.map(function(c) {
            var sIncome = income * (1 + c.income);
            var sExpenses = expenses * (1 + c.expenses);
            var sCashflow = sIncome - sExpenses;
            var runway = sCashflow < 0 && savings > 0 ? Math.floor(savings / Math.abs(sCashflow)) : -1;
            
            return {
                scenario: c.name,
                income: sIncome,
                expenses: sExpenses,
                cashflow: sCashflow,
                balanceImpact: sCashflow * (params.months || 12),
                runway: runway
            };
        });
        
        return { scenarios: scenarios };
    }
    
    function runKPIsFallback(params) {
        var income = params.income || 0;
        var expenses = params.expenses || 0;
        var savings = params.savings || 0;
        var withdrawalRate = params.withdrawalRate || 4;
        var completedGoals = params.completedGoals || 0;
        var totalGoals = params.totalGoals || 0;
        
        var liquidityRatio = expenses > 0 ? savings / expenses : 999;
        var savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
        var fireTarget = (expenses * 12) / (withdrawalRate / 100);
        var fireProgress = fireTarget > 0 ? (savings / fireTarget) * 100 : 0;
        var runwayMonths = expenses > 0 ? savings / expenses : 999;
        var goalsCompletion = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
        var expenseRatio = income > 0 ? (expenses / income) * 100 : 100;
        
        var score = Math.min(liquidityRatio / 6, 1) * 15 +
                    Math.min(savingsRate / 30, 1) * 15 +
                    Math.min(fireProgress / 100, 1) * 15 +
                    (100 - Math.min(expenseRatio, 100)) / 100 * 10 +
                    Math.min(runwayMonths / 12, 1) * 15;
        
        var level = score >= 80 ? 3 : score >= 60 ? 2 : score >= 40 ? 1 : 0;
        
        return {
            liquidityRatio: liquidityRatio,
            savingsRate: savingsRate,
            operatingMargin: savingsRate,
            fireProgress: fireProgress,
            netWorthGrowth: 0,
            expenseRatio: expenseRatio,
            goalsCompletion: goalsCompletion,
            runwayMonths: runwayMonths,
            overallScore: score,
            overallLevel: level
        };
    }
    
    function runBreakevenFallback(params) {
        var income = params.income || 0;
        var expenses = params.expenses || 0;
        
        return {
            breakevenIncome: expenses,
            safetyMargin: income > 0 ? ((income - expenses) / income) * 100 : 0,
            maxIncomeReduction: income - expenses,
            isPositive: income >= expenses
        };
    }
    
    // Auto-inicialização
    if (typeof document !== 'undefined') {
        var autoInit = function() {
            init().catch(function(e) {
                console.warn('[AtlasEngine] Auto-init falhou:', e);
            });
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', autoInit);
        } else {
            setTimeout(autoInit, 100);
        }
    }
    
    return {
        init: init,
        ready: function() { return isReady; },
        getModuleStatus: function() { return moduleStatus; },
        forecast: function(params) { return sendCommand('FORECAST', params); },
        stressTest: function(params) { return sendCommand('STRESS_TEST', params); },
        breakeven: function(params) { return sendCommand('BREAKEVEN', params); },
        kpis: function(params) { return sendCommand('KPIS', params); },
        monteCarlo: function(params, onProgress) { return sendCommand('MONTE_CARLO', params, onProgress); }
    };
})();