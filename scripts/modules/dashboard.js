// Dashboard Module - ATLAS v3.0 Professional
// Gráficos profissionais, layout responsivo, sem erros
var DashboardModule = {
    render: function() {
        var scores = typeof AtlasIndexCalculateScore === 'function' 
            ? AtlasIndexCalculateScore() 
            : { total: 50, growth: 10, liquidity: 15, stability: 10, predictability: 15 };
        var scoreClass = typeof AtlasIndexGetScoreClass === 'function'
            ? AtlasIndexGetScoreClass(scores.total)
            : 'warning';
        var scoreLabel = typeof AtlasIndexGetScoreLabel === 'function'
            ? AtlasIndexGetScoreLabel(scores.total)
            : 'Atenção';
        
        var fire = AtlasState.get('fire') || {};
        var goals = AtlasState.get('goals') || [];
        var cashflow = AtlasState.get('cashflow') || {};
        var scenarios = AtlasState.get('scenarios') || [];
        
        // Cálculos FIRE
        var fireTarget = fire.expenses ? (fire.expenses * 12) / ((fire.withdraw || 4) / 100) : 0;
        var fireProgress = fireTarget > 0 ? Math.min((fire.savings || 0) / fireTarget * 100, 100) : 0;
        
        // Cálculos Cashflow
        var incomes = cashflow.incomes || [];
        var expenses = cashflow.expenses || [];
        var monthlyIncome = 0, monthlyExpense = 0;
        for (var i = 0; i < incomes.length; i++) monthlyIncome += incomes[i].value || 0;
        for (var i = 0; i < expenses.length; i++) monthlyExpense += expenses[i].value || 0;
        var monthlyResult = monthlyIncome - monthlyExpense;
        var margin = monthlyIncome > 0 ? (monthlyResult / monthlyIncome * 100) : 0;
        
        // Projeção 12 meses
        var monthlySavings = monthlyResult + (fire.contribution || 0);
        var projectedBalance = (fire.savings || 0) + (monthlySavings * 12);
        
        // Metas
        var activeGoals = 0, completedGoals = 0;
        for (var i = 0; i < goals.length; i++) {
            if (goals[i].completed) completedGoals++;
            else activeGoals++;
        }
        
        // Verifica se FIRE está disponível
        var canAccessFire = typeof AtlasCapabilities !== 'undefined' ? AtlasCapabilities.canAccess('fire') : true;
        
        // Cores do score
        var colorMap = { excellent: '#34d399', good: '#38bdf8', warning: '#fbbf24', danger: '#f87171' };
        var scoreColor = colorMap[scoreClass] || '#38bdf8';
        
        // Card FIRE condicional
        var fireCard = canAccessFire ? '\
                <div class="stat-card" onclick="Atlas.navigate(\'fire\')" style="cursor:pointer">\
                    <div class="stat-label">Progresso FIRE</div>\
                    <div class="stat-value text-accent">' + fireProgress.toFixed(1) + '%</div>\
                    <div class="progress" style="margin-top:0.5rem"><div class="progress-fill" style="width:' + fireProgress + '%"></div></div>\
                </div>' : '\
                <div class="stat-card">\
                    <div class="stat-label">Resultado Mensal</div>\
                    <div class="stat-value ' + (monthlyResult >= 0 ? 'text-success' : 'text-danger') + '">' + Atlas.formatCurrency(monthlyResult) + '</div>\
                    <div class="stat-sub">' + (monthlyResult >= 0 ? 'Superávit' : 'Déficit') + '</div>\
                </div>';
        
        return '\
            <h1 class="page-title">Dashboard</h1>\
            <p class="page-subtitle">Visão geral da sua saúde financeira</p>\
            \
            <div class="stats-grid">' + fireCard + '\
                <div class="stat-card" onclick="Atlas.navigate(\'goals\')" style="cursor:pointer">\
                    <div class="stat-label">Metas Ativas</div>\
                    <div class="stat-value">' + activeGoals + '</div>\
                    <div class="stat-sub">' + completedGoals + ' concluídas</div>\
                </div>\
                <div class="stat-card">\
                    <div class="stat-label">Patrimônio em 12 meses</div>\
                    <div class="stat-value text-success">' + Atlas.formatCurrency(projectedBalance) + '</div>\
                    <div class="stat-sub">projeção linear</div>\
                </div>\
                <div class="stat-card" onclick="Atlas.navigate(\'atlas-index\')" style="cursor:pointer">\
                    <div class="stat-label">Índice Atlas</div>\
                    <div class="stat-value" style="color:' + scoreColor + '">' + scores.total + '<span style="font-size:0.7em;color:#64748b">/100</span></div>\
                    <div class="stat-sub" style="color:' + scoreColor + '">' + scoreLabel + '</div>\
                </div>\
            </div>\
            \
            <div class="grid-2">\
                <div class="panel">\
                    <div class="panel-header">\
                        <span class="panel-title">Fluxo de Caixa Mensal</span>\
                    </div>\
                    <div class="panel-body">\
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem">\
                            <div style="text-align:center;padding:1rem;background:var(--bg-tertiary);border-radius:var(--radius)">\
                                <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.5rem">RECEITAS</div>\
                                <div style="font-size:1.25rem;font-weight:700;color:#34d399">' + Atlas.formatCurrency(monthlyIncome) + '</div>\
                            </div>\
                            <div style="text-align:center;padding:1rem;background:var(--bg-tertiary);border-radius:var(--radius)">\
                                <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.5rem">DESPESAS</div>\
                                <div style="font-size:1.25rem;font-weight:700;color:#f87171">' + Atlas.formatCurrency(monthlyExpense) + '</div>\
                            </div>\
                            <div style="text-align:center;padding:1rem;background:var(--bg-tertiary);border-radius:var(--radius)">\
                                <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.5rem">RESULTADO</div>\
                                <div style="font-size:1.25rem;font-weight:700;color:' + (monthlyResult >= 0 ? '#34d399' : '#f87171') + '">' + Atlas.formatCurrency(monthlyResult) + '</div>\
                            </div>\
                        </div>\
                        <div style="height:220px;background:var(--bg-tertiary);border-radius:var(--radius);padding:1rem">\
                            <canvas id="dashCashflowChart"></canvas>\
                        </div>\
                    </div>\
                </div>\
                \
                <div class="panel">\
                    <div class="panel-header">\
                        <span class="panel-title">Acesso Rápido</span>\
                    </div>\
                    <div class="panel-body">\
                        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.75rem">\
                            ' + DashboardModule.renderQuickLink('fire', 'Calculadora FIRE', 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5') + '\
                            ' + DashboardModule.renderQuickLink('finance', 'Juros Compostos', 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6') + '\
                            ' + DashboardModule.renderQuickLink('simulations', 'Simulações', 'M18 20V10 M12 20V4 M6 20v-6') + '\
                            ' + DashboardModule.renderQuickLink('goals', 'Metas', 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0 M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0') + '\
                        </div>\
                        \
                        <div style="margin-top:1.5rem;padding:1rem;background:linear-gradient(135deg, rgba(56,189,248,0.1), rgba(129,140,248,0.1));border:1px solid rgba(56,189,248,0.2);border-radius:var(--radius)">\
                            <div style="display:flex;align-items:center;gap:1rem">\
                                <div style="width:60px;height:60px;border-radius:50%;border:3px solid ' + scoreColor + ';display:flex;align-items:center;justify-content:center">\
                                    <span style="font-size:1.5rem;font-weight:700;color:' + scoreColor + '">' + scores.total + '</span>\
                                </div>\
                                <div>\
                                    <div style="font-size:0.85rem;font-weight:600;color:var(--text)">Índice Atlas</div>\
                                    <div style="font-size:0.75rem;color:' + scoreColor + '">' + scoreLabel + '</div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
            \
            <div class="grid-2" style="margin-top:1rem">\
                <div class="panel">\
                    <div class="panel-header">\
                        <span class="panel-title">Metas Recentes</span>\
                        <span class="panel-action" onclick="Atlas.navigate(\'goals\')">Ver todas</span>\
                    </div>\
                    <div class="panel-body">' + DashboardModule.renderGoals(goals) + '</div>\
                </div>\
                \
                <div class="panel">\
                    <div class="panel-header">\
                        <span class="panel-title">Alertas e Recomendações</span>\
                    </div>\
                    <div class="panel-body">' + DashboardModule.renderAlerts(fire, cashflow, scores, goals) + '</div>\
                </div>\
            </div>\
        ';
    },
    
    renderQuickLink: function(route, label, pathD) {
        return '<div onclick="Atlas.navigate(\'' + route + '\')" style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;padding:1rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:all 0.2s" onmouseover="this.style.borderColor=\'var(--accent)\'" onmouseout="this.style.borderColor=\'var(--border)\'">' +
            '<div style="width:40px;height:40px;background:linear-gradient(135deg,rgba(56,189,248,0.2),rgba(129,140,248,0.2));border-radius:var(--radius);display:flex;align-items:center;justify-content:center">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + pathD + '"/></svg>' +
            '</div>' +
            '<span style="font-size:0.8rem;color:var(--text-secondary);text-align:center">' + label + '</span>' +
            '</div>';
    },
    
    renderGoals: function(goals) {
        if (goals.length === 0) {
            return '<div style="text-align:center;padding:2rem;color:var(--text-muted)">' +
                '<p style="margin-bottom:1rem">Nenhuma meta cadastrada</p>' +
                '<button class="btn btn-primary btn-sm" onclick="Atlas.navigate(\'goals\')">Criar Meta</button>' +
                '</div>';
        }
        
        var html = '';
        var count = Math.min(goals.length, 4);
        for (var i = 0; i < count; i++) {
            var g = goals[i];
            var progress = g.target > 0 ? Math.min((g.current / g.target) * 100, 100) : 0;
            var statusColor = g.completed ? '#34d399' : '#38bdf8';
            
            html += '<div style="padding:0.75rem;background:var(--bg-tertiary);border-radius:var(--radius);margin-bottom:0.5rem' + (g.completed ? ';opacity:0.6' : '') + '">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">' +
                '<span style="font-size:0.85rem;font-weight:500' + (g.completed ? ';text-decoration:line-through' : '') + '">' + g.name + '</span>' +
                '<span style="font-size:0.8rem;color:' + statusColor + '">' + progress.toFixed(0) + '%</span>' +
                '</div>' +
                '<div class="progress"><div class="progress-fill" style="width:' + progress + '%;background:' + statusColor + '"></div></div>' +
                '</div>';
        }
        
        if (goals.length > 4) {
            html += '<div style="text-align:center;margin-top:0.5rem"><span class="panel-action" onclick="Atlas.navigate(\'goals\')">+' + (goals.length - 4) + ' mais</span></div>';
        }
        
        return html;
    },
    
    renderAlerts: function(fire, cashflow, scores, goals) {
        var alerts = [];
        
        // Reserva de emergência
        if (fire.savings && fire.expenses && fire.expenses > 0) {
            var months = fire.savings / fire.expenses;
            if (months < 3) {
                alerts.push({ type: 'danger', icon: '!', text: 'Reserva de emergência crítica: apenas ' + months.toFixed(1) + ' meses de despesas.' });
            } else if (months < 6) {
                alerts.push({ type: 'warning', icon: '!', text: 'Reserva baixa: ' + months.toFixed(1) + ' meses. Ideal: 6+ meses.' });
            }
        }
        
        // Índice Atlas
        if (scores.total < 40) {
            alerts.push({ type: 'warning', icon: '!', text: 'Índice Atlas em nível crítico (' + scores.total + '). Revise seus indicadores.' });
        }
        
        // Fluxo de caixa
        var incomes = cashflow.incomes || [];
        var expenses = cashflow.expenses || [];
        var totalIncome = 0, totalExpense = 0;
        for (var i = 0; i < incomes.length; i++) totalIncome += incomes[i].value || 0;
        for (var i = 0; i < expenses.length; i++) totalExpense += expenses[i].value || 0;
        
        if (totalExpense > totalIncome && totalIncome > 0) {
            alerts.push({ type: 'danger', icon: '!', text: 'Despesas excedem receitas! Déficit de ' + Atlas.formatCurrency(totalExpense - totalIncome) + '/mês.' });
        }
        
        // Sem metas
        if (goals.length === 0) {
            alerts.push({ type: 'info', icon: 'i', text: 'Defina metas financeiras para acompanhar seu progresso.' });
        }
        
        // Tudo OK
        if (alerts.length === 0) {
            alerts.push({ type: 'success', icon: '✓', text: 'Situação financeira saudável. Continue assim!' });
        }
        
        var html = '';
        var bgColors = { success: 'rgba(52,211,153,0.1)', warning: 'rgba(251,191,36,0.1)', danger: 'rgba(248,113,113,0.1)', info: 'rgba(56,189,248,0.1)' };
        var borderColors = { success: '#34d399', warning: '#fbbf24', danger: '#f87171', info: '#38bdf8' };
        
        for (var i = 0; i < alerts.length; i++) {
            var a = alerts[i];
            html += '<div style="display:flex;align-items:flex-start;gap:0.75rem;padding:0.75rem;background:' + bgColors[a.type] + ';border-left:3px solid ' + borderColors[a.type] + ';border-radius:var(--radius);margin-bottom:0.5rem">' +
                '<span style="width:24px;height:24px;border-radius:50%;background:' + borderColors[a.type] + ';color:#000;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;flex-shrink:0">' + a.icon + '</span>' +
                '<span style="font-size:0.85rem;line-height:1.4">' + a.text + '</span>' +
                '</div>';
        }
        
        return html;
    },
    
    renderChart: function() {
        var canvas = document.getElementById('dashCashflowChart');
        if (!canvas) return;
        
        var cashflow = AtlasState.get('cashflow') || {};
        var incomes = cashflow.incomes || [];
        var expenses = cashflow.expenses || [];
        
        var totalIncome = 0, totalExpense = 0;
        for (var i = 0; i < incomes.length; i++) totalIncome += incomes[i].value || 0;
        for (var i = 0; i < expenses.length; i++) totalExpense += expenses[i].value || 0;
        
        var ctx = canvas.getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        var rect = canvas.parentElement.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
        
        var width = rect.width;
        var height = rect.height;
        var padding = { top: 30, right: 20, bottom: 50, left: 20 };
        var chartWidth = width - padding.left - padding.right;
        var chartHeight = height - padding.top - padding.bottom;
        
        ctx.clearRect(0, 0, width, height);
        
        if (totalIncome === 0 && totalExpense === 0) {
            ctx.fillStyle = '#64748b';
            ctx.font = '14px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText('Adicione receitas e despesas no Fluxo de Caixa', width / 2, height / 2);
            return;
        }
        
        var maxVal = Math.max(totalIncome, totalExpense);
        var barWidth = 80;
        var gap = 50;
        var totalBarsWidth = barWidth * 2 + gap;
        var startX = (width - totalBarsWidth) / 2;
        
        // Barras com gradiente
        var incomeHeight = (totalIncome / maxVal) * chartHeight;
        var expenseHeight = (totalExpense / maxVal) * chartHeight;
        
        // Receitas
        var incomeGrad = ctx.createLinearGradient(0, padding.top + chartHeight - incomeHeight, 0, padding.top + chartHeight);
        incomeGrad.addColorStop(0, '#34d399');
        incomeGrad.addColorStop(1, '#059669');
        ctx.fillStyle = incomeGrad;
        ctx.beginPath();
        ctx.roundRect(startX, padding.top + chartHeight - incomeHeight, barWidth, incomeHeight, [8, 8, 0, 0]);
        ctx.fill();
        
        // Despesas
        var expenseGrad = ctx.createLinearGradient(0, padding.top + chartHeight - expenseHeight, 0, padding.top + chartHeight);
        expenseGrad.addColorStop(0, '#f87171');
        expenseGrad.addColorStop(1, '#dc2626');
        ctx.fillStyle = expenseGrad;
        ctx.beginPath();
        ctx.roundRect(startX + barWidth + gap, padding.top + chartHeight - expenseHeight, barWidth, expenseHeight, [8, 8, 0, 0]);
        ctx.fill();
        
        // Valores no topo
        ctx.font = 'bold 14px system-ui';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#34d399';
        ctx.fillText(Atlas.formatCompact(totalIncome), startX + barWidth/2, padding.top + chartHeight - incomeHeight - 10);
        ctx.fillStyle = '#f87171';
        ctx.fillText(Atlas.formatCompact(totalExpense), startX + barWidth + gap + barWidth/2, padding.top + chartHeight - expenseHeight - 10);
        
        // Labels
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px system-ui';
        ctx.fillText('Receitas', startX + barWidth/2, height - 15);
        ctx.fillText('Despesas', startX + barWidth + gap + barWidth/2, height - 15);
    },
    
    init: function() {
        setTimeout(function() {
            DashboardModule.renderChart();
        }, 100);
        
        // Resize handler
        window.addEventListener('resize', function() {
            clearTimeout(DashboardModule.resizeTimeout);
            DashboardModule.resizeTimeout = setTimeout(function() {
                DashboardModule.renderChart();
            }, 250);
        });
    }
};

AtlasRouter.register('dashboard', DashboardModule);