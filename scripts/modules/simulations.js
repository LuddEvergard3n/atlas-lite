// Simulations Module - ATLAS v3.0 Professional
// Monte Carlo com gráfico spaghetti
var SimulationsModule = {
    render: function() {
        return '\
            <h1 class="page-title">Simulações Financeiras</h1>\
            <p class="page-subtitle">Análises avançadas para planejamento estratégico</p>\
            \
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem">\
                <div class="panel" style="cursor:pointer" onclick="SimulationsModule.showMonteCarlo()">\
                    <div class="panel-body" style="display:flex;align-items:center;gap:1rem;padding:1.5rem">\
                        <div style="width:56px;height:56px;background:linear-gradient(135deg,rgba(56,189,248,0.2),rgba(129,140,248,0.2));border-radius:var(--radius);display:flex;align-items:center;justify-content:center;flex-shrink:0">\
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>\
                        </div>\
                        <div>\
                            <h3 style="font-size:1.1rem;font-weight:600;margin-bottom:0.25rem">Simulação Monte Carlo</h3>\
                            <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.5rem">Simulação probabilística com milhares de cenários</p>\
                            <span style="display:inline-block;padding:0.25rem 0.5rem;background:rgba(56,189,248,0.1);border-radius:99px;font-size:0.7rem;color:#38bdf8">Até 1000 iterações</span>\
                        </div>\
                    </div>\
                </div>\
                \
                <div class="panel" style="cursor:pointer" onclick="SimulationsModule.showFireSim()">\
                    <div class="panel-body" style="display:flex;align-items:center;gap:1rem;padding:1.5rem">\
                        <div style="width:56px;height:56px;background:linear-gradient(135deg,rgba(52,211,153,0.2),rgba(16,185,129,0.2));border-radius:var(--radius);display:flex;align-items:center;justify-content:center;flex-shrink:0">\
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>\
                        </div>\
                        <div>\
                            <h3 style="font-size:1.1rem;font-weight:600;margin-bottom:0.25rem">Simulação FIRE</h3>\
                            <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.5rem">Probabilidade de sucesso na independência financeira</p>\
                            <span style="display:inline-block;padding:0.25rem 0.5rem;background:rgba(52,211,153,0.1);border-radius:99px;font-size:0.7rem;color:#34d399">Análise de Risco</span>\
                        </div>\
                    </div>\
                </div>\
                \
                <div class="panel" style="cursor:pointer" onclick="SimulationsModule.showDCF()">\
                    <div class="panel-body" style="display:flex;align-items:center;gap:1rem;padding:1.5rem">\
                        <div style="width:56px;height:56px;background:linear-gradient(135deg,rgba(251,191,36,0.2),rgba(245,158,11,0.2));border-radius:var(--radius);display:flex;align-items:center;justify-content:center;flex-shrink:0">\
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>\
                        </div>\
                        <div>\
                            <h3 style="font-size:1.1rem;font-weight:600;margin-bottom:0.25rem">Fluxo de Caixa Descontado</h3>\
                            <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.5rem">Valuation DCF para calcular valor presente</p>\
                            <span style="display:inline-block;padding:0.25rem 0.5rem;background:rgba(251,191,36,0.1);border-radius:99px;font-size:0.7rem;color:#fbbf24">Valuation</span>\
                        </div>\
                    </div>\
                </div>\
                \
                <div class="panel" style="cursor:pointer" onclick="SimulationsModule.showStress()">\
                    <div class="panel-body" style="display:flex;align-items:center;gap:1rem;padding:1.5rem">\
                        <div style="width:56px;height:56px;background:linear-gradient(135deg,rgba(248,113,113,0.2),rgba(239,68,68,0.2));border-radius:var(--radius);display:flex;align-items:center;justify-content:center;flex-shrink:0">\
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>\
                        </div>\
                        <div>\
                            <h3 style="font-size:1.1rem;font-weight:600;margin-bottom:0.25rem">Teste de Estresse</h3>\
                            <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.5rem">Simule cenários adversos e veja sua resiliência</p>\
                            <span style="display:inline-block;padding:0.25rem 0.5rem;background:rgba(248,113,113,0.1);border-radius:99px;font-size:0.7rem;color:#f87171">Análise de Risco</span>\
                        </div>\
                    </div>\
                </div>\
            </div>\
            \
            <div id="simResultPanel"></div>\
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
    
    showMonteCarlo: function() {
        var fire = AtlasState.get('fire') || {};
        var html = '\
            <div class="panel" style="margin-top:1.5rem">\
                <div class="panel-header">\
                    <span class="panel-title">Simulação Monte Carlo</span>\
                    <button class="btn btn-sm btn-secondary" onclick="document.getElementById(\'simResultPanel\').innerHTML=\'\'">Fechar</button>\
                </div>\
                <div class="panel-body">\
                    <div class="form-grid" style="grid-template-columns:repeat(6,1fr);gap:1rem;margin-bottom:1.5rem">\
                        <div class="form-group">\
                            <label class="form-label">Patrimônio Inicial</label>\
                            <input type="text" class="form-input" id="mcInitial" value="' + (fire.savings || 100000) + '">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Aporte Mensal</label>\
                            <input type="text" class="form-input" id="mcMonthly" value="' + (fire.contribution || 3000) + '">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Retorno Médio (%)</label>\
                            <input type="number" class="form-input" id="mcReturn" value="10" step="0.5">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Volatilidade (%)</label>\
                            <input type="number" class="form-input" id="mcVol" value="15" step="0.5">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Anos</label>\
                            <input type="number" class="form-input" id="mcYears" value="30" min="1" max="50">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Simulações</label>\
                            <select class="form-input" id="mcIterations">\
                                <option value="100">100</option>\
                                <option value="250">250</option>\
                                <option value="500" selected>500</option>\
                                <option value="1000">1.000</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div style="text-align:center;margin-bottom:1.5rem">\
                        <button class="btn btn-primary btn-lg" onclick="SimulationsModule.runMonteCarlo()" style="padding:0.75rem 3rem">\
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;margin-right:0.5rem;vertical-align:middle"><polygon points="5 3 19 12 5 21 5 3"/></svg>\
                            Executar Simulação\
                        </button>\
                    </div>\
                    <div id="mcStats" style="display:none">\
                        <div class="stats-grid" style="margin-bottom:1.5rem">\
                            <div class="stat-card">\
                                <div class="stat-label">Percentil 10 (Pessimista)</div>\
                                <div class="stat-value text-danger" id="mcP10">-</div>\
                            </div>\
                            <div class="stat-card" style="border-color:#34d399">\
                                <div class="stat-label">Mediana (Mais Provável)</div>\
                                <div class="stat-value text-success" id="mcP50">-</div>\
                            </div>\
                            <div class="stat-card">\
                                <div class="stat-label">Percentil 90 (Otimista)</div>\
                                <div class="stat-value text-accent" id="mcP90">-</div>\
                            </div>\
                            <div class="stat-card">\
                                <div class="stat-label">Média</div>\
                                <div class="stat-value" id="mcMean">-</div>\
                            </div>\
                        </div>\
                    </div>\
                    <div style="position:relative;height:450px;background:var(--bg-tertiary);border-radius:var(--radius);padding:1rem">\
                        <canvas id="mcChart"></canvas>\
                        <div id="mcChartPlaceholder" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;color:var(--text-muted)">\
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:48px;height:48px;margin-bottom:1rem;opacity:0.5"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>\
                            <p>Configure os parâmetros e clique em Executar</p>\
                        </div>\
                    </div>\
                    <div id="mcLegend" style="display:none;margin-top:1rem;text-align:center">\
                        <span style="display:inline-flex;align-items:center;gap:0.5rem;margin:0 0.75rem;font-size:0.85rem">\
                            <span style="width:20px;height:3px;background:#38bdf8;border-radius:2px"></span> P90 (Otimista)\
                        </span>\
                        <span style="display:inline-flex;align-items:center;gap:0.5rem;margin:0 0.75rem;font-size:0.85rem">\
                            <span style="width:20px;height:4px;background:#34d399;border-radius:2px"></span> Mediana (P50)\
                        </span>\
                        <span style="display:inline-flex;align-items:center;gap:0.5rem;margin:0 0.75rem;font-size:0.85rem">\
                            <span style="width:20px;height:3px;background:#f87171;border-radius:2px"></span> P10 (Pessimista)\
                        </span>\
                        <span style="display:inline-flex;align-items:center;gap:0.5rem;margin:0 0.75rem;font-size:0.85rem">\
                            <span style="width:20px;height:2px;background:rgba(148,163,184,0.4);border-radius:2px"></span> Simulações\
                        </span>\
                    </div>\
                </div>\
            </div>';
        document.getElementById('simResultPanel').innerHTML = html;
    },
    
    runMonteCarlo: function() {
        var initial = SimulationsModule.parseValue(document.getElementById('mcInitial').value);
        var monthly = SimulationsModule.parseValue(document.getElementById('mcMonthly').value);
        var returnRate = parseFloat(document.getElementById('mcReturn').value) / 100;
        var vol = parseFloat(document.getElementById('mcVol').value) / 100;
        var years = parseInt(document.getElementById('mcYears').value);
        var iterations = parseInt(document.getElementById('mcIterations').value);
        
        // Mostrar loading
        document.getElementById('mcChartPlaceholder').innerHTML = '<div style="color:#38bdf8">Executando ' + iterations + ' simulações...</div>';
        
        setTimeout(function() {
            var results = [];
            var allPaths = [];
            var months = years * 12;
            
            // Box-Muller para distribuição normal
            function gaussianRandom() {
                var u = 0, v = 0;
                while (u === 0) u = Math.random();
                while (v === 0) v = Math.random();
                return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            }
            
            // Rodar simulações
            for (var i = 0; i < iterations; i++) {
                var balance = initial;
                var path = [balance];
                var monthlyReturn = returnRate / 12;
                var monthlyVol = vol / Math.sqrt(12);
                
                for (var m = 0; m < months; m++) {
                    var randomReturn = monthlyReturn + gaussianRandom() * monthlyVol;
                    balance = balance * (1 + randomReturn) + monthly;
                    
                    // Guardar ponto a cada 12 meses
                    if ((m + 1) % 12 === 0) {
                        path.push(balance);
                    }
                }
                
                results.push(balance);
                allPaths.push(path);
            }
            
            // Calcular estatísticas
            results.sort(function(a, b) { return a - b; });
            var p10 = results[Math.floor(iterations * 0.1)];
            var p50 = results[Math.floor(iterations * 0.5)];
            var p90 = results[Math.floor(iterations * 0.9)];
            var mean = results.reduce(function(a, b) { return a + b; }, 0) / results.length;
            
            // Calcular caminhos de percentis
            var p10Path = [];
            var medianPath = [];
            var p90Path = [];
            for (var y = 0; y <= years; y++) {
                var valuesAtYear = allPaths.map(function(p) { return p[y] || 0; }).sort(function(a, b) { return a - b; });
                p10Path.push(valuesAtYear[Math.floor(valuesAtYear.length * 0.1)]);
                medianPath.push(valuesAtYear[Math.floor(valuesAtYear.length * 0.5)]);
                p90Path.push(valuesAtYear[Math.floor(valuesAtYear.length * 0.9)]);
            }
            
            // Atualizar UI
            document.getElementById('mcStats').style.display = 'block';
            document.getElementById('mcP10').textContent = Atlas.formatCurrency(p10);
            document.getElementById('mcP50').textContent = Atlas.formatCurrency(p50);
            document.getElementById('mcP90').textContent = Atlas.formatCurrency(p90);
            document.getElementById('mcMean').textContent = Atlas.formatCurrency(mean);
            document.getElementById('mcChartPlaceholder').style.display = 'none';
            document.getElementById('mcLegend').style.display = 'block';
            
            // Renderizar gráfico spaghetti
            SimulationsModule.renderSpaghettiChart(allPaths, p10Path, medianPath, p90Path, years);
            
        }, 50);
    },
    
    renderSpaghettiChart: function(allPaths, p10Path, medianPath, p90Path, years) {
        var canvas = document.getElementById('mcChart');
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
        var padding = { top: 40, right: 50, bottom: 60, left: 90 };
        var chartWidth = width - padding.left - padding.right;
        var chartHeight = height - padding.top - padding.bottom;
        
        ctx.clearRect(0, 0, width, height);
        
        // Encontrar valor máximo
        var maxVal = 0;
        for (var i = 0; i < allPaths.length; i++) {
            for (var j = 0; j < allPaths[i].length; j++) {
                if (allPaths[i][j] > maxVal) maxVal = allPaths[i][j];
            }
        }
        maxVal *= 1.1;
        
        // Grid horizontal
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        for (var i = 0; i <= 5; i++) {
            var y = padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();
            
            var val = maxVal - (maxVal / 5) * i;
            ctx.fillStyle = '#64748b';
            ctx.font = '11px system-ui';
            ctx.textAlign = 'right';
            ctx.fillText(Atlas.formatCompact(val), padding.left - 10, y + 4);
        }
        
        // Eixo Y label
        ctx.save();
        ctx.translate(20, padding.top + chartHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = '#64748b';
        ctx.font = '12px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Patrimônio', 0, 0);
        ctx.restore();
        
        // Gerar cores variadas para as linhas
        var colors = [];
        for (var i = 0; i < allPaths.length; i++) {
            var hue = (i * 137.5) % 360;
            colors.push('hsla(' + hue + ', 70%, 60%, 0.2)');
        }
        
        // Desenhar todas as simulacoes (spaghetti)
        ctx.lineWidth = 1;
        for (var i = 0; i < allPaths.length; i++) {
            var path = allPaths[i];
            ctx.strokeStyle = colors[i];
            ctx.beginPath();
            
            for (var j = 0; j < path.length; j++) {
                var x = padding.left + (chartWidth / (path.length - 1)) * j;
                var y = padding.top + chartHeight - (path[j] / maxVal) * chartHeight;
                
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        
        // Funcao auxiliar para desenhar linha de percentil
        function drawPercentileLine(pathData, color, lineWidth) {
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            
            for (var j = 0; j < pathData.length; j++) {
                var x = padding.left + (chartWidth / (pathData.length - 1)) * j;
                var y = padding.top + chartHeight - (pathData[j] / maxVal) * chartHeight;
                
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            
            // Ponto final
            var lastX = padding.left + chartWidth;
            var lastY = padding.top + chartHeight - (pathData[pathData.length - 1] / maxVal) * chartHeight;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
            ctx.fill();
            
            return { x: lastX, y: lastY, value: pathData[pathData.length - 1] };
        }
        
        // Desenhar P10 (pessimista - vermelho)
        var p10End = drawPercentileLine(p10Path, '#f87171', 3);
        
        // Desenhar Mediana (mais provavel - verde)
        var medianEnd = drawPercentileLine(medianPath, '#34d399', 4);
        
        // Desenhar P90 (otimista - cyan)
        var p90End = drawPercentileLine(p90Path, '#38bdf8', 3);
        
        // Labels dos valores finais
        ctx.font = 'bold 11px system-ui';
        ctx.textAlign = 'left';
        
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(Atlas.formatCompact(p90End.value), p90End.x + 8, p90End.y + 4);
        
        ctx.fillStyle = '#34d399';
        ctx.fillText(Atlas.formatCompact(medianEnd.value), medianEnd.x + 8, medianEnd.y + 4);
        
        ctx.fillStyle = '#f87171';
        ctx.fillText(Atlas.formatCompact(p10End.value), p10End.x + 8, p10End.y + 4);
        
        // Labels eixo X (anos)
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px system-ui';
        ctx.textAlign = 'center';
        
        var currentYear = new Date().getFullYear();
        var step = Math.max(1, Math.ceil(years / 10));
        for (var y = 0; y <= years; y += step) {
            var x = padding.left + (chartWidth / years) * y;
            ctx.fillText((currentYear + y).toString(), x, height - padding.bottom + 20);
        }
        
        // Eixo X label
        ctx.fillStyle = '#64748b';
        ctx.font = '12px system-ui';
        ctx.fillText('Ano', padding.left + chartWidth / 2, height - 10);
        
        // Titulo
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Simulação Monte Carlo - Projeção de Patrimônio', width / 2, 20);
    },
    
    showFireSim: function() {
        var fire = AtlasState.get('fire') || {};
        var currentAge = 30;
        var html = '\
            <div class="panel" style="margin-top:1.5rem">\
                <div class="panel-header">\
                    <span class="panel-title">Simulação FIRE - Chance de Sucesso</span>\
                    <button class="btn btn-sm btn-secondary" onclick="document.getElementById(\'simResultPanel\').innerHTML=\'\'">Fechar</button>\
                </div>\
                <div class="panel-body">\
                    <div class="form-grid" style="grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem">\
                        <div class="form-group">\
                            <label class="form-label">Idade Atual</label>\
                            <input type="number" class="form-input" id="fireSimAge" value="30" min="18" max="70">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Patrimônio Atual</label>\
                            <input type="text" class="form-input" id="fireSimCurrent" value="' + (fire.savings || 100000) + '">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Aporte Mensal</label>\
                            <input type="text" class="form-input" id="fireSimMonthly" value="' + (fire.contribution || 3000) + '">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Despesas na Aposentadoria</label>\
                            <input type="text" class="form-input" id="fireSimExpenses" value="' + (fire.expenses || 8000) + '">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Idade Aposentadoria</label>\
                            <input type="number" class="form-input" id="fireSimRetireAge" value="55" min="30" max="80">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Retorno Médio (%)</label>\
                            <input type="number" class="form-input" id="fireSimReturn" value="10" step="0.5">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Volatilidade (%)</label>\
                            <input type="number" class="form-input" id="fireSimVol" value="18" step="0.5">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Simulações</label>\
                            <select class="form-input" id="fireSimIterations">\
                                <option value="100">100</option>\
                                <option value="250">250</option>\
                                <option value="380" selected>380</option>\
                                <option value="500">500</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div style="text-align:center;margin-bottom:1.5rem">\
                        <button class="btn btn-primary btn-lg" onclick="SimulationsModule.runFireSim()" style="padding:0.75rem 3rem">\
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;margin-right:0.5rem;vertical-align:middle"><polygon points="5 3 19 12 5 21 5 3"/></svg>\
                            Executar Simulação\
                        </button>\
                    </div>\
                    <div id="fireSimHeader" style="display:none">\
                        <div style="display:grid;grid-template-columns:200px 1fr auto;gap:2rem;align-items:center;margin-bottom:1.5rem;padding:1.5rem;background:var(--bg-tertiary);border-radius:var(--radius)">\
                            <div style="position:relative;width:140px;height:140px">\
                                <canvas id="fireDonutChart" width="140" height="140"></canvas>\
                                <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center">\
                                    <div id="fireSuccessRate" style="font-size:1.4rem;font-weight:700;color:#34d399">0%</div>\
                                    <div style="font-size:0.65rem;color:var(--text-muted)">Taxa de Sucesso</div>\
                                </div>\
                            </div>\
                            <div>\
                                <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem">\
                                    <span id="fireStatusText" style="font-size:0.95rem;color:var(--text-secondary)">Calculando...</span>\
                                </div>\
                            </div>\
                            <div id="fireLegendCategories" style="display:grid;grid-template-columns:auto auto auto;gap:0.5rem 1.5rem;font-size:0.8rem"></div>\
                        </div>\
                    </div>\
                    <div style="position:relative;height:380px;background:var(--bg-tertiary);border-radius:var(--radius);padding:1rem">\
                        <canvas id="fireSimChart"></canvas>\
                        <div id="fireSimPlaceholder" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;color:var(--text-muted)">\
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:48px;height:48px;margin-bottom:1rem;opacity:0.5"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>\
                            <p>Configure os parâmetros e clique em Executar</p>\
                        </div>\
                    </div>\
                    <div id="fireSimLegend" style="display:none;margin-top:1rem;display:flex;justify-content:center;flex-wrap:wrap;gap:1rem"></div>\
                </div>\
            </div>';
        document.getElementById('simResultPanel').innerHTML = html;
    },
    
    runFireSim: function() {
        var currentAge = parseInt(document.getElementById('fireSimAge').value);
        var current = SimulationsModule.parseValue(document.getElementById('fireSimCurrent').value);
        var monthly = SimulationsModule.parseValue(document.getElementById('fireSimMonthly').value);
        var retireAge = parseInt(document.getElementById('fireSimRetireAge').value);
        var monthlyExpenses = SimulationsModule.parseValue(document.getElementById('fireSimExpenses').value);
        var returnRate = parseFloat(document.getElementById('fireSimReturn').value) / 100;
        var vol = parseFloat(document.getElementById('fireSimVol').value) / 100;
        var iterations = parseInt(document.getElementById('fireSimIterations').value);
        
        var yearsToRetire = retireAge - currentAge;
        var yearsInRetirement = 40;
        var totalYears = yearsToRetire + yearsInRetirement;
        var endAge = currentAge + totalYears;
        
        document.getElementById('fireSimPlaceholder').innerHTML = '<div style="color:#38bdf8">Executando ' + iterations + ' simulações...</div>';
        
        setTimeout(function() {
            var allPaths = [];
            var categories = { largeSurplus: 0, comfortable: 0, barelyMade: 0, almostMade: 0, failed: 0 };
            
            function gaussianRandom() {
                var u = 0, v = 0;
                while (u === 0) u = Math.random();
                while (v === 0) v = Math.random();
                return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            }
            
            for (var i = 0; i < iterations; i++) {
                var balance = current;
                var path = [balance];
                var monthlyReturn = returnRate / 12;
                var monthlyVol = vol / Math.sqrt(12);
                var failed = false;
                var finalBalance = 0;
                
                for (var y = 0; y < totalYears; y++) {
                    for (var m = 0; m < 12; m++) {
                        var randomReturn = monthlyReturn + gaussianRandom() * monthlyVol;
                        balance = balance * (1 + randomReturn);
                        
                        if (y < yearsToRetire) {
                            balance += monthly;
                        } else {
                            balance -= monthlyExpenses;
                        }
                        
                        if (balance < 0) {
                            balance = 0;
                            failed = true;
                        }
                    }
                    path.push(balance);
                }
                
                allPaths.push(path);
                finalBalance = balance;
                
                var targetWealth = monthlyExpenses * 12 * 25;
                if (failed || finalBalance < monthlyExpenses * 12) {
                    categories.failed++;
                } else if (finalBalance < targetWealth * 0.5) {
                    categories.almostMade++;
                } else if (finalBalance < targetWealth * 0.75) {
                    categories.barelyMade++;
                } else if (finalBalance < targetWealth * 1.5) {
                    categories.comfortable++;
                } else {
                    categories.largeSurplus++;
                }
            }
            
            var successCount = categories.largeSurplus + categories.comfortable + categories.barelyMade + categories.almostMade;
            var successRate = ((successCount) / iterations) * 100;
            
            var percentiles = { p1: [], p5: [], p25: [], p50: [], p75: [], p95: [] };
            for (var y = 0; y <= totalYears; y++) {
                var valuesAtYear = allPaths.map(function(p) { return p[y] || 0; }).sort(function(a, b) { return a - b; });
                percentiles.p1.push(valuesAtYear[Math.floor(valuesAtYear.length * 0.01)]);
                percentiles.p5.push(valuesAtYear[Math.floor(valuesAtYear.length * 0.05)]);
                percentiles.p25.push(valuesAtYear[Math.floor(valuesAtYear.length * 0.25)]);
                percentiles.p50.push(valuesAtYear[Math.floor(valuesAtYear.length * 0.5)]);
                percentiles.p75.push(valuesAtYear[Math.floor(valuesAtYear.length * 0.75)]);
                percentiles.p95.push(valuesAtYear[Math.floor(valuesAtYear.length * 0.95)]);
            }
            
            document.getElementById('fireSimHeader').style.display = 'block';
            document.getElementById('fireSimPlaceholder').style.display = 'none';
            document.getElementById('fireSimLegend').style.display = 'flex';
            
            var statusText = successRate >= 80 ? '<strong style="color:#34d399">excelentes</strong>' : 
                            successRate >= 60 ? '<strong style="color:#38bdf8">boas</strong>' : 
                            successRate >= 40 ? '<strong style="color:#fbbf24">razoáveis</strong>' : 
                            '<strong style="color:#f87171">arriscadas</strong>';
            
            document.getElementById('fireSuccessRate').textContent = successRate.toFixed(2) + '%';
            document.getElementById('fireSuccessRate').style.color = successRate >= 80 ? '#34d399' : successRate >= 60 ? '#38bdf8' : successRate >= 40 ? '#fbbf24' : '#f87171';
            document.getElementById('fireStatusText').innerHTML = 'Suas chances estão ' + statusText + '. Em <strong style="color:#fff">' + Math.round(successRate) + '%</strong> das <strong style="color:#fff">' + iterations + '</strong> simulações, seu patrimônio durou até o final do período.';
            
            var legendHTML = '\
                <div style="display:flex;align-items:center;gap:0.4rem"><span style="width:12px;height:12px;border-radius:50%;background:#34d399"></span><span style="color:var(--text-secondary)">Sobrou Bastante</span><strong style="color:#fff">' + ((categories.largeSurplus/iterations)*100).toFixed(1) + '%</strong><span style="color:var(--text-muted)">' + categories.largeSurplus + ' sim.</span></div>\
                <div style="display:flex;align-items:center;gap:0.4rem"><span style="width:12px;height:12px;border-radius:50%;background:#38bdf8"></span><span style="color:var(--text-secondary)">Tranquilo</span><strong style="color:#fff">' + ((categories.comfortable/iterations)*100).toFixed(1) + '%</strong><span style="color:var(--text-muted)">' + categories.comfortable + ' sim.</span></div>\
                <div style="display:flex;align-items:center;gap:0.4rem"><span style="width:12px;height:12px;border-radius:50%;background:#fbbf24"></span><span style="color:var(--text-secondary)">Apertado</span><strong style="color:#fff">' + ((categories.barelyMade/iterations)*100).toFixed(1) + '%</strong><span style="color:var(--text-muted)">' + categories.barelyMade + ' sim.</span></div>\
                <div style="display:flex;align-items:center;gap:0.4rem"><span style="width:12px;height:12px;border-radius:50%;background:#fb923c"></span><span style="color:var(--text-secondary)">Quase Lá</span><strong style="color:#fff">' + ((categories.almostMade/iterations)*100).toFixed(1) + '%</strong><span style="color:var(--text-muted)">' + categories.almostMade + ' sim.</span></div>\
                <div style="display:flex;align-items:center;gap:0.4rem"><span style="width:12px;height:12px;border-radius:50%;background:#f87171"></span><span style="color:var(--text-secondary)">Não Chegou</span><strong style="color:#fff">' + ((categories.failed/iterations)*100).toFixed(1) + '%</strong><span style="color:var(--text-muted)">' + categories.failed + ' sim.</span></div>';
            document.getElementById('fireLegendCategories').innerHTML = legendHTML;
            
            SimulationsModule.renderFireDonut(categories, iterations);
            SimulationsModule.renderFirePercentileChart(percentiles, currentAge, totalYears, yearsToRetire);
            
            var legendLine = '\
                <span style="display:inline-flex;align-items:center;gap:0.5rem;font-size:0.8rem"><span style="width:20px;height:3px;background:#38bdf8;border-radius:2px"></span> Topo 25%</span>\
                <span style="display:inline-flex;align-items:center;gap:0.5rem;font-size:0.8rem"><span style="width:20px;height:3px;background:#34d399;border-radius:2px"></span> Mediana</span>\
                <span style="display:inline-flex;align-items:center;gap:0.5rem;font-size:0.8rem"><span style="width:20px;height:3px;background:#fbbf24;border-radius:2px"></span> Base 25%</span>\
                <span style="display:inline-flex;align-items:center;gap:0.5rem;font-size:0.8rem"><span style="width:20px;height:3px;background:#fb923c;border-radius:2px"></span> Base 5%</span>\
                <span style="display:inline-flex;align-items:center;gap:0.5rem;font-size:0.8rem"><span style="width:20px;height:3px;background:#f87171;border-radius:2px"></span> Base 1%</span>';
            document.getElementById('fireSimLegend').innerHTML = legendLine;
            
        }, 50);
    },
    
    renderFireDonut: function(categories, total) {
        var canvas = document.getElementById('fireDonutChart');
        if (!canvas) return;
        
        var ctx = canvas.getContext('2d');
        var size = 140;
        var centerX = size / 2;
        var centerY = size / 2;
        var radius = 55;
        var lineWidth = 12;
        
        ctx.clearRect(0, 0, size, size);
        
        var data = [
            { value: categories.largeSurplus, color: '#34d399' },
            { value: categories.comfortable, color: '#38bdf8' },
            { value: categories.barelyMade, color: '#fbbf24' },
            { value: categories.almostMade, color: '#fb923c' },
            { value: categories.failed, color: '#f87171' }
        ];
        
        var startAngle = -Math.PI / 2;
        for (var i = 0; i < data.length; i++) {
            var sliceAngle = (data[i].value / total) * 2 * Math.PI;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.strokeStyle = data[i].color;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'butt';
            ctx.stroke();
            startAngle += sliceAngle;
        }
    },
    
    renderFirePercentileChart: function(percentiles, startAge, totalYears, yearsToRetire) {
        var canvas = document.getElementById('fireSimChart');
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
        
        var maxVal = Math.max.apply(null, percentiles.p95) * 1.1 || 1000000;
        
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        for (var i = 0; i <= 5; i++) {
            var y = padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();
            
            var val = maxVal - (maxVal / 5) * i;
            ctx.fillStyle = '#64748b';
            ctx.font = '11px system-ui';
            ctx.textAlign = 'right';
            ctx.fillText(Atlas.formatCompact(val), padding.left - 10, y + 4);
        }
        
        function getY(val) {
            return padding.top + chartHeight - (val / maxVal) * chartHeight;
        }
        function getX(yearIndex) {
            return padding.left + (chartWidth / totalYears) * yearIndex;
        }
        
        function fillBand(upper, lower, color) {
            ctx.beginPath();
            ctx.moveTo(getX(0), getY(upper[0]));
            for (var i = 1; i <= totalYears; i++) {
                ctx.lineTo(getX(i), getY(upper[i]));
            }
            for (var i = totalYears; i >= 0; i--) {
                ctx.lineTo(getX(i), getY(lower[i]));
            }
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        }
        
        fillBand(percentiles.p95, percentiles.p75, 'rgba(56, 189, 248, 0.15)');
        fillBand(percentiles.p75, percentiles.p50, 'rgba(56, 189, 248, 0.1)');
        fillBand(percentiles.p50, percentiles.p25, 'rgba(251, 191, 36, 0.1)');
        fillBand(percentiles.p25, percentiles.p5, 'rgba(251, 146, 60, 0.1)');
        fillBand(percentiles.p5, percentiles.p1, 'rgba(248, 113, 113, 0.1)');
        
        function drawLine(data, color, lineW) {
            ctx.strokeStyle = color;
            ctx.lineWidth = lineW || 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            for (var i = 0; i <= totalYears; i++) {
                var x = getX(i);
                var y = getY(data[i]);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        
        drawLine(percentiles.p75, '#38bdf8', 2);
        drawLine(percentiles.p50, '#34d399', 3);
        drawLine(percentiles.p25, '#fbbf24', 2);
        drawLine(percentiles.p5, '#fb923c', 2);
        drawLine(percentiles.p1, '#f87171', 2);
        
        if (yearsToRetire > 0 && yearsToRetire < totalYears) {
            var retireX = getX(yearsToRetire);
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.setLineDash([5, 5]);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(retireX, padding.top);
            ctx.lineTo(retireX, padding.top + chartHeight);
            ctx.stroke();
            ctx.setLineDash([]);
            
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = '10px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText('Aposentadoria', retireX, padding.top - 10);
        }
        
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px system-ui';
        ctx.textAlign = 'center';
        
        var step = Math.max(1, Math.ceil(totalYears / 8));
        for (var y = 0; y <= totalYears; y += step) {
            var x = getX(y);
            var age = startAge + y;
            ctx.fillText(age + ' anos', x, height - padding.bottom + 20);
        }
        
        ctx.fillStyle = '#64748b';
        ctx.font = '12px system-ui';
        ctx.fillText('Idade', padding.left + chartWidth / 2, height - 8);
        
        ctx.save();
        ctx.translate(15, padding.top + chartHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText('Patrimônio Líquido', 0, 0);
        ctx.restore();
    },
    
    showDCF: function() {
        var html = '\
            <div class="panel" style="margin-top:1.5rem">\
                <div class="panel-header">\
                    <span class="panel-title">Fluxo de Caixa Descontado (DCF)</span>\
                    <button class="btn btn-sm btn-secondary" onclick="document.getElementById(\'simResultPanel\').innerHTML=\'\'">Fechar</button>\
                </div>\
                <div class="panel-body">\
                    <div class="form-grid" style="grid-template-columns:repeat(5,1fr);gap:1rem;margin-bottom:1.5rem">\
                        <div class="form-group">\
                            <label class="form-label">Investimento Inicial</label>\
                            <input type="text" class="form-input" id="dcfInvestment" value="500000">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Fluxo de Caixa Ano 1</label>\
                            <input type="text" class="form-input" id="dcfCashflow" value="50000">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Taxa de Crescimento (%)</label>\
                            <input type="number" class="form-input" id="dcfGrowth" value="8" step="0.5">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Taxa de Desconto (%)</label>\
                            <input type="number" class="form-input" id="dcfDiscount" value="12" step="0.5">\
                        </div>\
                        <div class="form-group">\
                            <label class="form-label">Anos de Projeção</label>\
                            <input type="number" class="form-input" id="dcfYears" value="20" min="5" max="30">\
                        </div>\
                    </div>\
                    <div style="text-align:center;margin-bottom:1.5rem">\
                        <button class="btn btn-primary btn-lg" onclick="SimulationsModule.runDCF()" style="padding:0.75rem 3rem">\
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;margin-right:0.5rem;vertical-align:middle"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>\
                            Calcular DCF\
                        </button>\
                    </div>\
                    <div id="dcfStats" style="display:none">\
                        <div class="stats-grid" style="margin-bottom:1.5rem">\
                            <div class="stat-card">\
                                <div class="stat-label">Valor Presente Líquido (VPL)</div>\
                                <div class="stat-value" id="dcfNPV" style="color:#fbbf24">-</div>\
                            </div>\
                            <div class="stat-card">\
                                <div class="stat-label">VP dos Fluxos</div>\
                                <div class="stat-value text-accent" id="dcfPVFlows">-</div>\
                            </div>\
                            <div class="stat-card">\
                                <div class="stat-label">Payback</div>\
                                <div class="stat-value text-success" id="dcfPayback">-</div>\
                            </div>\
                            <div class="stat-card">\
                                <div class="stat-label">ROI Total</div>\
                                <div class="stat-value" id="dcfROI">-</div>\
                            </div>\
                        </div>\
                    </div>\
                    <div style="position:relative;height:380px;border-radius:var(--radius);padding:1rem;background:var(--bg-tertiary)">\
                        <canvas id="dcfChart"></canvas>\
                        <div id="dcfChartPlaceholder" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;color:var(--text-muted)">\
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:48px;height:48px;margin-bottom:1rem;opacity:0.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>\
                            <p style="font-weight:600">Configure os parâmetros e clique em Calcular</p>\
                        </div>\
                    </div>\
                    <div id="dcfLegend" style="display:none;margin-top:1rem;text-align:center;padding:0.75rem;background:var(--bg-tertiary);border-radius:var(--radius)">\
                        <span style="display:inline-flex;align-items:center;gap:0.5rem;margin:0 1.5rem;font-size:0.85rem">\
                            <span style="width:16px;height:16px;background:linear-gradient(180deg,#6366f1,#4338ca);border-radius:2px;border:1px solid rgba(255,255,255,0.3)"></span> Fluxo de Caixa Líquido\
                        </span>\
                        <span style="display:inline-flex;align-items:center;gap:0.5rem;margin:0 1.5rem;font-size:0.85rem">\
                            <span style="width:16px;height:16px;background:linear-gradient(180deg,#ec4899,#be185d);border-radius:2px;border:1px solid rgba(255,255,255,0.3)"></span> Fluxo de Caixa Acumulado\
                        </span>\
                    </div>\
                </div>\
            </div>';
        document.getElementById('simResultPanel').innerHTML = html;
    },
    
    runDCF: function() {
        var investment = SimulationsModule.parseValue(document.getElementById('dcfInvestment').value);
        var cashflow = SimulationsModule.parseValue(document.getElementById('dcfCashflow').value);
        var growth = parseFloat(document.getElementById('dcfGrowth').value) / 100;
        var discount = parseFloat(document.getElementById('dcfDiscount').value) / 100;
        var years = parseInt(document.getElementById('dcfYears').value);
        
        var netCashFlows = [];
        var cumulativeCashFlows = [];
        var pvCashflows = 0;
        var cf = cashflow;
        var cumulative = -investment;
        var paybackYear = -1;
        
        netCashFlows.push(-investment);
        cumulativeCashFlows.push(cumulative);
        
        for (var y = 1; y <= years; y++) {
            if (y > 1) cf = cf * (1 + growth);
            netCashFlows.push(cf);
            cumulative += cf;
            cumulativeCashFlows.push(cumulative);
            pvCashflows += cf / Math.pow(1 + discount, y);
            
            if (paybackYear < 0 && cumulative >= 0) {
                paybackYear = y;
            }
        }
        
        var npv = pvCashflows - investment;
        var totalReturn = cumulative;
        var roi = ((totalReturn + investment) / investment - 1) * 100;
        
        document.getElementById('dcfStats').style.display = 'block';
        document.getElementById('dcfChartPlaceholder').style.display = 'none';
        document.getElementById('dcfLegend').style.display = 'block';
        
        document.getElementById('dcfNPV').textContent = Atlas.formatCurrency(npv);
        document.getElementById('dcfNPV').style.color = npv >= 0 ? '#34d399' : '#f87171';
        document.getElementById('dcfPVFlows').textContent = Atlas.formatCurrency(pvCashflows);
        document.getElementById('dcfPayback').textContent = paybackYear > 0 ? paybackYear + ' anos' : '>' + years + ' anos';
        document.getElementById('dcfROI').textContent = roi.toFixed(1) + '%';
        document.getElementById('dcfROI').style.color = roi >= 0 ? '#34d399' : '#f87171';
        
        SimulationsModule.renderDCFChart(netCashFlows, cumulativeCashFlows, years);
    },
    
    renderDCFChart: function(netCashFlows, cumulativeCashFlows, years) {
        var canvas = document.getElementById('dcfChart');
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
        var padding = { top: 50, right: 40, bottom: 60, left: 80 };
        var chartWidth = width - padding.left - padding.right;
        var chartHeight = height - padding.top - padding.bottom;
        
        ctx.clearRect(0, 0, width, height);
        
        var allValues = netCashFlows.concat(cumulativeCashFlows);
        var maxVal = Math.max.apply(null, allValues) * 1.15;
        var minVal = Math.min.apply(null, allValues) * 1.15;
        var range = maxVal - minVal;
        
        function getY(val) {
            return padding.top + chartHeight - ((val - minVal) / range) * chartHeight;
        }
        
        var zeroY = getY(0);
        
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        var gridSteps = 6;
        for (var i = 0; i <= gridSteps; i++) {
            var val = minVal + (range / gridSteps) * i;
            var y = getY(val);
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();
            
            ctx.fillStyle = '#64748b';
            ctx.font = '11px system-ui';
            ctx.textAlign = 'right';
            var label = val >= 0 ? Atlas.formatCompact(val) : '(' + Atlas.formatCompact(Math.abs(val)) + ')';
            ctx.fillText(label, padding.left - 10, y + 4);
        }
        
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding.left, zeroY);
        ctx.lineTo(width - padding.right, zeroY);
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Projeto - ' + years + ' Anos de Fluxo de Caixa', width / 2, 25);
        
        var totalBars = netCashFlows.length;
        var groupWidth = chartWidth / totalBars;
        var barWidth = Math.min(groupWidth * 0.35, 30);
        var gap = barWidth * 0.3;
        
        for (var i = 0; i < totalBars; i++) {
            var groupX = padding.left + groupWidth * i + groupWidth / 2;
            
            var netVal = netCashFlows[i];
            var netBarHeight = Math.abs((netVal / range) * chartHeight);
            var netY = netVal >= 0 ? zeroY - netBarHeight : zeroY;
            
            var netGrad = ctx.createLinearGradient(0, netY, 0, netY + netBarHeight);
            if (netVal >= 0) {
                netGrad.addColorStop(0, '#818cf8');
                netGrad.addColorStop(1, '#6366f1');
            } else {
                netGrad.addColorStop(0, '#a5b4fc');
                netGrad.addColorStop(1, '#818cf8');
            }
            
            ctx.fillStyle = netGrad;
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.rect(groupX - barWidth - gap/2, netY, barWidth, netBarHeight);
            ctx.fill();
            ctx.stroke();
            
            var cumVal = cumulativeCashFlows[i];
            var cumBarHeight = Math.abs((cumVal / range) * chartHeight);
            var cumY = cumVal >= 0 ? zeroY - cumBarHeight : zeroY;
            
            var cumGrad = ctx.createLinearGradient(0, cumY, 0, cumY + cumBarHeight);
            if (cumVal >= 0) {
                cumGrad.addColorStop(0, '#f472b6');
                cumGrad.addColorStop(1, '#ec4899');
            } else {
                cumGrad.addColorStop(0, '#fda4af');
                cumGrad.addColorStop(1, '#fb7185');
            }
            
            ctx.fillStyle = cumGrad;
            ctx.beginPath();
            ctx.rect(groupX + gap/2, cumY, barWidth, cumBarHeight);
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = '#94a3b8';
            ctx.font = '10px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(i, groupX, height - padding.bottom + 20);
        }
        
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 12px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Ano', padding.left + chartWidth / 2, height - 15);
        
        ctx.save();
        ctx.translate(25, padding.top + chartHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText('R$', 0, 0);
        ctx.restore();
    },
    
    showStress: function() {
        var fire = AtlasState.get('fire') || {};
        var cashflow = AtlasState.get('cashflow') || {};
        var incomes = cashflow.incomes || [];
        var expenses = cashflow.expenses || [];
        var monthlyIncome = 0, monthlyExpense = 0;
        for (var i = 0; i < incomes.length; i++) monthlyIncome += incomes[i].value || 0;
        for (var i = 0; i < expenses.length; i++) monthlyExpense += expenses[i].value || 0;
        
        var html = '\
            <div class="panel" style="margin-top:1.5rem">\
                <div class="panel-header">\
                    <span class="panel-title">Teste de Estresse</span>\
                    <button class="btn btn-sm btn-secondary" onclick="document.getElementById(\'simResultPanel\').innerHTML=\'\'">Fechar</button>\
                </div>\
                <div class="panel-body">\
                    <div class="grid-2">\
                        <div>\
                            <div class="form-group"><label class="form-label">Reserva de Emergência</label>\
                            <input type="text" class="form-input" id="stressSavings" value="' + (fire.savings || 50000) + '"></div>\
                            <div class="form-group"><label class="form-label">Despesas Mensais</label>\
                            <input type="text" class="form-input" id="stressExpenses" value="' + (monthlyExpense || 8000) + '"></div>\
                            <div class="form-group"><label class="form-label">Redução de Renda (%)</label>\
                            <input type="number" class="form-input" id="stressReduction" value="50" min="0" max="100"></div>\
                            <div class="form-group"><label class="form-label">Renda Atual</label>\
                            <input type="text" class="form-input" id="stressIncome" value="' + (monthlyIncome || 15000) + '"></div>\
                            <button class="btn btn-primary" onclick="SimulationsModule.runStress()">Simular Crise</button>\
                        </div>\
                        <div id="stressResults" style="display:flex;flex-direction:column;gap:1rem"></div>\
                    </div>\
                    <div style="height:250px;margin-top:1.5rem;padding:1rem">\
                        <canvas id="stressChart"></canvas>\
                    </div>\
                </div>\
            </div>';
        document.getElementById('simResultPanel').innerHTML = html;
    },
    
    runStress: function() {
        var savings = SimulationsModule.parseValue(document.getElementById('stressSavings').value);
        var expenses = SimulationsModule.parseValue(document.getElementById('stressExpenses').value);
        var reduction = parseFloat(document.getElementById('stressReduction').value) / 100;
        var income = SimulationsModule.parseValue(document.getElementById('stressIncome').value);
        
        var newIncome = income * (1 - reduction);
        var monthlyDeficit = expenses - newIncome;
        var survivalMonths = monthlyDeficit > 0 ? Math.floor(savings / monthlyDeficit) : 999;
        
        var path = [];
        var balance = savings;
        for (var m = 0; m <= Math.min(survivalMonths + 6, 36); m++) {
            path.push(balance);
            balance = Math.max(0, balance + newIncome - expenses);
        }
        
        var statusColor = survivalMonths >= 12 ? '#34d399' : survivalMonths >= 6 ? '#fbbf24' : '#f87171';
        var statusText = survivalMonths >= 12 ? 'Resistente' : survivalMonths >= 6 ? 'Moderado' : 'Vulnerável';
        
        var html = '\
            <div style="background:linear-gradient(135deg,rgba(248,113,113,0.1),rgba(239,68,68,0.1));border:1px solid rgba(248,113,113,0.2);border-radius:var(--radius);padding:1.5rem;text-align:center;margin-bottom:1rem">\
                <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.5rem">MESES DE SOBREVIVÊNCIA</div>\
                <div style="font-size:2.5rem;font-weight:700;color:' + statusColor + '">' + (survivalMonths > 36 ? '36+' : survivalMonths) + '</div>\
                <div style="font-size:0.85rem;color:var(--text-secondary)">' + statusText + '</div>\
            </div>\
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">\
                <div style="padding:1rem;background:var(--bg-tertiary);border-radius:var(--radius);text-align:center">\
                    <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:0.25rem">NOVA RENDA</div>\
                    <div style="font-size:1rem;font-weight:600;color:#fbbf24">' + Atlas.formatCurrency(newIncome) + '</div>\
                </div>\
                <div style="padding:1rem;background:var(--bg-tertiary);border-radius:var(--radius);text-align:center">\
                    <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:0.25rem">DÉFICIT MENSAL</div>\
                    <div style="font-size:1rem;font-weight:600;color:#f87171">' + Atlas.formatCurrency(monthlyDeficit > 0 ? monthlyDeficit : 0) + '</div>\
                </div>\
            </div>';
        document.getElementById('stressResults').innerHTML = html;
        
        SimulationsModule.renderStressChart(path, survivalMonths);
    },
    
    renderStressChart: function(path, survivalMonths) {
        var canvas = document.getElementById('stressChart');
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
        
        var maxVal = Math.max.apply(null, path) * 1.1 || 1;
        
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        for (var i = 0; i <= 5; i++) {
            var y = padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();
            
            var val = maxVal - (maxVal / 5) * i;
            ctx.fillStyle = '#64748b';
            ctx.font = '11px system-ui';
            ctx.textAlign = 'right';
            ctx.fillText(Atlas.formatCompact(val), padding.left - 10, y + 4);
        }
        
        var points = [];
        for (var i = 0; i < path.length; i++) {
            var x = padding.left + (chartWidth / Math.max(path.length - 1, 1)) * i;
            var y = padding.top + chartHeight - (path[i] / maxVal) * chartHeight;
            points.push({ x: x, y: y });
        }
        
        var gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        gradient.addColorStop(0, 'rgba(248, 113, 113, 0.4)');
        gradient.addColorStop(1, 'rgba(248, 113, 113, 0)');
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, padding.top + chartHeight);
        for (var i = 0; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        for (var i = 0; i < points.length; i++) {
            if (i === 0) ctx.moveTo(points[i].x, points[i].y);
            else ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px system-ui';
        ctx.textAlign = 'center';
        var step = Math.ceil(path.length / 6);
        for (var i = 0; i < path.length; i += step) {
            ctx.fillText('Mês ' + i, points[i].x, height - padding.bottom + 20);
        }
        
        if (survivalMonths < path.length - 1) {
            var depleteX = padding.left + (chartWidth / Math.max(path.length - 1, 1)) * survivalMonths;
            ctx.strokeStyle = '#f87171';
            ctx.setLineDash([5, 5]);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(depleteX, padding.top);
            ctx.lineTo(depleteX, padding.top + chartHeight);
            ctx.stroke();
            ctx.setLineDash([]);
            
            ctx.fillStyle = '#f87171';
            ctx.font = 'bold 11px system-ui';
            ctx.fillText('Esgotamento', depleteX, padding.top - 10);
        }
    },
    
    init: function() {}
};

AtlasRouter.register('simulations', SimulationsModule);