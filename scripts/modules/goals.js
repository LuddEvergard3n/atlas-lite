// Goals Module - ATLAS v5.0 Professional
// Sistema completo de metas com etapas/milestones
var GoalsModule = {
    
    render: function() {
        var goals = AtlasState.get('goals') || [];
        var active = goals.filter(function(g) { return !g.completed; });
        var completed = goals.filter(function(g) { return g.completed; });
        
        // Calcula estatísticas
        var totalSteps = 0, completedSteps = 0, totalValue = 0, currentValue = 0;
        for (var i = 0; i < goals.length; i++) {
            var g = goals[i];
            totalValue += g.target || 0;
            currentValue += g.current || 0;
            var steps = g.steps || [];
            totalSteps += steps.length;
            for (var j = 0; j < steps.length; j++) {
                if (steps[j].completed) completedSteps++;
            }
        }
        
        return '<h1 class="page-title">Metas Estratégicas</h1>' +
            '<p class="page-subtitle">Defina e acompanhe seus objetivos com etapas detalhadas</p>' +
            
            '<div class="stats-grid">' +
                '<div class="stat-card">' +
                    '<div class="stat-label">METAS ATIVAS</div>' +
                    '<div class="stat-value text-accent">' + active.length + '</div>' +
                '</div>' +
                '<div class="stat-card">' +
                    '<div class="stat-label">CONCLUÍDAS</div>' +
                    '<div class="stat-value text-success">' + completed.length + '</div>' +
                '</div>' +
                '<div class="stat-card">' +
                    '<div class="stat-label">ETAPAS CONCLUÍDAS</div>' +
                    '<div class="stat-value text-warning">' + completedSteps + '/' + totalSteps + '</div>' +
                '</div>' +
                '<div class="stat-card">' +
                    '<div class="stat-label">VALOR TOTAL</div>' +
                    '<div class="stat-value">' + Atlas.formatCurrency(currentValue) + ' / ' + Atlas.formatCurrency(totalValue) + '</div>' +
                '</div>' +
            '</div>' +
            
            '<div class="panel">' +
                '<div class="panel-header"><span class="panel-title">Nova Meta</span></div>' +
                '<div class="panel-body">' +
                    '<div class="form-grid">' +
                        '<div class="form-group">' +
                            '<label class="form-label">Nome da Meta *</label>' +
                            '<input type="text" class="form-input" id="goalName" placeholder="Ex: Reserva de emergência">' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="form-label">Tipo</label>' +
                            '<select class="form-input" id="goalType">' +
                                '<option value="financial">Financeira</option>' +
                                '<option value="strategic">Estratégica</option>' +
                                '<option value="growth">Crescimento</option>' +
                                '<option value="investment">Investimento</option>' +
                                '<option value="debt">Quitação de Dívida</option>' +
                                '<option value="savings">Poupança</option>' +
                            '</select>' +
                        '</div>' +
                        '<div class="form-group" style="grid-column: span 2">' +
                            '<label class="form-label">Descrição</label>' +
                            '<textarea class="form-input" id="goalDescription" rows="2" placeholder="Descreva o objetivo desta meta..."></textarea>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="form-label">Valor Alvo *</label>' +
                            '<input type="text" class="form-input" id="goalTarget" placeholder="100000">' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="form-label">Valor Atual</label>' +
                            '<input type="text" class="form-input" id="goalCurrent" placeholder="0">' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="form-label">Prazo</label>' +
                            '<input type="date" class="form-input" id="goalDeadline">' +
                        '</div>' +
                        '<div class="form-group" style="display:flex;align-items:flex-end">' +
                            '<button class="btn btn-primary" style="width:100%" onclick="GoalsModule.add()">Criar Meta</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            
            '<div class="panel">' +
                '<div class="panel-header"><span class="panel-title">Metas Ativas (' + active.length + ')</span></div>' +
                '<div class="panel-body">' +
                    (active.length === 0 ? this.renderEmpty() : this.renderGoals(active, false)) +
                '</div>' +
            '</div>' +
            
            (completed.length > 0 ? 
            '<div class="panel">' +
                '<div class="panel-header"><span class="panel-title" style="color:var(--success)">Concluídas (' + completed.length + ')</span></div>' +
                '<div class="panel-body">' + this.renderGoals(completed, true) + '</div>' +
            '</div>' : '') +
            
            '<div id="goalModal" style="display:none;"></div>';
    },
    
    renderEmpty: function() {
        return '<div class="empty-state">' +
            '<div class="empty-state-icon">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
                    '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>' +
                '</svg>' +
            '</div>' +
            '<div class="empty-state-title">Nenhuma meta cadastrada</div>' +
            '<p class="empty-state-text">Crie sua primeira meta estratégica acima.</p>' +
        '</div>';
    },
    
    renderGoals: function(goals, isCompleted) {
        var self = this;
        var html = '<div class="goals-list">';
        
        for (var i = 0; i < goals.length; i++) {
            var g = goals[i];
            var steps = g.steps || [];
            var completedStepsCount = 0;
            for (var j = 0; j < steps.length; j++) {
                if (steps[j].completed) completedStepsCount++;
            }
            
            // Calcula progresso
            var pct;
            if (steps.length > 0) {
                pct = (completedStepsCount / steps.length) * 100;
            } else {
                pct = g.target > 0 ? Math.min(100, ((g.current || 0) / g.target) * 100) : 0;
            }
            
            var typeColors = { 
                financial: '#38bdf8', strategic: '#818cf8', growth: '#34d399',
                investment: '#fbbf24', debt: '#f87171', savings: '#22d3ee'
            };
            var typeLabels = { 
                financial: 'Financeira', strategic: 'Estratégica', growth: 'Crescimento',
                investment: 'Investimento', debt: 'Dívida', savings: 'Poupança'
            };
            var color = typeColors[g.type] || '#38bdf8';
            var typeLabel = typeLabels[g.type] || g.type;
            
            // Steps HTML
            var stepsHtml = '';
            if (steps.length > 0) {
                stepsHtml = '<div class="goal-steps">';
                for (var k = 0; k < steps.length; k++) {
                    var step = steps[k];
                    stepsHtml += '<div class="goal-step ' + (step.completed ? 'completed' : '') + '">' +
                        '<label class="step-checkbox">' +
                            '<input type="checkbox" ' + (step.completed ? 'checked' : '') + ' ' +
                                (isCompleted ? 'disabled' : 'onchange="GoalsModule.toggleStep(' + g.id + ',' + k + ')"') + '>' +
                            '<span class="step-check"></span>' +
                        '</label>' +
                        '<div class="step-content">' +
                            '<span class="step-name">' + self.escapeHtml(step.name) + '</span>' +
                            (step.description ? '<span class="step-desc">' + self.escapeHtml(step.description) + '</span>' : '') +
                        '</div>' +
                        (!isCompleted ? '<div class="step-actions">' +
                            '<button class="btn-icon small" onclick="GoalsModule.editStep(' + g.id + ',' + k + ')" title="Editar">' +
                                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
                            '</button>' +
                            '<button class="btn-icon small danger" onclick="GoalsModule.deleteStep(' + g.id + ',' + k + ')" title="Excluir">' +
                                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
                            '</button>' +
                        '</div>' : '') +
                    '</div>';
                }
                stepsHtml += '</div>';
            }
            
            html += '<div class="goal-card-expanded ' + (isCompleted ? 'completed' : '') + '">' +
                '<div class="goal-main">' +
                    '<div class="goal-header">' +
                        '<div class="goal-title-area">' +
                            '<span class="goal-name">' + self.escapeHtml(g.name) + '</span>' +
                            '<span class="badge" style="background:' + color + '">' + typeLabel + '</span>' +
                        '</div>' +
                        '<div class="goal-actions">' +
                            (!isCompleted ? 
                            '<button class="btn-icon" onclick="GoalsModule.addStepModal(' + g.id + ')" title="Adicionar Etapa">' +
                                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
                            '</button>' +
                            '<button class="btn-icon" onclick="GoalsModule.edit(' + g.id + ')" title="Editar">' +
                                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
                            '</button>' +
                            '<button class="btn-icon success" onclick="GoalsModule.complete(' + g.id + ')" title="Concluir">' +
                                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' +
                            '</button>' :
                            '<button class="btn-icon" onclick="GoalsModule.reopen(' + g.id + ')" title="Reabrir">' +
                                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2.5 2v6h6M21.5 22v-6h-6"/><path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2"/></svg>' +
                            '</button>') +
                            '<button class="btn-icon danger" onclick="GoalsModule.delete(' + g.id + ')" title="Excluir">' +
                                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                    (g.description ? '<p class="goal-description">' + self.escapeHtml(g.description) + '</p>' : '') +
                    '<div class="goal-values">' +
                        '<span class="goal-current">' + Atlas.formatCurrency(g.current || 0) + '</span>' +
                        '<span class="goal-separator">/</span>' +
                        '<span class="goal-target">' + Atlas.formatCurrency(g.target) + '</span>' +
                    '</div>' +
                    '<div class="goal-progress-area">' +
                        '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%;background:' + color + '"></div></div>' +
                        '<div class="goal-progress-info">' +
                            '<span class="goal-percent">' + pct.toFixed(1) + '%</span>' +
                            (steps.length > 0 ? '<span class="goal-steps-count">' + completedStepsCount + '/' + steps.length + ' etapas</span>' : '') +
                            (g.deadline ? '<span class="goal-deadline">' + self.formatDate(g.deadline) + '</span>' : '') +
                        '</div>' +
                    '</div>' +
                '</div>' +
                stepsHtml +
            '</div>';
        }
        
        html += '</div>';
        return html;
    },
    
    escapeHtml: function(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },
    
    formatDate: function(dateStr) {
        if (!dateStr) return '';
        var d = new Date(dateStr);
        return d.toLocaleDateString('pt-BR');
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
    
    add: function() {
        var name = document.getElementById('goalName').value.trim();
        var type = document.getElementById('goalType').value;
        var description = document.getElementById('goalDescription').value.trim();
        var target = this.parseValue(document.getElementById('goalTarget').value);
        var current = this.parseValue(document.getElementById('goalCurrent').value);
        var deadline = document.getElementById('goalDeadline').value;
        
        if (!name) { AtlasModal.alert('Informe o nome da meta.'); return; }
        if (target <= 0) { AtlasModal.alert('Informe um valor alvo válido.'); return; }
        
        var goals = AtlasState.get('goals') || [];
        goals.push({
            id: Date.now(),
            name: name,
            type: type,
            description: description,
            target: target,
            current: current,
            deadline: deadline,
            steps: [],
            completed: false,
            createdAt: new Date().toISOString()
        });
        
        AtlasState.set('goals', goals);
        AtlasRouter.refresh();
    },
    
    edit: function(id) {
        var goals = AtlasState.get('goals') || [];
        var goal = null;
        for (var i = 0; i < goals.length; i++) {
            if (goals[i].id === id) { goal = goals[i]; break; }
        }
        if (!goal) return;
        
        var modal = document.getElementById('goalModal');
        if (!modal) { console.error('Modal not found'); return; }
        
        modal.innerHTML = '<div style="background:#1e293b;border:1px solid #334155;border-radius:8px;width:100%;max-width:500px;max-height:90vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,0.5);">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;padding:1rem 1.25rem;border-bottom:1px solid #334155;">' +
                '<h3 style="font-size:1.1rem;font-weight:600;color:#f1f5f9;margin:0;">Editar Meta</h3>' +
                '<button style="background:none;border:none;font-size:1.5rem;color:#94a3b8;cursor:pointer;" onclick="GoalsModule.closeModal()">&times;</button>' +
            '</div>' +
            '<div style="padding:1.25rem;">' +
                '<div class="form-group">' +
                    '<label class="form-label">Nome *</label>' +
                    '<input type="text" class="form-input" id="editGoalName" value="' + this.escapeHtml(goal.name) + '">' +
                '</div>' +
                '<div class="form-group">' +
                    '<label class="form-label">Tipo</label>' +
                    '<select class="form-input" id="editGoalType">' +
                        '<option value="financial"' + (goal.type === 'financial' ? ' selected' : '') + '>Financeira</option>' +
                        '<option value="strategic"' + (goal.type === 'strategic' ? ' selected' : '') + '>Estratégica</option>' +
                        '<option value="growth"' + (goal.type === 'growth' ? ' selected' : '') + '>Crescimento</option>' +
                        '<option value="investment"' + (goal.type === 'investment' ? ' selected' : '') + '>Investimento</option>' +
                        '<option value="debt"' + (goal.type === 'debt' ? ' selected' : '') + '>Dívida</option>' +
                        '<option value="savings"' + (goal.type === 'savings' ? ' selected' : '') + '>Poupança</option>' +
                    '</select>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label class="form-label">Descrição</label>' +
                    '<textarea class="form-input" id="editGoalDescription" rows="2">' + this.escapeHtml(goal.description || '') + '</textarea>' +
                '</div>' +
                '<div class="form-row">' +
                    '<div class="form-group">' +
                        '<label class="form-label">Valor Alvo *</label>' +
                        '<input type="text" class="form-input" id="editGoalTarget" value="' + goal.target + '">' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label class="form-label">Valor Atual</label>' +
                        '<input type="text" class="form-input" id="editGoalCurrent" value="' + (goal.current || 0) + '">' +
                    '</div>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label class="form-label">Prazo</label>' +
                    '<input type="date" class="form-input" id="editGoalDeadline" value="' + (goal.deadline || '') + '">' +
                '</div>' +
            '</div>' +
            '<div style="display:flex;justify-content:flex-end;gap:0.75rem;padding:1rem 1.25rem;border-top:1px solid #334155;background:#0f172a;">' +
                '<button class="btn btn-secondary" onclick="GoalsModule.closeModal()">Cancelar</button>' +
                '<button class="btn btn-primary" onclick="GoalsModule.saveEdit(' + id + ')">Salvar</button>' +
            '</div>' +
        '</div>';
        
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:999999;padding:1rem;';
    },
    
    saveEdit: function(id) {
        var goals = AtlasState.get('goals') || [];
        var goal = null;
        for (var i = 0; i < goals.length; i++) {
            if (goals[i].id === id) { goal = goals[i]; break; }
        }
        if (!goal) return;
        
        var name = document.getElementById('editGoalName').value.trim();
        var target = this.parseValue(document.getElementById('editGoalTarget').value);
        
        if (!name) { AtlasModal.alert('Informe o nome da meta.'); return; }
        if (target <= 0) { AtlasModal.alert('Informe um valor alvo válido.'); return; }
        
        goal.name = name;
        goal.type = document.getElementById('editGoalType').value;
        goal.description = document.getElementById('editGoalDescription').value.trim();
        goal.target = target;
        goal.current = this.parseValue(document.getElementById('editGoalCurrent').value);
        goal.deadline = document.getElementById('editGoalDeadline').value;
        goal.updatedAt = new Date().toISOString();
        
        AtlasState.set('goals', goals);
        this.closeModal();
        AtlasRouter.refresh();
    },
    
    addStepModal: function(goalId) {
        var modal = document.getElementById('goalModal');
        if (!modal) { console.error('Modal not found'); return; }
        
        modal.innerHTML = '<div style="background:#1e293b;border:1px solid #334155;border-radius:8px;width:100%;max-width:500px;max-height:90vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,0.5);">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;padding:1rem 1.25rem;border-bottom:1px solid #334155;">' +
                '<h3 style="font-size:1.1rem;font-weight:600;color:#f1f5f9;margin:0;">Nova Etapa</h3>' +
                '<button style="background:none;border:none;font-size:1.5rem;color:#94a3b8;cursor:pointer;" onclick="GoalsModule.closeModal()">&times;</button>' +
            '</div>' +
            '<div style="padding:1.25rem;">' +
                '<div class="form-group">' +
                    '<label class="form-label">Nome da Etapa *</label>' +
                    '<input type="text" class="form-input" id="stepName" placeholder="Ex: Primeiro R$ 10.000">' +
                '</div>' +
                '<div class="form-group">' +
                    '<label class="form-label">Descrição (opcional)</label>' +
                    '<input type="text" class="form-input" id="stepDescription" placeholder="Detalhes da etapa...">' +
                '</div>' +
            '</div>' +
            '<div style="display:flex;justify-content:flex-end;gap:0.75rem;padding:1rem 1.25rem;border-top:1px solid #334155;background:#0f172a;">' +
                '<button class="btn btn-secondary" onclick="GoalsModule.closeModal()">Cancelar</button>' +
                '<button class="btn btn-primary" onclick="GoalsModule.addStep(' + goalId + ')">Adicionar</button>' +
            '</div>' +
        '</div>';
        
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:999999;padding:1rem;';
        
        setTimeout(function() {
            var input = document.getElementById('stepName');
            if (input) input.focus();
        }, 100);
    },
    
    addStep: function(goalId) {
        var nameEl = document.getElementById('stepName');
        var descEl = document.getElementById('stepDescription');
        if (!nameEl) return;
        
        var name = nameEl.value.trim();
        if (!name) { AtlasModal.alert('Informe o nome da etapa.'); return; }
        
        var goals = AtlasState.get('goals') || [];
        var goal = null;
        for (var i = 0; i < goals.length; i++) {
            if (goals[i].id === goalId) { goal = goals[i]; break; }
        }
        if (!goal) return;
        
        if (!goal.steps) goal.steps = [];
        goal.steps.push({
            id: Date.now(),
            name: name,
            description: descEl ? descEl.value.trim() : '',
            completed: false,
            createdAt: new Date().toISOString()
        });
        
        AtlasState.set('goals', goals);
        this.closeModal();
        AtlasRouter.refresh();
    },
    
    editStep: function(goalId, stepIndex) {
        var goals = AtlasState.get('goals') || [];
        var goal = null;
        for (var i = 0; i < goals.length; i++) {
            if (goals[i].id === goalId) { goal = goals[i]; break; }
        }
        if (!goal || !goal.steps || !goal.steps[stepIndex]) return;
        
        var step = goal.steps[stepIndex];
        var modal = document.getElementById('goalModal');
        if (!modal) return;
        
        modal.innerHTML = '<div style="background:#1e293b;border:1px solid #334155;border-radius:8px;width:100%;max-width:500px;max-height:90vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,0.5);">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;padding:1rem 1.25rem;border-bottom:1px solid #334155;">' +
                '<h3 style="font-size:1.1rem;font-weight:600;color:#f1f5f9;margin:0;">Editar Etapa</h3>' +
                '<button style="background:none;border:none;font-size:1.5rem;color:#94a3b8;cursor:pointer;" onclick="GoalsModule.closeModal()">&times;</button>' +
            '</div>' +
            '<div style="padding:1.25rem;">' +
                '<div class="form-group">' +
                    '<label class="form-label">Nome da Etapa *</label>' +
                    '<input type="text" class="form-input" id="editStepName" value="' + this.escapeHtml(step.name) + '">' +
                '</div>' +
                '<div class="form-group">' +
                    '<label class="form-label">Descrição</label>' +
                    '<input type="text" class="form-input" id="editStepDescription" value="' + this.escapeHtml(step.description || '') + '">' +
                '</div>' +
            '</div>' +
            '<div style="display:flex;justify-content:flex-end;gap:0.75rem;padding:1rem 1.25rem;border-top:1px solid #334155;background:#0f172a;">' +
                '<button class="btn btn-secondary" onclick="GoalsModule.closeModal()">Cancelar</button>' +
                '<button class="btn btn-primary" onclick="GoalsModule.saveStepEdit(' + goalId + ',' + stepIndex + ')">Salvar</button>' +
            '</div>' +
        '</div>';
        
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:999999;padding:1rem;';
    },
    
    saveStepEdit: function(goalId, stepIndex) {
        var nameEl = document.getElementById('editStepName');
        if (!nameEl) return;
        
        var name = nameEl.value.trim();
        if (!name) { AtlasModal.alert('Informe o nome da etapa.'); return; }
        
        var goals = AtlasState.get('goals') || [];
        var goal = null;
        for (var i = 0; i < goals.length; i++) {
            if (goals[i].id === goalId) { goal = goals[i]; break; }
        }
        if (!goal || !goal.steps || !goal.steps[stepIndex]) return;
        
        var descEl = document.getElementById('editStepDescription');
        goal.steps[stepIndex].name = name;
        goal.steps[stepIndex].description = descEl ? descEl.value.trim() : '';
        goal.steps[stepIndex].updatedAt = new Date().toISOString();
        
        AtlasState.set('goals', goals);
        this.closeModal();
        AtlasRouter.refresh();
    },
    
    deleteStep: function(goalId, stepIndex) {
        if (!confirm('Deseja excluir esta etapa?')) return;
        
        var goals = AtlasState.get('goals') || [];
        var goal = null;
        for (var i = 0; i < goals.length; i++) {
            if (goals[i].id === goalId) { goal = goals[i]; break; }
        }
        if (!goal || !goal.steps) return;
        
        goal.steps.splice(stepIndex, 1);
        AtlasState.set('goals', goals);
        AtlasRouter.refresh();
    },
    
    toggleStep: function(goalId, stepIndex) {
        var goals = AtlasState.get('goals') || [];
        var goal = null;
        for (var i = 0; i < goals.length; i++) {
            if (goals[i].id === goalId) { goal = goals[i]; break; }
        }
        if (!goal || !goal.steps || !goal.steps[stepIndex]) return;
        
        goal.steps[stepIndex].completed = !goal.steps[stepIndex].completed;
        if (goal.steps[stepIndex].completed) {
            goal.steps[stepIndex].completedAt = new Date().toISOString();
        } else {
            delete goal.steps[stepIndex].completedAt;
        }
        
        AtlasState.set('goals', goals);
        AtlasRouter.refresh();
    },
    
    complete: function(id) {
        if (!confirm('Marcar esta meta como concluída?')) return;
        
        var goals = AtlasState.get('goals') || [];
        var goal = null;
        for (var i = 0; i < goals.length; i++) {
            if (goals[i].id === id) { goal = goals[i]; break; }
        }
        if (!goal) return;
        
        goal.completed = true;
        goal.completedAt = new Date().toISOString();
        
        // Marca todas as etapas como concluídas
        if (goal.steps) {
            for (var j = 0; j < goal.steps.length; j++) {
                if (!goal.steps[j].completed) {
                    goal.steps[j].completed = true;
                    goal.steps[j].completedAt = new Date().toISOString();
                }
            }
        }
        
        AtlasState.set('goals', goals);
        AtlasRouter.refresh();
    },
    
    reopen: function(id) {
        if (!confirm('Reabrir esta meta?')) return;
        
        var goals = AtlasState.get('goals') || [];
        var goal = null;
        for (var i = 0; i < goals.length; i++) {
            if (goals[i].id === id) { goal = goals[i]; break; }
        }
        if (!goal) return;
        
        goal.completed = false;
        delete goal.completedAt;
        
        AtlasState.set('goals', goals);
        AtlasRouter.refresh();
    },
    
    delete: function(id) {
        if (!confirm('Deseja excluir esta meta e todas suas etapas?')) return;
        
        var goals = AtlasState.get('goals') || [];
        goals = goals.filter(function(g) { return g.id !== id; });
        AtlasState.set('goals', goals);
        AtlasRouter.refresh();
    },
    
    closeModal: function() {
        var modal = document.getElementById('goalModal');
        if (modal) {
            modal.style.cssText = 'display:none;';
            modal.innerHTML = '';
        }
    },
    
    init: function() {
        var self = this;
        // Fecha modal com ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') self.closeModal();
        });
        
        // Fecha modal clicando fora
        var modal = document.getElementById('goalModal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) self.closeModal();
            });
        }
    }
};

AtlasRouter.register('goals', GoalsModule);