// Scenarios Module - ATLAS v3.0 Professional
// Modais nativos, gráficos grandes e profissionais
var ScenariosModule = {
    render: function() {
        var scenarios = AtlasState.get('scenarios') || [];
        
        return '\
            <h1 class="page-title">Cenários Financeiros</h1>\
            <p class="page-subtitle">Compare diferentes cenários para tomada de decisão</p>\
            \
            <div class="panel" style="margin-bottom:1rem">\
                <div class="panel-header"><span class="panel-title">Criar Novo Cenário</span></div>\
                <div class="panel-body">\
                    <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:0.75rem;align-items:flex-end">\
                        <div class="form-group" style="margin-bottom:0">\
                            <label class="form-label">Nome do Cenário</label>\
                            <input type="text" class="form-input" id="scenarioName" placeholder="Ex: Cenário Otimista">\
                        </div>\
                        <div class="form-group" style="margin-bottom:0">\
                            <label class="form-label">Receita Mensal</label>\
                            <input type="text" class="form-input" id="scenarioIncome" placeholder="Ex: 20K">\
                        </div>\
                        <div class="form-group" style="margin-bottom:0">\
                            <label class="form-label">Despesa Mensal</label>\
                            <input type="text" class="form-input" id="scenarioExpense" placeholder="Ex: 12K">\
                        </div>\
                        <div class="form-group" style="margin-bottom:0">\
                            <label class="form-label">Crescimento (%/ano)</label>\
                            <input type="number" class="form-input" id="scenarioGrowth" value="10" step="0.5">\
                        </div>\
                        <button class="btn btn-primary" onclick="ScenariosModule.addScenario()">Adicionar</button>\
                    </div>\
                </div>\
            </div>\
            \
            ' + (scenarios.length > 0 ? '\
            <div class="panel" style="margin-bottom:1rem">\
                <div class="panel-header"><span class="panel-title">Comparativo de Cenários (5 anos)</span></div>\
                <div class="panel-body">\
                    <div style="height:400px;padding:0.5rem">\
                        <canvas id="scenariosChart"></canvas>\
                    </div>\
                </div>\
            </div>' : '') + '\
            \
            <div class="panel">\
                <div class="panel-header"><span class="panel-title">Cenários Cadastrados (' + scenarios.length + ')</span></div>\
                <div class="panel-body">\
                    ' + ScenariosModule.renderScenarios(scenarios) + '\
                </div>\
            </div>\
        ';
    },
    
    renderScenarios: function(scenarios) {
        if (scenarios.length === 0) {
            return '<div style="text-align:center;padding:3rem;color:var(--text-muted)">\
                <p>Nenhum cenário cadastrado.</p>\
                <p style="font-size:0.85rem;margin-top:0.5rem">Crie seu primeiro cenário usando o formulário acima.</p>\
            </div>';
        }
        
        var html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1rem">';
        
        for (var i = 0; i < scenarios.length; i++) {
            var s = scenarios[i];
            var result = s.income - s.expense;
            var margin = s.income > 0 ? (result / s.income) * 100 : 0;
            var annual = result * 12;
            
            // Projeção 5 anos com crescimento
            var projected5y = 0;
            var yearlyResult = annual;
            for (var y = 0; y < 5; y++) {
                projected5y += yearlyResult;
                yearlyResult *= (1 + (s.growth || 10) / 100);
            }
            
            html += '\
                <div style="background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem">\
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid var(--border)">\
                        <h3 style="font-size:1.1rem;font-weight:600;margin:0">' + s.name + '</h3>\
                        <button onclick="ScenariosModule.deleteScenario(' + s.id + ')" style="width:28px;height:28px;border:1px solid var(--border);background:transparent;border-radius:var(--radius);color:var(--text-muted);cursor:pointer;font-size:1rem" onmouseover="this.style.borderColor=\'#f87171\';this.style.color=\'#f87171\'" onmouseout="this.style.borderColor=\'var(--border)\';this.style.color=\'var(--text-muted)\'">×</button>\
                    </div>\
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem">\
                        <div>\
                            <div style="font-size:0.7rem;color:var(--text-muted)">Receita</div>\
                            <div style="font-size:0.95rem;font-weight:600;color:#34d399">' + Atlas.formatCurrency(s.income) + '</div>\
                        </div>\
                        <div>\
                            <div style="font-size:0.7rem;color:var(--text-muted)">Despesa</div>\
                            <div style="font-size:0.95rem;font-weight:600;color:#f87171">' + Atlas.formatCurrency(s.expense) + '</div>\
                        </div>\
                        <div>\
                            <div style="font-size:0.7rem;color:var(--text-muted)">Resultado</div>\
                            <div style="font-size:0.95rem;font-weight:600;color:' + (result >= 0 ? '#34d399' : '#f87171') + '">' + Atlas.formatCurrency(result) + '</div>\
                        </div>\
                        <div>\
                            <div style="font-size:0.7rem;color:var(--text-muted)">Margem</div>\
                            <div style="font-size:0.95rem;font-weight:600">' + margin.toFixed(1) + '%</div>\
                        </div>\
                    </div>\
                    <div style="padding:0.75rem;background:var(--bg-secondary);border-radius:var(--radius);text-align:center">\
                        <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:0.25rem">Projeção 5 anos (' + (s.growth || 10) + '% a.a.)</div>\
                        <div style="font-size:1.25rem;font-weight:700;color:#38bdf8">' + Atlas.formatCurrency(projected5y) + '</div>\
                    </div>\
                </div>';
        }
        
        html += '</div>';
        return html;
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
        str = str.replace(/\./g, '').replace(',', '.');
        return parseFloat(str) || 0;
    },
    
    addScenario: function() {
        var name = document.getElementById('scenarioName').value.trim();
        var income = ScenariosModule.parseValue(document.getElementById('scenarioIncome').value);
        var expense = ScenariosModule.parseValue(document.getElementById('scenarioExpense').value);
        var growth = parseFloat(document.getElementById('scenarioGrowth').value) || 10;
        
        if (!name) {
            AtlasModal.alert('Informe o nome do cenário.', 'Campo Obrigatório');
            return;
        }
        if (income <= 0) {
            AtlasModal.alert('Informe uma receita válida.', 'Valor Inválido');
            return;
        }
        
        var scenarios = AtlasState.get('scenarios') || [];
        scenarios.push({
            id: Date.now(),
            name: name,
            income: income,
            expense: expense,
            growth: growth
        });
        
        AtlasState.set('scenarios', scenarios);
        AtlasRouter.navigate('scenarios');
    },
    
    deleteScenario: function(id) {
        var scenarios = AtlasState.get('scenarios') || [];
        var scenario = null;
        for (var i = 0; i < scenarios.length; i++) {
            if (scenarios[i].id === id) {
                scenario = scenarios[i];
                break;
            }
        }
        if (!scenario) return;
        
        AtlasModal.confirmDelete(scenario.name, function() {
            var newScenarios = [];
            for (var i = 0; i < scenarios.length; i++) {
                if (scenarios[i].id !== id) newScenarios.push(scenarios[i]);
            }
            AtlasState.set('scenarios', newScenarios);
            AtlasRouter.navigate('scenarios');
        });
    },
    
    renderChart: function() {
        var canvas = document.getElementById('scenariosChart');
        if (!canvas) return;
        
        var scenarios = AtlasState.get('scenarios') || [];
        if (scenarios.length === 0) return;
        
        var parent = canvas.parentElement;
        if (!parent) return;
        
        var ctx = canvas.getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        
        // Força dimensões se parent não tiver tamanho ainda
        var width = parent.offsetWidth || 600;
        var height = parent.offsetHeight || 400;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);
        
        var padding = { top: 40, right: 40, bottom: 70, left: 90 };
        var chartWidth = width - padding.left - padding.right;
        var chartHeight = height - padding.top - padding.bottom;
        
        ctx.clearRect(0, 0, width, height);
        
        var years = 5;
        var allData = [];
        var colors = ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#818cf8', '#fb923c'];
        
        // Calcular dados para cada cenário
        for (var s = 0; s < scenarios.length; s++) {
            var scen = scenarios[s];
            var data = [];
            var balance = 0;
            var annual = (scen.income - scen.expense) * 12;
            
            for (var y = 0; y <= years; y++) {
                data.push(balance);
                balance += annual;
                annual *= (1 + (scen.growth || 10) / 100);
            }
            allData.push({ name: scen.name, data: data, color: colors[s % colors.length] });
        }
        
        // Encontrar max
        var maxVal = 0;
        for (var s = 0; s < allData.length; s++) {
            for (var y = 0; y < allData[s].data.length; y++) {
                if (allData[s].data[y] > maxVal) maxVal = allData[s].data[y];
            }
        }
        maxVal = maxVal * 1.1 || 1;
        
        // Grid
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
            ctx.font = '12px system-ui';
            ctx.textAlign = 'right';
            ctx.fillText(Atlas.formatCompact(val), padding.left - 15, y + 4);
        }
        
        // Linhas dos cenários
        for (var s = 0; s < allData.length; s++) {
            var scen = allData[s];
            
            // Área preenchida
            ctx.beginPath();
            for (var y = 0; y < scen.data.length; y++) {
                var x = padding.left + (chartWidth / years) * y;
                var yPos = padding.top + chartHeight - (scen.data[y] / maxVal) * chartHeight;
                if (y === 0) ctx.moveTo(x, yPos);
                else ctx.lineTo(x, yPos);
            }
            ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
            ctx.lineTo(padding.left, padding.top + chartHeight);
            ctx.closePath();
            ctx.fillStyle = scen.color + '15';
            ctx.fill();
            
            // Linha
            ctx.strokeStyle = scen.color;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            
            for (var y = 0; y < scen.data.length; y++) {
                var x = padding.left + (chartWidth / years) * y;
                var yPos = padding.top + chartHeight - (scen.data[y] / maxVal) * chartHeight;
                if (y === 0) ctx.moveTo(x, yPos);
                else ctx.lineTo(x, yPos);
            }
            ctx.stroke();
            
            // Pontos
            ctx.fillStyle = scen.color;
            for (var y = 0; y < scen.data.length; y++) {
                var x = padding.left + (chartWidth / years) * y;
                var yPos = padding.top + chartHeight - (scen.data[y] / maxVal) * chartHeight;
                ctx.beginPath();
                ctx.arc(x, yPos, 6, 0, Math.PI * 2);
                ctx.fill();
                
                // Ponto interno branco
                ctx.fillStyle = '#0f172a';
                ctx.beginPath();
                ctx.arc(x, yPos, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = scen.color;
            }
        }
        
        // Labels eixo X
        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px system-ui';
        ctx.textAlign = 'center';
        for (var y = 0; y <= years; y++) {
            var x = padding.left + (chartWidth / years) * y;
            ctx.fillText('Ano ' + y, x, height - padding.bottom + 30);
        }
        
        // Legenda
        var legendY = height - 20;
        var legendX = padding.left;
        ctx.font = '12px system-ui';
        
        for (var s = 0; s < allData.length; s++) {
            var scen = allData[s];
            
            // Linha da legenda
            ctx.strokeStyle = scen.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(legendX, legendY);
            ctx.lineTo(legendX + 20, legendY);
            ctx.stroke();
            
            // Ponto
            ctx.fillStyle = scen.color;
            ctx.beginPath();
            ctx.arc(legendX + 10, legendY, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Texto
            ctx.fillStyle = '#94a3b8';
            ctx.textAlign = 'left';
            ctx.fillText(scen.name, legendX + 28, legendY + 4);
            
            legendX += ctx.measureText(scen.name).width + 50;
        }
        
        // Título do gráfico
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px system-ui';
        ctx.textAlign = 'left';
        ctx.fillText('Projeção de Patrimônio Acumulado', padding.left, 25);
    },
    
    init: function() {
        // Tenta renderizar várias vezes para garantir que o canvas existe
        var attempts = 0;
        var tryRender = function() {
            var canvas = document.getElementById('scenariosChart');
            if (canvas && canvas.parentElement) {
                ScenariosModule.renderChart();
            } else if (attempts < 10) {
                attempts++;
                setTimeout(tryRender, 100);
            }
        };
        setTimeout(tryRender, 100);
        
        window.addEventListener('resize', function() {
            clearTimeout(ScenariosModule.resizeTimeout);
            ScenariosModule.resizeTimeout = setTimeout(function() {
                ScenariosModule.renderChart();
            }, 250);
        });
    }
};

AtlasRouter.register('scenarios', ScenariosModule);