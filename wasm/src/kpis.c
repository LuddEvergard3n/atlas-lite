/**
 * ATLAS v4.0 - KPIs Engine (WebAssembly)
 * Cálculo de indicadores executivos
 * Compile: emcc kpis.c -o ../scripts/wasm/kpis-engine.js -O3 -s WASM=1 -s EXPORTED_FUNCTIONS="[...]" -s EXPORTED_RUNTIME_METHODS="['cwrap']"
 */

#include <emscripten.h>
#include <math.h>
#include <stdlib.h>

// ============================================
// Estrutura de KPIs
// ============================================

typedef struct {
    double liquidity_ratio;      // Meses de cobertura
    double savings_rate;         // Taxa de poupança %
    double operating_margin;     // Margem operacional %
    double fire_progress;        // Progresso FIRE %
    double net_worth_growth;     // Crescimento patrimonial %
    double expense_ratio;        // Índice de despesas %
    double goals_completion;     // Conclusão de metas %
    double runway_months;        // Meses de sobrevivência
    double overall_score;        // Score geral 0-100
} kpi_results;

static kpi_results kpis;

// ============================================
// Cálculo Individual de KPIs
// ============================================

// Índice de Liquidez: patrimônio / despesas mensais
EMSCRIPTEN_KEEPALIVE
double calc_liquidity_ratio(double savings, double monthly_expenses) {
    if (monthly_expenses <= 0) return 999.0;
    kpis.liquidity_ratio = savings / monthly_expenses;
    return kpis.liquidity_ratio;
}

// Taxa de Poupança: (receita - despesa) / receita * 100
EMSCRIPTEN_KEEPALIVE
double calc_savings_rate(double income, double expenses) {
    if (income <= 0) return 0.0;
    kpis.savings_rate = ((income - expenses) / income) * 100.0;
    return kpis.savings_rate;
}

// Margem Operacional: (receita - despesa) / receita * 100
EMSCRIPTEN_KEEPALIVE
double calc_operating_margin(double income, double expenses) {
    if (income <= 0) return 0.0;
    kpis.operating_margin = ((income - expenses) / income) * 100.0;
    return kpis.operating_margin;
}

// Progresso FIRE: patrimônio atual / meta FIRE * 100
EMSCRIPTEN_KEEPALIVE
double calc_fire_progress(double savings, double monthly_expenses, double withdrawal_rate) {
    if (withdrawal_rate <= 0) withdrawal_rate = 4.0;
    double fire_target = (monthly_expenses * 12.0) / (withdrawal_rate / 100.0);
    if (fire_target <= 0) return 0.0;
    kpis.fire_progress = (savings / fire_target) * 100.0;
    return kpis.fire_progress;
}

// Crescimento Patrimonial Mensal: (aporte + rendimento) / patrimônio * 100
EMSCRIPTEN_KEEPALIVE
double calc_net_worth_growth(double savings, double monthly_contribution, double annual_return) {
    if (savings <= 0) return 0.0;
    double monthly_return = annual_return / 12.0;
    double growth = monthly_contribution + (savings * monthly_return);
    kpis.net_worth_growth = (growth / savings) * 100.0;
    return kpis.net_worth_growth;
}

// Índice de Despesas: despesas / receita * 100
EMSCRIPTEN_KEEPALIVE
double calc_expense_ratio(double income, double expenses) {
    if (income <= 0) return 100.0;
    kpis.expense_ratio = (expenses / income) * 100.0;
    return kpis.expense_ratio;
}

// Conclusão de Metas: metas_completas / total_metas * 100
EMSCRIPTEN_KEEPALIVE
double calc_goals_completion(int completed_goals, int total_goals) {
    if (total_goals <= 0) return 0.0;
    kpis.goals_completion = ((double)completed_goals / (double)total_goals) * 100.0;
    return kpis.goals_completion;
}

