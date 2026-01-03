// Finance Module - ATLAS v3.0 Professional
var FinanceModule = {
    render: function() {
        var finance = AtlasState.get('finance') || {};
        
        return '\
            <h1 class="page-title">Calculadora de Juros Compostos</h1>\
            <p class="page-subtitle">Simule o crescimento do seu patrimônio ao longo do tempo</p>\
            \
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">\
                <div class="form-section">\
                    <div class="form-section-title">\
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>\
                        Parâmetros de Investimento\
                    </div>\
                    <p class="text-muted" style="font-size:0.8rem;margin-bottom:1rem">Dica: Use K (mil), M (milhão), B (bilhão)</p>\
                    <div class="form-grid">\
                        <div class="form-group">\
                            <label class="form-label">Valor Inicial</label>\
                            <input type="text" class="form-input" id="finInitial" value="' + (finance.initial || 10000) + '" oninput="FinanceModule.calculate()">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Aporte Mensal</label>\
                            <input type="text" class="form-input" id="finMonthly" value="' + (finance.monthly || 1000) + '" oninput="FinanceModule.calculate()">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Taxa Anual (%)</label>\
                            <input type="number" class="form-input" id="finRate" value="' + (finance.rate || 12) + '" step="0.5" oninput="FinanceModule.calculate()">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Período (anos)</label>\
                            <input type="number" class="form-input" id="finYears" value="' + (finance.years || 10) + '" min="1" max="50" oninput="FinanceModule.calculate()">\
                        </div>\
                    </div>\
                </div>\
                \
                <div class="results-panel">\
                    <div class="results-panel-header">\
                        <div class="results-panel-icon" style="background:linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(16, 185, 129, 0.1));color:#34d399"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>\
                        <div class="results-panel-title">Resultado da Simulação</div>\
                    </div>\
                    \
                    <div class="kpi-grid kpi-grid-2" style="margin-bottom:1rem">\
                        <div class="kpi-card kpi-card-large">\
                            <div class="kpi-card-label">Valor Final</div>\
                            <div class="kpi-card-value positive" id="finTotal" style="font-size:2rem">-</div>\
                            <div class="kpi-card-sub">Patrimônio acumulado</div>\
                        </div>\
                        <div class="kpi-card kpi-card-large">\
                            <div class="kpi-card-label">Rentabilidade</div>\
                            <div class="kpi-card-value accent" id="finProfit" style="font-size:2rem">-</div>\
                            <div class="kpi-card-sub">Retorno total</div>\
                        </div>\
                    </div>\
                    \
                    <div class="kpi-grid kpi-grid-2">\
                        <div class="kpi-card">\
                            <div class="kpi-card-label">Total Investido</div>\
                            <div class="kpi-card-value" id="finInvested" style="font-size:1.25rem">-</div>\
                        </div>\
                        <div class="kpi-card">\
                            <div class="kpi-card-label">Juros Ganhos</div>\
                            <div class="kpi-card-value positive" id="finInterest" style="font-size:1.25rem">-</div>\
                        </div>\
                    </div>\
                    \
                    <div id="finSummary" style="margin-top:1.25rem"></div>\
                </div>\
            </div>\
            \
            <div class="chart-panel" style="margin-top:1.5rem">\
                <div class="chart-panel-header">\
                    <div class="chart-panel-title">Evolução do Patrimônio</div>\
                    <div class="chart-panel-legend">\
                        <div class="chart-legend-item"><span class="chart-legend-dot" style="background:#38bdf8"></span> Patrimônio Total</div>\
                        <div class="chart-legend-item"><span class="chart-legend-dot" style="background:#818cf8"></span> Total Investido</div>\
                    </div>\
                </div>\
                <div class="chart-container-premium">\
                    <canvas id="financeChart"></canvas>\
                </div>\
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
        var initial = FinanceModule.parseValue(document.getElementById('finInitial').value);
        var monthly = FinanceModule.parseValue(document.getElementById('finMonthly').value);
        var rate = parseFloat(document.getElementById('finRate').value) / 100 || 0.12;
        var years = parseInt(document.getElementById('finYears').value) || 10;
        
        AtlasState.set('finance', { initial: initial, monthly: monthly, rate: rate * 100, years: years });
        
        var monthlyRate = Math.pow(1 + rate, 1/12) - 1;
        var months = years * 12;
        var balance = initial;
        var totalInvested = initial;
        var yearlyData = [{ year: 0, balance: initial, invested: initial }];
        
        for (var m = 1; m <= months; m++) {
            balance = balance * (1 + monthlyRate) + monthly;
            totalInvested += monthly;
            if (m % 12 === 0) {
                yearlyData.push({ year: m / 12, balance: balance, invested: totalInvested });
            }
        }
        
        var interest = balance - totalInvested;
        var profit = totalInvested > 0 ? (interest / totalInvested) * 100 : 0;
        
        document.getElementById('finTotal').textContent = Atlas.formatCurrency(balance);
        document.getElementById('finInvested').textContent = Atlas.formatCurrency(totalInvested);
        document.getElementById('finInterest').textContent = Atlas.formatCurrency(interest);
        document.getElementById('finProfit').textContent = profit.toFixed(1) + '%';
        
        var summaryEl = document.getElementById('finSummary');
        if (summaryEl) {
            summaryEl.innerHTML = '<div style="padding:1rem;background:rgba(52,211,153,0.1);border-left:3px solid #34d399;border-radius:var(--radius)">' +
                '<p style="font-size:0.9rem;line-height:1.6;margin:0">' +
                'Investindo <strong>' + Atlas.formatCurrency(initial) + '</strong> iniciais + ' +
                '<strong>' + Atlas.formatCurrency(monthly) + '/mês</strong> a ' +
                '<strong>' + (rate * 100).toFixed(1) + '% a.a.</strong> por <strong>' + years + ' anos</strong>, ' +
                'você terá <strong>' + Atlas.formatCurrency(balance) + '</strong>, sendo ' +
                '<strong>' + Atlas.formatCurrency(interest) + '</strong> de juros.' +
                '</p></div>';
        }
        
        FinanceModule.renderChart(yearlyData);
    },
    
    renderChart: function(data) {
        var canvas = document.getElementById('financeChart');
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
        
        var maxValue = Math.max.apply(null, data.map(function(d) { return d.balance; })) * 1.1;
        
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
        
        // Área investido
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top + chartHeight);
        for (var i = 0; i < data.length; i++) {
            var x = padding.left + (chartWidth / (data.length - 1)) * i;
            var y = padding.top + chartHeight - (data[i].invested / maxValue) * chartHeight;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
        ctx.closePath();
        ctx.fillStyle = 'rgba(129, 140, 248, 0.3)';
        ctx.fill();
        
        // Área patrimônio
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
        
        // Linha patrimônio
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
        
        // Linha investido
        ctx.beginPath();
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 2;
        for (var i = 0; i < data.length; i++) {
            var x = padding.left + (chartWidth / (data.length - 1)) * i;
            var y = padding.top + chartHeight - (data[i].invested / maxValue) * chartHeight;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px system-ui';
        ctx.textAlign = 'center';
        for (var i = 0; i < data.length; i++) {
            var x = padding.left + (chartWidth / (data.length - 1)) * i;
            ctx.fillText(data[i].year + 'a', x, height - 15);
        }
    },
    
    init: function() {
        setTimeout(function() { FinanceModule.calculate(); }, 100);
    }
};

AtlasRouter.register('finance', FinanceModule);