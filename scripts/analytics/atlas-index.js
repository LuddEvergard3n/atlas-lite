// Atlas Index Module - ATLAS v5.0
// Corrigido: Círculo maior e centralizado

function AtlasIndexCalculateScore() {
    var fire = AtlasState.get('fire') || {};
    var cashflow = AtlasState.get('cashflow') || {};
    var goals = AtlasState.get('goals') || [];
    
    var growth = 0, liquidity = 0, stability = 0, predictability = 0;
    
    // Growth (0-25)
    if (fire.contribution && fire.contribution > 0) {
        growth = Math.min(12.5, (fire.contribution / 5000) * 12.5);
    }
    var completedGoals = 0;
    for (var i = 0; i < goals.length; i++) {
        if (goals[i].completed) completedGoals++;
    }
    if (goals.length > 0) {
        growth += Math.min(12.5, (completedGoals / goals.length) * 12.5);
    }
    
    // Liquidity (0-25)
    if (fire.savings && fire.expenses && fire.expenses > 0) {
        var months = fire.savings / fire.expenses;
        liquidity = Math.min(25, (months / 6) * 25);
    }
    
    // Stability (0-25)
    var incomes = cashflow.incomes || [];
    var expenses = cashflow.expenses || [];
    var totalIncome = 0, totalExpense = 0;
    for (var i = 0; i < incomes.length; i++) totalIncome += incomes[i].value || 0;
    for (var i = 0; i < expenses.length; i++) totalExpense += expenses[i].value || 0;
    if (totalIncome > 0) {
        var margin = ((totalIncome - totalExpense) / totalIncome) * 100;
        stability = Math.min(25, Math.max(0, (margin / 50) * 25));
    }
    
    // Predictability (0-25)
    var dataPoints = 0;
    if (fire.savings > 0) dataPoints++;
    if (fire.expenses > 0) dataPoints++;
    if (fire.contribution > 0) dataPoints++;
    if (incomes.length > 0) dataPoints++;
    if (expenses.length > 0) dataPoints++;
    if (goals.length > 0) dataPoints++;
    predictability = Math.min(25, (dataPoints / 6) * 25);
    
    var total = Math.round(growth + liquidity + stability + predictability);
    
    return {
        total: Math.min(100, Math.max(0, total)),
        growth: Math.round(growth * 10) / 10,
        liquidity: Math.round(liquidity * 10) / 10,
        stability: Math.round(stability * 10) / 10,
        predictability: Math.round(predictability * 10) / 10
    };
}

function AtlasIndexGetScoreClass(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'warning';
    return 'danger';
}

function AtlasIndexGetScoreLabel(score) {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Atenção';
    return 'Crítico';
}

