const AnalyticsEngine = (function() {
    'use strict';
    
    let wasmModule = null;
    let useWasm = false;
    
    async function init() {
        try {
            if (typeof Module !== 'undefined' && Module.cwrap) {
                wasmModule = {
                    linearSlope: Module.cwrap('linear_regression_slope', 'number', ['number', 'number', 'number']),
                    linearIntercept: Module.cwrap('linear_regression_intercept', 'number', ['number', 'number', 'number']),
                    predict: Module.cwrap('predict_value', 'number', ['number', 'number', 'number']),
                    consistencyIndex: Module.cwrap('consistency_index', 'number', ['number', 'number', 'number']),
                    sm2NextInterval: Module.cwrap('sm2_next_interval', 'number', ['number', 'number', 'number']),
                    sm2UpdateEasiness: Module.cwrap('sm2_update_easiness', 'number', ['number', 'number']),
                    sm2ShouldReset: Module.cwrap('sm2_should_reset', 'number', ['number']),
                    pearsonCorrelation: Module.cwrap('pearson_correlation', 'number', ['number', 'number', 'number']),
                    percentChange: Module.cwrap('percent_change', 'number', ['number', 'number']),
                    detectTrend: Module.cwrap('detect_trend', 'number', ['number', 'number']),
                    daysToGoal: Module.cwrap('days_to_goal', 'number', ['number', 'number', 'number'])
                };
                useWasm = true;
                console.log('Analytics WASM loaded');
            }
        } catch (e) {
            console.log('Using JS fallback for analytics');
        }
    }
    
    // JS Fallbacks
    function linearRegression(data) {
        const n = data.length;
        if (n < 2) return { slope: 0, intercept: 0 };
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        data.forEach((d, i) => {
            sumX += i;
            sumY += d;
            sumXY += i * d;
            sumXX += i * i;
        });
        const denom = n * sumXX - sumX * sumX;
        if (Math.abs(denom) < 1e-10) return { slope: 0, intercept: sumY / n };
        const slope = (n * sumXY - sumX * sumY) / denom;
        const intercept = (sumY - slope * sumX) / n;
        return { slope, intercept };
    }
    
    function movingAverage(data, window) {
        return data.map((_, i, arr) => {
            const start = Math.max(0, i - window + 1);
            const slice = arr.slice(start, i + 1);
            return slice.reduce((a, b) => a + b, 0) / slice.length;
        });
    }
    
    function consistencyIndex(activeDays, totalDays) {
        if (totalDays < 1) return 0;
        const n = activeDays.filter(Boolean).length;
        let maxStreak = 0, streak = 0, maxGap = 0, gap = 0, gaps = 0, lastActive = -1;
        
        activeDays.forEach((active, i) => {
            if (active) {
                if (gap > 0) { gaps++; if (gap > maxGap) maxGap = gap; }
                gap = 0;
                streak++;
                if (streak > maxStreak) maxStreak = streak;
                lastActive = i;
            } else {
                if (streak > 0) streak = 0;
                if (lastActive >= 0) gap++;
            }
        });
        
        const frequency = n / totalDays;
        const streakScore = maxStreak / totalDays;
        const gapPenalty = maxGap > 0 ? 1 / (1 + Math.log(maxGap)) : 1;
        const recoveryBonus = gaps > 0 ? 0.1 * Math.min(gaps, 5) : 0;
        
        return Math.min(100, Math.max(0, frequency * 40 + streakScore * 30 + gapPenalty * 20 + recoveryBonus * 10));
    }
    
    function sm2(repetition, easiness, prevInterval, quality) {
        let newEasiness = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        newEasiness = Math.max(1.3, newEasiness);
        
        if (quality < 3) return { interval: 1, easiness: newEasiness, repetition: 0 };
        
        let interval;
        if (repetition === 0) interval = 1;
        else if (repetition === 1) interval = 6;
        else interval = Math.round(prevInterval * easiness);
        
        return { interval, easiness: newEasiness, repetition: repetition + 1 };
    }
    
    function pearsonCorrelation(x, y) {
        const n = Math.min(x.length, y.length);
        if (n < 2) return 0;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
        for (let i = 0; i < n; i++) {
            sumX += x[i]; sumY += y[i];
            sumXY += x[i] * y[i];
            sumXX += x[i] * x[i];
            sumYY += y[i] * y[i];
        }
        const num = n * sumXY - sumX * sumY;
        const denom = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
        return Math.abs(denom) < 1e-10 ? 0 : num / denom;
    }
    
    function detectTrend(data) {
        if (data.length < 3) return { trend: 'insufficient', slope: 0 };
        const { slope } = linearRegression(data);
        const mean = data.reduce((a, b) => a + b, 0) / data.length;
        const normalized = Math.abs(mean) < 1e-10 ? 0 : slope / Math.abs(mean);
        
        if (normalized > 0.05) return { trend: 'growing', slope, normalized };
        if (normalized < -0.05) return { trend: 'declining', slope, normalized };
        return { trend: 'stable', slope, normalized };
    }
    
    function projectToGoal(current, goal, dailyRate) {
        if (dailyRate <= 0) return { days: -1, achievable: false };
        if (current >= goal) return { days: 0, achievable: true };
        const days = Math.ceil((goal - current) / dailyRate);
        return { days, achievable: true };
    }
    
    function snapshotDiff(oldSnap, newSnap) {
        const changes = {};
        const keys = new Set([...Object.keys(oldSnap), ...Object.keys(newSnap)]);
        keys.forEach(key => {
            const oldVal = oldSnap[key] ?? 0;
            const newVal = newSnap[key] ?? 0;
            if (typeof oldVal === 'number' && typeof newVal === 'number') {
                const abs = newVal - oldVal;
                const pct = Math.abs(oldVal) < 1e-10 ? (newVal > 0 ? 100 : 0) : ((newVal - oldVal) / Math.abs(oldVal)) * 100;
                changes[key] = { old: oldVal, new: newVal, absolute: abs, percent: pct };
            }
        });
        return changes;
    }
    
    function generateAlert(metric, trend, current, goal, daysToGoal) {
        if (trend === 'declining' && goal > current) {
            return { type: 'warning', message: `${metric}: tendência de queda detectada` };
        }
        if (trend === 'stable' && goal > current && daysToGoal > 90) {
            return { type: 'warning', message: `${metric}: no ritmo atual, a meta não será atingida a tempo` };
        }
        if (trend === 'growing' && daysToGoal > 0 && daysToGoal < 30) {
            return { type: 'success', message: `${metric}: progresso acima do esperado!` };
        }
        return null;
    }
    
    init();
    
    return {
        linearRegression,
        movingAverage,
        consistencyIndex,
        sm2,
        pearsonCorrelation,
        detectTrend,
        projectToGoal,
        snapshotDiff,
        generateAlert,
        predict: (slope, intercept, x) => slope * x + intercept
    };
})();

window.AnalyticsEngine = AnalyticsEngine;