// Runway: patrimônio / despesas mensais
EMSCRIPTEN_KEEPALIVE
double calc_runway(double savings, double monthly_expenses) {
    if (monthly_expenses <= 0) return 999.0;
    kpis.runway_months = savings / monthly_expenses;
    return kpis.runway_months;
}

// ============================================
// Cálculo Completo de Todos os KPIs
// ============================================

EMSCRIPTEN_KEEPALIVE
void calculate_all_kpis(
    double income,
    double expenses,
    double savings,
    double monthly_contribution,
    double annual_return,
    double withdrawal_rate,
    int completed_goals,
    int total_goals
) {
    // Calcula todos os KPIs
    calc_liquidity_ratio(savings, expenses);
    calc_savings_rate(income, expenses);
    calc_operating_margin(income, expenses);
    calc_fire_progress(savings, expenses, withdrawal_rate);
    calc_net_worth_growth(savings, monthly_contribution, annual_return);
    calc_expense_ratio(income, expenses);
    calc_goals_completion(completed_goals, total_goals);
    calc_runway(savings, expenses);
    
    // Calcula score geral ponderado
    calculate_overall_score();
}

// ============================================
// Score Geral
// ============================================

// Normaliza valor para 0-100 baseado em target
static double normalize_score(double value, double target, double max_bonus) {
    if (target <= 0) return 50.0;
    double ratio = value / target;
    if (ratio >= 1.0) {
        // Acima do target: bonus até max_bonus
        return 100.0 + (ratio - 1.0) * max_bonus;
    }
    return ratio * 100.0;
}

// Classifica KPI em nível (0=danger, 1=warning, 2=good, 3=excellent)
EMSCRIPTEN_KEEPALIVE
int get_kpi_level(int kpi_type, double value) {
    switch (kpi_type) {
        case 0: // liquidity_ratio (target: 6 meses)
            if (value >= 12) return 3;
            if (value >= 6) return 2;
            if (value >= 3) return 1;
            return 0;
            
        case 1: // savings_rate (target: 30%)
            if (value >= 40) return 3;
            if (value >= 25) return 2;
            if (value >= 10) return 1;
            return 0;
            
        case 2: // operating_margin (target: 25%)
            if (value >= 35) return 3;
            if (value >= 20) return 2;
            if (value >= 5) return 1;
            return 0;
            
        case 3: // fire_progress (target: 100%)
            if (value >= 100) return 3;
            if (value >= 75) return 2;
            if (value >= 50) return 1;
            return 0;
            
        case 4: // net_worth_growth (target: 2%)
            if (value >= 3) return 3;
            if (value >= 1.5) return 2;
            if (value >= 0.5) return 1;
            return 0;
            
        case 5: // expense_ratio (target: 70% - INVERSO)
            if (value <= 50) return 3;
            if (value <= 70) return 2;
            if (value <= 90) return 1;
            return 0;
            
        case 6: // goals_completion (target: 80%)
            if (value >= 80) return 3;
            if (value >= 50) return 2;
            if (value >= 25) return 1;
            return 0;
            
        case 7: // runway_months (target: 12)
            if (value >= 24) return 3;
            if (value >= 12) return 2;
            if (value >= 6) return 1;
            return 0;
    }
    return 0;
}

