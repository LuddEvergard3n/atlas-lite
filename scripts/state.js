/**
 * ATLAS Lite - Demo State (No Persistence)
 * Dados resetam ao recarregar a página
 */

var AtlasState = (function() {
    
    // Dados de demonstração pré-carregados
    var demoData = {
        // FIRE Calculator
        fire: {
            currentAge: 30,
            targetAge: 45,
            currentSavings: 150000,
            monthlyContribution: 3000,
            monthlyExpenses: 8000,
            expectedReturn: 8,
            inflationRate: 4,
            safeWithdrawalRate: 4
        },
        
        // Metas
        goals: [
            {
                id: 'goal-1',
                name: 'Reserva de Emergência',
                description: '6 meses de despesas',
                targetValue: 48000,
                currentValue: 35000,
                deadline: '2025-06-01',
                priority: 'alta',
                category: 'segurança',
                steps: [
                    { id: 's1', text: 'Definir valor mensal', completed: true },
                    { id: 's2', text: 'Automatizar transferência', completed: true },
                    { id: 's3', text: 'Atingir 50%', completed: true },
                    { id: 's4', text: 'Atingir 100%', completed: false }
                ],
                createdAt: '2024-01-15'
            },
            {
                id: 'goal-2',
                name: 'Viagem Internacional',
                description: 'Férias na Europa',
                targetValue: 25000,
                currentValue: 12500,
                deadline: '2025-12-01',
                priority: 'média',
                category: 'lazer',
                steps: [
                    { id: 's1', text: 'Pesquisar destinos', completed: true },
                    { id: 's2', text: 'Definir roteiro', completed: false },
                    { id: 's3', text: 'Reservar passagens', completed: false }
                ],
                createdAt: '2024-03-20'
            },
            {
                id: 'goal-3',
                name: 'Entrada Apartamento',
                description: '20% do valor do imóvel',
                targetValue: 120000,
                currentValue: 45000,
                deadline: '2027-01-01',
                priority: 'alta',
                category: 'patrimônio',
                steps: [
                    { id: 's1', text: 'Definir região', completed: true },
                    { id: 's2', text: 'Pesquisar imóveis', completed: false },
                    { id: 's3', text: 'Simular financiamento', completed: false },
                    { id: 's4', text: 'Juntar entrada', completed: false }
                ],
                createdAt: '2024-02-10'
            }
        ],
        
        // Cenários
        scenarios: [
            {
                id: 'scenario-1',
                name: 'Cenário Otimista',
                description: 'Promoção + aumento de 30%',
                type: 'otimista',
                assumptions: {
                    incomeChange: 30,
                    expenseChange: 10,
                    returnRate: 10
                },
                createdAt: '2024-06-01'
            },
            {
                id: 'scenario-2',
                name: 'Cenário Conservador',
                description: 'Mantém situação atual',
                type: 'conservador',
                assumptions: {
                    incomeChange: 0,
                    expenseChange: 5,
                    returnRate: 6
                },
                createdAt: '2024-06-01'
            },
            {
                id: 'scenario-3',
                name: 'Cenário Pessimista',
                description: 'Perda de emprego por 6 meses',
                type: 'pessimista',
                assumptions: {
                    incomeChange: -50,
                    expenseChange: -20,
                    returnRate: 4
                },
                createdAt: '2024-06-01'
            }
        ],
        
        // Configurações
        settings: {
            theme: 'dark',
            currency: 'BRL',
            language: 'pt-BR',
            notifications: true
        },
        
        // Fluxo de caixa simplificado (para cálculos)
        cashflow: {
            incomes: [
                { id: 'i1', name: 'Salário', value: 12000, type: 'recorrente' },
                { id: 'i2', name: 'Freelance', value: 2000, type: 'variável' }
            ],
            expenses: [
                { id: 'e1', name: 'Aluguel', value: 2500, category: 'moradia' },
                { id: 'e2', name: 'Alimentação', value: 1500, category: 'essencial' },
                { id: 'e3', name: 'Transporte', value: 800, category: 'essencial' },
                { id: 'e4', name: 'Lazer', value: 1000, category: 'variável' },
                { id: 'e5', name: 'Outros', value: 1200, category: 'variável' }
            ]
        }
    };
    
    // Estado em memória (não persiste)
    var state = JSON.parse(JSON.stringify(demoData));
    
    return {
        get: function(key) {
            return state[key];
        },
        
        set: function(key, value) {
            state[key] = value;
            // Não persiste - é uma demo
        },
        
        remove: function(key) {
            delete state[key];
        },
        
        clear: function() {
            // Reseta para dados demo
            state = JSON.parse(JSON.stringify(demoData));
        },
        
        getAll: function() {
            return JSON.parse(JSON.stringify(state));
        },
        
        exportData: function() {
            return JSON.stringify(state, null, 2);
        },
        
        importData: function(json) {
            // Desabilitado na demo
            console.log('[Demo] Import desabilitado na versão de demonstração');
        },
        
        // Helpers para a demo
        isDemo: function() {
            return true;
        },
        
        resetDemo: function() {
            state = JSON.parse(JSON.stringify(demoData));
            console.log('[Demo] Dados resetados');
        }
    };
})();