var AtlasIndexModule = {
    render: function() {
        var scores = AtlasIndexCalculateScore();
        var scoreClass = AtlasIndexGetScoreClass(scores.total);
        var scoreLabel = AtlasIndexGetScoreLabel(scores.total);
        // Circunferência = 2 * PI * raio (100) = 628.32
        var circumference = 628.32;
        var strokeDash = (scores.total / 100) * circumference;
        
        var recs = [];
        if (scores.total >= 70) {
            recs.push({ type: 'success', title: 'Situação Saudável', text: 'Seus indicadores estão em bom estado.' });
        }
        if (scores.growth < 10) {
            recs.push({ type: 'warning', title: 'Aumentar Aportes', text: 'Considere aumentar contribuições mensais.' });
        }
        if (scores.liquidity < 15) {
            recs.push({ type: 'warning', title: 'Reserva Baixa', text: 'Recomendado ter 6+ meses de despesas.' });
        }
        if (recs.length === 0) {
            recs.push({ type: 'info', title: 'Continue Assim', text: 'Mantenha sua disciplina financeira.' });
        }
        
        var recsHtml = '';
        for (var i = 0; i < recs.length; i++) {
            recsHtml += '<div class="recommendation ' + recs[i].type + '">' +
                '<div class="recommendation-title">' + recs[i].title + '</div>' +
                '<div class="recommendation-text">' + recs[i].text + '</div></div>';
        }
        
        var colorMap = {
            excellent: '#34d399',
            good: '#38bdf8',
            warning: '#fbbf24',
            danger: '#f87171'
        };
        var scoreColor = colorMap[scoreClass] || '#38bdf8';
        
        return '<h1 class="page-title">Índice Atlas</h1>' +
            '<p class="page-subtitle">Score consolidado de saúde financeira (0-100)</p>' +
            '<div class="grid-2 mb-3">' +
            '<div class="panel">' +
            '<div class="panel-header"><span class="panel-title">Score Geral</span></div>' +
            '<div class="panel-body" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2.5rem;min-height:420px">' +
            
            '<svg width="320" height="320" viewBox="0 0 320 320">' +
            '<circle cx="160" cy="160" r="140" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="16"/>' +
            '<circle cx="160" cy="160" r="140" fill="none" stroke="' + scoreColor + '" stroke-width="16" ' +
            'stroke-dasharray="' + ((scores.total / 100) * 880) + ' 880" stroke-linecap="round" transform="rotate(-90 160 160)"/>' +
            '<text x="160" y="160" text-anchor="middle" dominant-baseline="central" ' +
            'style="font-size:90px;font-weight:700;fill:var(--text,#fff)">' + scores.total + '</text>' +
            '</svg>' +
            
            '<div style="text-align:center;margin-top:1.5rem">' +
            '<div style="font-size:1.4rem;font-weight:600;color:' + scoreColor + '">' + scoreLabel + '</div>' +
            '<p style="margin-top:0.5rem;font-size:0.85rem;color:var(--text-muted,#94a3b8)">Atualizado em tempo real</p>' +
            '</div>' +
            
            '</div></div>' +
            '<div class="panel">' +
            '<div class="panel-header"><span class="panel-title">Composição do Índice</span></div>' +
            '<div class="panel-body">' +
            '<div class="index-breakdown">' +
            AtlasIndexModule.renderIndexItem('Crescimento', scores.growth, 25, 'Aportes e progresso de metas') +
            AtlasIndexModule.renderIndexItem('Liquidez', scores.liquidity, 25, 'Cobertura de reserva de emergência') +
            AtlasIndexModule.renderIndexItem('Estabilidade', scores.stability, 25, 'Margem do fluxo de caixa') +
            AtlasIndexModule.renderIndexItem('Previsibilidade', scores.predictability, 25, 'Completude dos dados') +
            '</div></div></div></div>' +
            '<div class="panel">' +
            '<div class="panel-header"><span class="panel-title">Recomendações</span></div>' +
            '<div class="panel-body">' + recsHtml + '</div></div>';
    },
    
    renderIndexItem: function(name, score, max, desc) {
        var pct = (score / max) * 100;
        // Cores baseadas na porcentagem
        var barColor;
        if (pct >= 80) barColor = '#10b981'; // Verde - Excelente
        else if (pct >= 60) barColor = '#3b82f6'; // Azul - Bom  
        else if (pct >= 40) barColor = '#f59e0b'; // Amarelo - Atenção
        else barColor = '#ef4444'; // Vermelho - Crítico
        
        return '<div class="index-item">' +
            '<div class="index-item-header">' +
            '<span class="index-name">' + name + '</span>' +
            '<span class="index-score">' + score.toFixed(1) + ' <span class="index-max">/ ' + max + '</span></span>' +
            '</div>' +
            '<div class="index-bar"><div class="index-bar-fill" style="width:' + pct + '%;background:' + barColor + '"></div></div>' +
            '<span class="index-desc">' + desc + '</span></div>';
    },
    
    init: function() {}
};

AtlasRouter.register('atlas-index', AtlasIndexModule);