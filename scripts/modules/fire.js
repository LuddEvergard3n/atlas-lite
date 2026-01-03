// FIRE Calculator Module - ATLAS v3.0 Professional
var FireModule = {
    render: function() {
        var fire = AtlasState.get('fire') || {};
        
        return '\
            <h1 class="page-title">Calculadora FIRE</h1>\
            <p class="page-subtitle">Financial Independence, Retire Early - Planeje sua liberdade financeira</p>\
            \
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">\
                <div class="form-section">\
                    <div class="form-section-title">\
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>\
                        Parâmetros FIRE\
                    </div>\
                    <p class="text-muted" style="font-size:0.8rem;margin-bottom:1rem">Dica: Use K (mil), M (milhão), B (bilhão)</p>\
                    <div class="form-grid">\
                        <div class="form-group">\
                            <label class="form-label">Idade Atual</label>\
                            <input type="number" class="form-input" id="fireAge" value="' + (fire.age || 30) + '" min="18" max="80" oninput="FireModule.calculate()">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Patrimônio Atual</label>\
                            <input type="text" class="form-input" id="fireSavings" value="' + (fire.savings || 100000) + '" oninput="FireModule.calculate()">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Gastos Mensais</label>\
                            <input type="text" class="form-input" id="fireExpenses" value="' + (fire.expenses || 8000) + '" oninput="FireModule.calculate()">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Aporte Mensal</label>\
                            <input type="text" class="form-input" id="fireContribution" value="' + (fire.contribution || 4000) + '" oninput="FireModule.calculate()">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Retorno Anual (%)</label>\
                            <input type="number" class="form-input" id="fireReturn" value="' + (fire.returnRate || 10) + '" step="0.5" oninput="FireModule.calculate()">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Taxa de Retirada (%)</label>\
                            <input type="number" class="form-input" id="fireWithdraw" value="' + (fire.withdraw || 4) + '" step="0.5" oninput="FireModule.calculate()">\
                        </div>\
                    </div>\
                </div>\
                \
                <div class="results-panel">\
                    <div class="results-panel-header">\
                        <div class="results-panel-icon" style="background:linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1));color:#fbbf24"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>\
                        <div class="results-panel-title">Análise FIRE</div>\
                    </div>\
                    \
                    <div class="kpi-grid kpi-grid-2" style="margin-bottom:1rem">\
                        <div class="kpi-card kpi-card-large">\
                            <div class="kpi-card-label">Meta FIRE</div>\
                            <div class="kpi-card-value accent" id="fireMeta" style="font-size:2rem">-</div>\
                            <div class="kpi-card-sub">Patrimônio necessário</div>\
                        </div>\
                        <div class="kpi-card kpi-card-large">\
                            <div class="kpi-card-label">Idade FIRE</div>\
                            <div class="kpi-card-value positive" id="fireAgeResult" style="font-size:2rem">-</div>\
                            <div class="kpi-card-sub" id="fireYearsText">-</div>\
                        </div>\
                    </div>\
                    \
                    <div class="kpi-grid kpi-grid-3">\
                        <div class="kpi-card">\
                            <div class="kpi-card-label">Progresso</div>\
                            <div class="kpi-card-value accent" id="fireProgress" style="font-size:1.25rem">-</div>\
                        </div>\
                        <div class="kpi-card">\
                            <div class="kpi-card-label">Renda Passiva</div>\
                            <div class="kpi-card-value positive" id="fireIncome" style="font-size:1.25rem">-</div>\
                        </div>\
                        <div class="kpi-card">\
                            <div class="kpi-card-label">Anos Restantes</div>\
                            <div class="kpi-card-value" id="fireYears" style="font-size:1.25rem">-</div>\
                        </div>\
                    </div>\
                    \
                    <div style="margin-top:1.25rem">\
                        <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#64748b;margin-bottom:0.5rem">\
                            <span>Atual</span>\
                            <span id="fireProgressPercent">0%</span>\
                            <span>Meta FIRE</span>\
                        </div>\
                        <div style="height:12px;background:rgba(0,0,0,0.3);border-radius:6px;overflow:hidden">\
                            <div id="fireProgressBar" style="height:100%;width:0%;background:linear-gradient(90deg,#38bdf8,#34d399);border-radius:6px;transition:width 0.5s ease"></div>\
                        </div>\
                    </div>\
                    \
                    <div id="fireSummary" style="margin-top:1.25rem"></div>\
                </div>\
            </div>\
            \
            <div class="chart-panel" style="margin-top:1.5rem">\
                <div class="chart-panel-header">\
                    <div class="chart-panel-title">Projeção do Patrimônio até FIRE</div>\
                    <div class="chart-panel-legend">\
                        <div class="chart-legend-item"><span class="chart-legend-dot balance"></span> Patrimônio</div>\
                        <div class="chart-legend-item"><span class="chart-legend-dot" style="background:#34d399"></span> Meta FIRE</div>\
                    </div>\
                </div>\
                <div class="chart-container-premium">\
                    <canvas id="fireChart"></canvas>\
                </div>\
            </div>\
            \
            <div class="form-section" style="margin-top:1.5rem">\
                <div class="form-section-title">\
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>\
                    Projeção Ano a Ano\
                </div>\
                <div id="fireTable"></div>\
            </div>\
        ';
    },
    
    parseValue: function(str) {
        if (!str) return 0;
        str = String(str).replace(/[R$\s]/g, '').trim();
        var multipliers = { k: 1000, m: 1000000, b: 1000000000 };
        var match = str.match(/^([\d.,]+)\s*([kmb])?$/i);
        if (match) {
            var num = match[1].replace(/\./g, '').replace(',', '.');
            num = parseFloat(num) || 0;
            if (match[2]) num *= multipliers[match[2].toLowerCase()];
            return num;
        }
        return parseFloat(str.replace(/[^\d.-]/g, '')) || 0;
    },
    
    calculate: function() {
        var age = parseInt(document.getElementById('fireAge').value) || 30;
        var savings = FireModule.parseValue(document.getElementById('fireSavings').value);
        var expenses = FireModule.parseValue(document.getElementById('fireExpenses').value);
        var contribution = FireModule.parseValue(document.getElementById('fireContribution').value);
        var returnRate = parseFloat(document.getElementById('fireReturn').value) / 100 || 0.1;
        var withdrawRate = parseFloat(document.getElementById('fireWithdraw').value) / 100 || 0.04;
        
        AtlasState.set('fire', {
            age: age,
            savings: savings,
            expenses: expenses,
            contribution: contribution,
            returnRate: returnRate * 100,
            withdraw: withdrawRate * 100
        });
        
        var annualExpenses = expenses * 12;
        var fireTarget = annualExpenses / withdrawRate;
        var monthlyPassiveIncome = fireTarget * withdrawRate / 12;
        
        var monthlyRate = returnRate / 12;
        var balance = savings;
        var months = 0;
        var maxMonths = 600;
        var yearlyData = [{
            year: 0,
            age: age,
            balance: balance,
            contributed: savings,
            interest: 0
        }];
        
        var totalContributed = savings;
        
        while (balance < fireTarget && months < maxMonths) {
            balance = balance * (1 + monthlyRate) + contribution;
            totalContributed += contribution;
            months++;
            if (months % 12 === 0) {
                yearlyData.push({
                    year: months / 12,
                    age: age + (months / 12),
                    balance: balance,
                    contributed: totalContributed,
                    interest: balance - totalContributed
                });
            }
        }
        
        var years = months / 12;
        var fireAge = age + years;
        var progress = Math.min((savings / fireTarget) * 100, 100);
        
        document.getElementById('fireMeta').textContent = Atlas.formatCurrency(fireTarget);
        document.getElementById('fireAgeResult').textContent = Math.round(fireAge) + ' anos';
        document.getElementById('fireYearsText').textContent = years.toFixed(1) + ' anos restantes';
        document.getElementById('fireYears').textContent = years.toFixed(1);
        document.getElementById('fireProgress').textContent = progress.toFixed(1) + '%';
        document.getElementById('fireProgressPercent').textContent = progress.toFixed(1) + '%';
        document.getElementById('fireProgressBar').style.width = progress + '%';
        document.getElementById('fireIncome').textContent = Atlas.formatCurrency(monthlyPassiveIncome) + '/mês';
        
        var summaryEl = document.getElementById('fireSummary');
        if (summaryEl) {
            var bgColor = years <= 10 ? 'rgba(52,211,153,0.1)' : years <= 20 ? 'rgba(251,191,36,0.1)' : 'rgba(248,113,113,0.1)';
            var borderColor = years <= 10 ? '#34d399' : years <= 20 ? '#fbbf24' : '#f87171';
            summaryEl.innerHTML = '<div style="padding:1rem;background:' + bgColor + ';border-left:3px solid ' + borderColor + ';border-radius:var(--radius)">' +
                '<p style="font-size:0.9rem;line-height:1.6;margin:0">' +
                'Com patrimônio de <strong>' + Atlas.formatCurrency(savings) + '</strong>, ' +
                'aportando <strong>' + Atlas.formatCurrency(contribution) + '/mês</strong> a ' +
                '<strong>' + (returnRate * 100).toFixed(1) + '% a.a.</strong>, você atingirá a ' +
                'independência financeira em <strong>' + years.toFixed(1) + ' anos</strong>, aos ' +
                '<strong>' + Math.round(fireAge) + ' anos de idade</strong>.' +
                '</p></div>';
        }
        
        FireModule.renderChart(yearlyData, fireTarget);
        FireModule.renderTable(yearlyData, fireTarget);
    },
    
    renderChart: function(data, target) {
        var canvas = document.getElementById('fireChart');
        if (!canvas) return;
        
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
        var padding = { top: 30, right: 30, bottom: 50, left: 80 };
        var chartWidth = width - padding.left - padding.right;
        var chartHeight = height - padding.top - padding.bottom;
        
        ctx.clearRect(0, 0, width, height);
        
        var maxValue = Math.max(target, Math.max.apply(null, data.map(function(d) { return d.balance; }))) * 1.1;
        
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        for (var i = 0; i <= 5; i++) {
            var y = padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();
            
            var value = maxValue - (maxValue / 5) * i;
            ctx.fillStyle = '#64748b';
            ctx.font = '11px system-ui';
            ctx.textAlign = 'right';
            ctx.fillText(Atlas.formatCompact(value), padding.left - 10, y + 4);
        }
        
        var targetY = padding.top + chartHeight - (target / maxValue) * chartHeight;
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(padding.left, targetY);
        ctx.lineTo(width - padding.right, targetY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#34d399';
        ctx.font = '11px system-ui';
        ctx.textAlign = 'left';
        ctx.fillText('Meta: ' + Atlas.formatCompact(target), padding.left + 5, targetY - 5);
        
        if (data.length > 1) {
            ctx.beginPath();
            ctx.moveTo(padding.left, padding.top + chartHeight);
            for (var i = 0; i < data.length; i++) {
                var x = padding.left + (chartWidth / (data.length - 1)) * i;
                var y = padding.top + chartHeight - (data[i].balance / maxValue) * chartHeight;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
            ctx.closePath();
            ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
            ctx.fill();
            
            ctx.beginPath();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;
            for (var i = 0; i < data.length; i++) {
                var x = padding.left + (chartWidth / (data.length - 1)) * i;
                var y = padding.top + chartHeight - (data[i].balance / maxValue) * chartHeight;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px system-ui';
        ctx.textAlign = 'center';
        var step = Math.ceil(data.length / 10);
        for (var i = 0; i < data.length; i += step) {
            var x = padding.left + (chartWidth / (data.length - 1)) * i;
            ctx.fillText(data[i].age + ' anos', x, height - 15);
        }
    },
    
    renderTable: function(data, target) {
        var tableEl = document.getElementById('fireTable');
        if (!tableEl) return;
        
        var html = '<div style="overflow-x:auto"><table class="data-table"><thead><tr>' +
            '<th>Ano</th><th>Idade</th><th>Patrimônio</th><th>Aportado</th><th>Juros</th><th>% Meta</th>' +
            '</tr></thead><tbody>';
        
        var displayData = data.length > 20 ? data.filter(function(d, i) { return i % 2 === 0 || i === data.length - 1; }) : data;
        
        for (var i = 0; i < displayData.length; i++) {
            var d = displayData[i];
            var pct = (d.balance / target * 100).toFixed(1);
            var pctClass = pct >= 100 ? 'text-success' : pct >= 50 ? 'text-warning' : '';
            html += '<tr><td>' + d.year + '</td><td>' + Math.round(d.age) + '</td>' +
                '<td class="text-accent">' + Atlas.formatCurrency(d.balance) + '</td>' +
                '<td>' + Atlas.formatCurrency(d.contributed) + '</td>' +
                '<td class="text-success">' + Atlas.formatCurrency(d.interest) + '</td>' +
                '<td class="' + pctClass + '">' + pct + '%</td></tr>';
        }
        
        html += '</tbody></table></div>';
        tableEl.innerHTML = html;
    },
    
    init: function() {
        setTimeout(function() { FireModule.calculate(); }, 100);
    }
};

AtlasRouter.register('fire', FireModule);