EMSCRIPTEN_KEEPALIVE
void calculate_overall_score() {
    // Pesos por categoria
    const double weights[8] = {
        0.15,  // liquidity
        0.15,  // savings
        0.10,  // margin
        0.15,  // fire
        0.10,  // growth
        0.10,  // expenses
        0.10,  // goals
        0.15   // runway
    };
    
    // Targets
    const double targets[8] = {6.0, 30.0, 25.0, 100.0, 2.0, 70.0, 80.0, 12.0};
    
    // Valores atuais
    double values[8] = {
        kpis.liquidity_ratio,
        kpis.savings_rate,
        kpis.operating_margin,
        kpis.fire_progress,
        kpis.net_worth_growth,
        kpis.expense_ratio,
        kpis.goals_completion,
        kpis.runway_months
    };
    
    double total_score = 0.0;
    
    for (int i = 0; i < 8; i++) {
        double normalized;
        
        if (i == 5) {
            // Expense ratio é inverso (menor é melhor)
            normalized = (values[i] <= targets[i]) ? 100.0 : 
                         (200.0 - (values[i] / targets[i]) * 100.0);
            if (normalized < 0) normalized = 0;
        } else {
            normalized = normalize_score(values[i], targets[i], 50.0);
        }
        
        // Cap em 150 para não distorcer muito
        if (normalized > 150.0) normalized = 150.0;
        
        total_score += normalized * weights[i];
    }
    
    // Normaliza para 0-100
    kpis.overall_score = total_score;
    if (kpis.overall_score > 100.0) kpis.overall_score = 100.0;
    if (kpis.overall_score < 0.0) kpis.overall_score = 0.0;
}

// ============================================
// Getters
// ============================================

EMSCRIPTEN_KEEPALIVE double get_liquidity_ratio() { return kpis.liquidity_ratio; }
EMSCRIPTEN_KEEPALIVE double get_savings_rate() { return kpis.savings_rate; }
EMSCRIPTEN_KEEPALIVE double get_operating_margin() { return kpis.operating_margin; }
EMSCRIPTEN_KEEPALIVE double get_fire_progress() { return kpis.fire_progress; }
EMSCRIPTEN_KEEPALIVE double get_net_worth_growth() { return kpis.net_worth_growth; }
EMSCRIPTEN_KEEPALIVE double get_expense_ratio() { return kpis.expense_ratio; }
EMSCRIPTEN_KEEPALIVE double get_goals_completion() { return kpis.goals_completion; }
EMSCRIPTEN_KEEPALIVE double get_runway_months() { return kpis.runway_months; }
EMSCRIPTEN_KEEPALIVE double get_overall_score() { return kpis.overall_score; }

// Classifica score geral (0=danger, 1=warning, 2=good, 3=excellent)
EMSCRIPTEN_KEEPALIVE
int get_overall_level() {
    if (kpis.overall_score >= 80) return 3;
    if (kpis.overall_score >= 60) return 2;
    if (kpis.overall_score >= 40) return 1;
    return 0;
}

// ============================================
// Análise de Tendência
// ============================================

// Calcula variação percentual entre dois períodos
EMSCRIPTEN_KEEPALIVE
double calc_kpi_change(double current, double previous) {
    if (previous == 0.0) return (current > 0) ? 100.0 : 0.0;
    return ((current - previous) / fabs(previous)) * 100.0;
}

// Determina direção da tendência (-1=queda, 0=estável, 1=subida)
EMSCRIPTEN_KEEPALIVE
int get_trend_direction(double change_percent) {
    if (change_percent > 5.0) return 1;   // Subindo
    if (change_percent < -5.0) return -1; // Caindo
    return 0; // Estável
}

// ============================================
// Benchmark/Comparação
// ============================================

// Compara KPI com benchmark e retorna percentual relativo
EMSCRIPTEN_KEEPALIVE
double compare_to_benchmark(double value, double benchmark) {
    if (benchmark == 0.0) return 0.0;
    return (value / benchmark) * 100.0;
}

// Calcula gap para atingir target
EMSCRIPTEN_KEEPALIVE
double calc_gap_to_target(double current, double target) {
    return target - current;
}

// Estima meses para atingir target baseado em taxa de crescimento
EMSCRIPTEN_KEEPALIVE
int months_to_target(double current, double target, double monthly_growth_rate) {
    if (monthly_growth_rate <= 0) return -1;
    if (current >= target) return 0;
    
    // target = current * (1 + rate)^n
    // n = log(target/current) / log(1 + rate)
    double ratio = target / current;
    double months = log(ratio) / log(1.0 + monthly_growth_rate);
    
    return (int)ceil(months);
}