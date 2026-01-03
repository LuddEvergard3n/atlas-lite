const CompareModule = (function() {
    'use strict';
    const t = key => AtlasRouter.t(key);
    
    let investments = [];
    
    function render() {
        return `
            <h1 class="page-title">Comparador de Investimentos</h1>
            <p class="page-subtitle">Compare diferentes cenários de investimento</p>
            
            <div class="panel mb-3">
                <div class="panel-header"><span class="panel-title">Adicionar Investimento</span></div>
                <div class="panel-body">
                    <div class="compare-form">
                        <div class="form-group">
                            <label class="form-label">Nome</label>
                            <input type="text" class="form-input" id="compName" placeholder="Ex: Tesouro Selic">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Valor Inicial</label>
                            <input type="text" class="form-input" id="compInitial" placeholder="Ex: 10000">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Taxa Anual (%)</label>
                            <input type="number" class="form-input" id="compRate" placeholder="Ex: 12" step="0.1">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Período (anos)</label>
                            <input type="number" class="form-input" id="compPeriod" placeholder="Ex: 5" min="1">
                        </div>
                        <div class="form-group" style="display:flex;align-items:flex-end">
                            <button class="btn btn-primary" onclick="CompareModule.add()">Adicionar</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="panel mb-3">
                <div class="panel-header"><span class="panel-title">Resultados</span></div>
                <div class="panel-body" id="compareTable">
                    <p class="text-muted">Adicione investimentos para comparar</p>
                </div>
            </div>
            
            <div class="panel">
                <div class="panel-header"><span class="panel-title">Evolução do Patrimônio</span></div>
                <div class="panel-body">
                    <div class="chart-container">
                        <canvas id="compareChart"></canvas>
                    </div>
                </div>
            </div>
        `;
    }
    
    function parseValue(str) {
        if (!str) return 0;
        str = String(str).replace(/[R$\s]/g, '').trim();
        const multipliers = { k: 1000, m: 1000000, b: 1000000000 };
        const match = str.match(/^([\d.,]+)\s*([kmb])?$/i);
        if (match) {
            let num = match[1].replace(/\./g, '').replace(',', '.');
            num = parseFloat(num) || 0;
            if (match[2]) num *= multipliers[match[2].toLowerCase()];
            return num;
        }
        return parseFloat(str.replace(/[^\d.-]/g, '')) || 0;
    }
    
    function add() {
        const name = document.getElementById('compName').value.trim() || 'Investimento ' + (investments.length + 1);
        const initial = parseValue(document.getElementById('compInitial').value);
        const rate = parseFloat(document.getElementById('compRate').value) || 0;
        const period = parseInt(document.getElementById('compPeriod').value) || 1;
        
        if (initial <= 0) {
            if (window.AtlasModal) {
                AtlasModal.alert('Informe um valor inicial válido.', 'Atenção');
            } else {
                alert('Informe um valor inicial válido.');
            }
            return;
        }
        
        const monthlyRate = rate / 100 / 12;
        const months = period * 12;
        let final = initial;
        for (let i = 0; i < months; i++) {
            final *= (1 + monthlyRate);
        }
        
        investments.push({ name, initial, rate, period, final });
        
        // Clear inputs
        document.getElementById('compName').value = '';
        document.getElementById('compInitial').value = '';
        document.getElementById('compRate').value = '';
        document.getElementById('compPeriod').value = '';
        
        renderTable();
        renderChart();
    }
    
    function remove(index) {
        investments.splice(index, 1);
        renderTable();
        renderChart();
    }
    
    function renderTable() {
        const container = document.getElementById('compareTable');
        if (!container) return;
        
        if (investments.length === 0) {
            container.innerHTML = '<p class="text-muted">Adicione investimentos para comparar</p>';
            return;
        }
        
        const best = Math.max(...investments.map(i => i.final));
        
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Valor Inicial</th>
                        <th>Taxa</th>
                        <th>Período</th>
                        <th>Valor Final</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${investments.map((inv, i) => `
                        <tr>
                            <td>${inv.name}</td>
                            <td>${Atlas.formatCurrency(inv.initial)}</td>
                            <td>${inv.rate}%</td>
                            <td>${inv.period} anos</td>
                            <td class="text-success">${Atlas.formatCurrency(inv.final)} ${inv.final === best ? '<span class="badge badge-sm" style="background:#34d399;color:#0a0f1a">Melhor</span>' : ''}</td>
                            <td><button class="btn btn-secondary btn-sm" onclick="CompareModule.remove(${i})">&times;</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    function renderChart() {
        const canvas = document.getElementById('compareChart');
        if (!canvas || investments.length === 0) {
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            return;
        }
        
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = 300 * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = '300px';
        ctx.scale(dpr, dpr);
        
        const width = rect.width;
        const height = 300;
        const padding = { top: 40, right: 20, bottom: 40, left: 80 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        
        ctx.clearRect(0, 0, width, height);
        
        // Generate data series
        const maxPeriod = Math.max(...investments.map(i => i.period));
        const series = investments.map(inv => {
            const data = [inv.initial];
            const monthlyRate = inv.rate / 100 / 12;
            let balance = inv.initial;
            for (let y = 1; y <= maxPeriod; y++) {
                for (let m = 0; m < 12; m++) {
                    balance *= (1 + monthlyRate);
                }
                data.push(balance);
            }
            return data;
        });
        
        const allValues = series.flat();
        const maxVal = Math.max(...allValues) * 1.1;
        const minVal = 0;
        const range = maxVal - minVal || 1;
        
        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();
            
            const val = maxVal - (range / 5) * i;
            ctx.fillStyle = '#64748b';
            ctx.font = '11px system-ui';
            ctx.textAlign = 'right';
            ctx.fillText(Atlas.formatCompact(val), padding.left - 10, y + 4);
        }
        
        // Draw lines
        const colors = ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa'];
        
        series.forEach((data, idx) => {
            ctx.strokeStyle = colors[idx % colors.length];
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            data.forEach((val, i) => {
                const x = padding.left + (chartWidth / Math.max(data.length - 1, 1)) * i;
                const y = padding.top + chartHeight - ((val - minVal) / range) * chartHeight;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
        });
        
        // Legend
        ctx.font = '12px system-ui';
        let legendX = padding.left;
        investments.forEach((inv, i) => {
            ctx.fillStyle = colors[i % colors.length];
            ctx.fillRect(legendX, 10, 12, 12);
            ctx.fillStyle = '#e8ecf4';
            ctx.textAlign = 'left';
            ctx.fillText(inv.name, legendX + 18, 20);
            legendX += ctx.measureText(inv.name).width + 40;
        });
        
        // X labels
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';
        for (let i = 0; i <= maxPeriod; i++) {
            const x = padding.left + (chartWidth / maxPeriod) * i;
            ctx.fillText(i + 'a', x, height - 10);
        }
    }
    
    function init() {
        renderTable();
    }
    
    AtlasRouter.register('compare', { render, init });
    window.CompareModule = { render, init, add, remove };
    return { render, init, add, remove };
})();