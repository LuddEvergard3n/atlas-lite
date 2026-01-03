/**
 * ATLAS v4.0 - Forecast Engine (WebAssembly)
 * Projeções financeiras e stress test
 * Compile: emcc forecast.c -o ../scripts/wasm/forecast-engine.js -O3 -s WASM=1 -s EXPORTED_FUNCTIONS="[...]" -s EXPORTED_RUNTIME_METHODS="['cwrap']"
 */

#include <emscripten.h>
#include <math.h>
#include <stdlib.h>
#include <string.h>

// ============================================
// Estruturas de resultado
// ============================================

typedef struct {
    double final_balance;
    double total_returns;
    double total_contributions;
    double cagr;
    double percent_growth;
} forecast_result;

typedef struct {
    double stressed_income;
    double stressed_expenses;
    double stressed_cashflow;
    double balance_impact;
    int runway_months;
} stress_result;

// Resultados globais (acessados via getters)
static forecast_result last_forecast;
static stress_result stress_results[4]; // mild, moderate, severe, extreme
static double* forecast_balances = NULL;
static int forecast_length = 0;

// ============================================
// Forecast - Projeção Patrimonial
// ============================================

EMSCRIPTEN_KEEPALIVE
void generate_forecast(
    double current_savings,
    double monthly_contribution,
    double annual_return,      // ex: 0.10 para 10%
    int months
) {
    // Libera memória anterior se existir
    if (forecast_balances != NULL) {
        free(forecast_balances);
    }
    
    // Aloca novo array
    forecast_balances = (double*)malloc(months * sizeof(double));
    forecast_length = months;
    
    double monthly_return = annual_return / 12.0;
    double balance = current_savings;
    double total_returns = 0.0;
    double total_contributions = 0.0;
    
    for (int m = 0; m < months; m++) {
        // Rendimento do mês
        double month_return = balance * monthly_return;
        total_returns += month_return;
        
        // Atualiza saldo
        balance = balance + month_return + monthly_contribution;
        total_contributions += monthly_contribution;
        
        // Armazena no array
        forecast_balances[m] = balance;
    }
    
    // Calcula métricas
    last_forecast.final_balance = balance;
    last_forecast.total_returns = total_returns;
    last_forecast.total_contributions = total_contributions;
    
    // Crescimento percentual
    if (current_savings > 0) {
        last_forecast.percent_growth = ((balance - current_savings) / current_savings) * 100.0;
    } else {
        last_forecast.percent_growth = 0.0;
    }
    
    // CAGR
    double years = months / 12.0;
    if (current_savings > 0 && years > 0) {
        last_forecast.cagr = (pow(balance / current_savings, 1.0 / years) - 1.0) * 100.0;
    } else {
        last_forecast.cagr = 0.0;
    }
}

// Getters para forecast
EMSCRIPTEN_KEEPALIVE double get_forecast_final_balance() { return last_forecast.final_balance; }
EMSCRIPTEN_KEEPALIVE double get_forecast_total_returns() { return last_forecast.total_returns; }
EMSCRIPTEN_KEEPALIVE double get_forecast_total_contributions() { return last_forecast.total_contributions; }
EMSCRIPTEN_KEEPALIVE double get_forecast_cagr() { return last_forecast.cagr; }
EMSCRIPTEN_KEEPALIVE double get_forecast_percent_growth() { return last_forecast.percent_growth; }
EMSCRIPTEN_KEEPALIVE int get_forecast_length() { return forecast_length; }

EMSCRIPTEN_KEEPALIVE
double get_forecast_balance_at(int month) {
    if (forecast_balances == NULL || month < 0 || month >= forecast_length) {
        return 0.0;
    }
    return forecast_balances[month];
}

// ============================================
// Stress Test
// ============================================

// Cenários de stress
// 0 = mild, 1 = moderate, 2 = severe, 3 = extreme
static const double INCOME_CHANGES[4] = {-0.10, -0.25, -0.40, -0.60};
static const double EXPENSE_CHANGES[4] = {0.05, 0.10, 0.15, 0.25};
static const double RETURN_CHANGES[4] = {-0.02, -0.05, -0.10, -0.15};

EMSCRIPTEN_KEEPALIVE
void run_stress_test(
    double current_income,
    double current_expenses,
    double current_savings,
    double annual_return,
    int months
) {
    for (int scenario = 0; scenario < 4; scenario++) {
        double stressed_income = current_income * (1.0 + INCOME_CHANGES[scenario]);
        double stressed_expenses = current_expenses * (1.0 + EXPENSE_CHANGES[scenario]);
        double stressed_return = annual_return + RETURN_CHANGES[scenario];
        double stressed_cashflow = stressed_income - stressed_expenses;
        
        // Calcula projeção base
        generate_forecast(current_savings, current_income - current_expenses, annual_return, months);
        double base_final = last_forecast.final_balance;
        
        // Calcula projeção estressada
        generate_forecast(current_savings, stressed_cashflow, stressed_return, months);
        double stressed_final = last_forecast.final_balance;
        
        // Calcula runway (meses até acabar dinheiro se cashflow negativo)
        int runway = -1;
        if (stressed_cashflow < 0 && current_savings > 0) {
            runway = (int)(current_savings / (-stressed_cashflow));
        }
        
        // Armazena resultados
        stress_results[scenario].stressed_income = stressed_income;
        stress_results[scenario].stressed_expenses = stressed_expenses;
        stress_results[scenario].stressed_cashflow = stressed_cashflow;
        stress_results[scenario].balance_impact = stressed_final - base_final;
        stress_results[scenario].runway_months = runway;
    }
}

// Getters para stress test (scenario: 0-3)
EMSCRIPTEN_KEEPALIVE double get_stress_income(int scenario) { 
    return (scenario >= 0 && scenario < 4) ? stress_results[scenario].stressed_income : 0.0; 
}
EMSCRIPTEN_KEEPALIVE double get_stress_expenses(int scenario) { 
    return (scenario >= 0 && scenario < 4) ? stress_results[scenario].stressed_expenses : 0.0; 
}
EMSCRIPTEN_KEEPALIVE double get_stress_cashflow(int scenario) { 
    return (scenario >= 0 && scenario < 4) ? stress_results[scenario].stressed_cashflow : 0.0; 
}
EMSCRIPTEN_KEEPALIVE double get_stress_impact(int scenario) { 
    return (scenario >= 0 && scenario < 4) ? stress_results[scenario].balance_impact : 0.0; 
}
EMSCRIPTEN_KEEPALIVE int get_stress_runway(int scenario) { 
    return (scenario >= 0 && scenario < 4) ? stress_results[scenario].runway_months : -1; 
}

// ============================================
// Break-even Analysis
// ============================================

typedef struct {
    double breakeven_income;
    double safety_margin;
    double max_income_reduction;
    double max_income_reduction_percent;
    int is_positive;
} breakeven_result;

static breakeven_result last_breakeven;

EMSCRIPTEN_KEEPALIVE
void calculate_breakeven(double income, double expenses) {
    double net_cashflow = income - expenses;
    
    last_breakeven.breakeven_income = expenses;
    last_breakeven.is_positive = (net_cashflow >= 0) ? 1 : 0;
    
    if (income > 0) {
        last_breakeven.safety_margin = ((income - expenses) / income) * 100.0;
        last_breakeven.max_income_reduction = income - expenses;
        last_breakeven.max_income_reduction_percent = (last_breakeven.max_income_reduction / income) * 100.0;
    } else {
        last_breakeven.safety_margin = 0.0;
        last_breakeven.max_income_reduction = 0.0;
        last_breakeven.max_income_reduction_percent = 0.0;
    }
}

EMSCRIPTEN_KEEPALIVE double get_breakeven_income() { return last_breakeven.breakeven_income; }
EMSCRIPTEN_KEEPALIVE double get_safety_margin() { return last_breakeven.safety_margin; }
EMSCRIPTEN_KEEPALIVE double get_max_income_reduction() { return last_breakeven.max_income_reduction; }
EMSCRIPTEN_KEEPALIVE double get_max_income_reduction_percent() { return last_breakeven.max_income_reduction_percent; }
EMSCRIPTEN_KEEPALIVE int get_is_positive() { return last_breakeven.is_positive; }

// ============================================
// Sensitivity Analysis
// ============================================

static double sensitivity_results[10]; // Até 10 variações
static int sensitivity_count = 0;

EMSCRIPTEN_KEEPALIVE
void run_sensitivity(
    double current_savings,
    double monthly_contribution,
    double base_return,
    int months,
    double* deltas,      // Array de variações (ex: -5, -2, 0, 2, 5)
    int num_deltas
) {
    sensitivity_count = (num_deltas > 10) ? 10 : num_deltas;
    
    for (int i = 0; i < sensitivity_count; i++) {
        double adjusted_return = (base_return + deltas[i]) / 100.0;
        generate_forecast(current_savings, monthly_contribution, adjusted_return, months);
        sensitivity_results[i] = last_forecast.final_balance;
    }
}

EMSCRIPTEN_KEEPALIVE int get_sensitivity_count() { return sensitivity_count; }
EMSCRIPTEN_KEEPALIVE double get_sensitivity_result(int index) {
    return (index >= 0 && index < sensitivity_count) ? sensitivity_results[index] : 0.0;
}

// ============================================
// Utility Functions
// ============================================

// Calcula quantos meses até dobrar o patrimônio
EMSCRIPTEN_KEEPALIVE
int months_to_double(double current_savings, double monthly_contribution, double annual_return) {
    if (current_savings <= 0) return -1;
    
    double target = current_savings * 2.0;
    double monthly_return = annual_return / 12.0;
    double balance = current_savings;
    int months = 0;
    int max_months = 1200; // 100 anos
    
    while (balance < target && months < max_months) {
        balance = balance * (1.0 + monthly_return) + monthly_contribution;
        months++;
    }
    
    return (months < max_months) ? months : -1;
}

// Valor futuro com contribuições mensais
EMSCRIPTEN_KEEPALIVE
double future_value(double present_value, double monthly_contribution, double annual_return, int months) {
    double monthly_return = annual_return / 12.0;
    double balance = present_value;
    
    for (int m = 0; m < months; m++) {
        balance = balance * (1.0 + monthly_return) + monthly_contribution;
    }
    
    return balance;
}

// Valor presente necessário para atingir meta
EMSCRIPTEN_KEEPALIVE
double present_value_needed(double target, double monthly_contribution, double annual_return, int months) {
    double monthly_return = annual_return / 12.0;
    
    // FV = PV * (1+r)^n + PMT * ((1+r)^n - 1) / r
    // PV = (FV - PMT * ((1+r)^n - 1) / r) / (1+r)^n
    
    double growth_factor = pow(1.0 + monthly_return, months);
    double contribution_fv = 0.0;
    
    if (monthly_return > 0.0001) {
        contribution_fv = monthly_contribution * (growth_factor - 1.0) / monthly_return;
    } else {
        contribution_fv = monthly_contribution * months;
    }
    
    return (target - contribution_fv) / growth_factor;
}

// Libera memória ao finalizar
EMSCRIPTEN_KEEPALIVE
void cleanup_forecast() {
    if (forecast_balances != NULL) {
        free(forecast_balances);
        forecast_balances = NULL;
        forecast_length = 0;
    }
}