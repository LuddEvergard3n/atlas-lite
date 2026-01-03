/**
 * ATLAS Financial Engine - WebAssembly Module
 * Monte Carlo simulations and complex calculations
 * Compile with: emcc src/financial.c -o ../scripts/wasm/financial.js [flags]
 */

#include <emscripten.h>
#include <math.h>
#include <stdint.h>
#include <stdlib.h>

// ============================================
// Random Number Generator (xorshift128+)
// ============================================

typedef struct {
    uint64_t s[2];
} rng_state;

static rng_state global_rng = {{0x853c49e6748fea9bULL, 0xda3e39cb94b95bdbULL}};

EMSCRIPTEN_KEEPALIVE
void seed_rng(uint32_t seed) {
    global_rng.s[0] = seed * 0x853c49e6748fea9bULL;
    global_rng.s[1] = seed * 0xda3e39cb94b95bdbULL;
    if (global_rng.s[0] == 0) global_rng.s[0] = 1;
    if (global_rng.s[1] == 0) global_rng.s[1] = 1;
}

static inline double uniform_random() {
    uint64_t s1 = global_rng.s[0];
    const uint64_t s0 = global_rng.s[1];
    global_rng.s[0] = s0;
    s1 ^= s1 << 23;
    global_rng.s[1] = s1 ^ s0 ^ (s1 >> 18) ^ (s0 >> 5);
    return ((global_rng.s[1] + s0) >> 11) * 0x1.0p-53;
}

static inline double normal_random() {
    double u1 = uniform_random();
    double u2 = uniform_random();
    return sqrt(-2.0 * log(u1)) * cos(6.283185307179586 * u2);
}

// ============================================
// Monte Carlo - FIRE Projection
// ============================================

typedef struct {
    double median;
    double percentile_10;
    double percentile_25;
    double percentile_75;
    double percentile_90;
    double success_rate;
    int years_to_fire;
} fire_result;

static fire_result last_fire_result;

EMSCRIPTEN_KEEPALIVE
void monte_carlo_fire(
    double current_savings,
    double monthly_contribution,
    double annual_expenses,
    double expected_return,      // e.g., 0.08 for 8%
    double return_volatility,    // e.g., 0.15 for 15% std dev
    double withdrawal_rate,      // e.g., 0.04 for 4%
    int max_years,
    int num_simulations
) {
    double target = annual_expenses / withdrawal_rate;
    int success_count = 0;
    int total_years = 0;
    
    double* final_values = (double*)malloc(num_simulations * sizeof(double));
    int* years_to_target = (int*)malloc(num_simulations * sizeof(int));
    
    for (int sim = 0; sim < num_simulations; sim++) {
        double portfolio = current_savings;
        int reached_year = max_years;
        
        for (int year = 0; year < max_years; year++) {
            // Monthly simulation within year
            for (int month = 0; month < 12; month++) {
                // Random monthly return with volatility
                double monthly_return = (expected_return / 12.0) + 
                    (return_volatility / sqrt(12.0)) * normal_random();
                portfolio = portfolio * (1.0 + monthly_return) + monthly_contribution;
            }
            
            if (portfolio >= target && reached_year == max_years) {
                reached_year = year + 1;
                success_count++;
            }
        }
        
        final_values[sim] = portfolio;
        years_to_target[sim] = reached_year;
        total_years += reached_year;
    }
    
    // Sort for percentiles
    for (int i = 0; i < num_simulations - 1; i++) {
        for (int j = i + 1; j < num_simulations; j++) {
            if (final_values[j] < final_values[i]) {
                double temp = final_values[i];
                final_values[i] = final_values[j];
                final_values[j] = temp;
            }
        }
    }
    
    last_fire_result.percentile_10 = final_values[(int)(num_simulations * 0.10)];
    last_fire_result.percentile_25 = final_values[(int)(num_simulations * 0.25)];
    last_fire_result.median = final_values[(int)(num_simulations * 0.50)];
    last_fire_result.percentile_75 = final_values[(int)(num_simulations * 0.75)];
    last_fire_result.percentile_90 = final_values[(int)(num_simulations * 0.90)];
    last_fire_result.success_rate = (double)success_count / num_simulations * 100.0;
    last_fire_result.years_to_fire = total_years / num_simulations;
    
    free(final_values);
    free(years_to_target);
}

EMSCRIPTEN_KEEPALIVE double get_fire_median() { return last_fire_result.median; }
EMSCRIPTEN_KEEPALIVE double get_fire_p10() { return last_fire_result.percentile_10; }
EMSCRIPTEN_KEEPALIVE double get_fire_p25() { return last_fire_result.percentile_25; }
EMSCRIPTEN_KEEPALIVE double get_fire_p75() { return last_fire_result.percentile_75; }
EMSCRIPTEN_KEEPALIVE double get_fire_p90() { return last_fire_result.percentile_90; }
EMSCRIPTEN_KEEPALIVE double get_fire_success_rate() { return last_fire_result.success_rate; }
EMSCRIPTEN_KEEPALIVE int get_fire_years() { return last_fire_result.years_to_fire; }

// ============================================
// Monte Carlo - Investment Projection
// ============================================

typedef struct {
    double final_median;
    double final_p10;
    double final_p90;
    double max_drawdown_avg;
} investment_result;

static investment_result last_investment_result;

EMSCRIPTEN_KEEPALIVE
void monte_carlo_investment(
    double initial,
    double monthly,
    double expected_return,
    double volatility,
    int years,
    int num_simulations
) {
    double* final_values = (double*)malloc(num_simulations * sizeof(double));
    double total_drawdown = 0.0;
    
    for (int sim = 0; sim < num_simulations; sim++) {
        double portfolio = initial;
        double peak = initial;
        double max_dd = 0.0;
        
        for (int month = 0; month < years * 12; month++) {
            double monthly_return = (expected_return / 12.0) + 
                (volatility / sqrt(12.0)) * normal_random();
            portfolio = portfolio * (1.0 + monthly_return) + monthly;
            
            if (portfolio > peak) peak = portfolio;
            double dd = (peak - portfolio) / peak;
            if (dd > max_dd) max_dd = dd;
        }
        
        final_values[sim] = portfolio;
        total_drawdown += max_dd;
    }
    
    // Sort
    for (int i = 0; i < num_simulations - 1; i++) {
        for (int j = i + 1; j < num_simulations; j++) {
            if (final_values[j] < final_values[i]) {
                double temp = final_values[i];
                final_values[i] = final_values[j];
                final_values[j] = temp;
            }
        }
    }
    
    last_investment_result.final_p10 = final_values[(int)(num_simulations * 0.10)];
    last_investment_result.final_median = final_values[(int)(num_simulations * 0.50)];
    last_investment_result.final_p90 = final_values[(int)(num_simulations * 0.90)];
    last_investment_result.max_drawdown_avg = (total_drawdown / num_simulations) * 100.0;
    
    free(final_values);
}

EMSCRIPTEN_KEEPALIVE double get_inv_median() { return last_investment_result.final_median; }
EMSCRIPTEN_KEEPALIVE double get_inv_p10() { return last_investment_result.final_p10; }
EMSCRIPTEN_KEEPALIVE double get_inv_p90() { return last_investment_result.final_p90; }
EMSCRIPTEN_KEEPALIVE double get_inv_drawdown() { return last_investment_result.max_drawdown_avg; }

// ============================================
// Statistical Functions
// ============================================

EMSCRIPTEN_KEEPALIVE
double calculate_volatility(double* returns, int n) {
    if (n < 2) return 0.0;
    
    double sum = 0.0;
    for (int i = 0; i < n; i++) sum += returns[i];
    double mean = sum / n;
    
    double sq_sum = 0.0;
    for (int i = 0; i < n; i++) {
        double diff = returns[i] - mean;
        sq_sum += diff * diff;
    }
    
    return sqrt(sq_sum / (n - 1));
}

EMSCRIPTEN_KEEPALIVE
double calculate_sharpe_ratio(double* returns, int n, double risk_free_rate) {
    if (n < 2) return 0.0;
    
    double sum = 0.0;
    for (int i = 0; i < n; i++) sum += returns[i];
    double mean = sum / n;
    
    double volatility = calculate_volatility(returns, n);
    if (volatility == 0.0) return 0.0;
    
    return (mean - risk_free_rate / 12.0) / volatility * sqrt(12.0);
}

EMSCRIPTEN_KEEPALIVE
double compound_growth(double principal, double rate, int periods) {
    return principal * pow(1.0 + rate, periods);
}

EMSCRIPTEN_KEEPALIVE
int periods_to_target(double current, double target, double monthly, double rate) {
    if (current >= target) return 0;
    if (monthly <= 0 && rate <= 0) return -1;
    
    double monthly_rate = rate / 12.0;
    int periods = 0;
    
    while (current < target && periods < 1200) { // max 100 years
        current = current * (1.0 + monthly_rate) + monthly;
        periods++;
    }
    
    return periods;
}

// ============================================
// Business/Company Analysis
// ============================================

EMSCRIPTEN_KEEPALIVE
double dcf_valuation(
    double free_cash_flow,
    double growth_rate_5y,
    double terminal_growth,
    double discount_rate,
    int projection_years
) {
    double pv_sum = 0.0;
    double fcf = free_cash_flow;
    
    // Project cash flows
    for (int year = 1; year <= projection_years; year++) {
        fcf *= (1.0 + growth_rate_5y);
        pv_sum += fcf / pow(1.0 + discount_rate, year);
    }
    
    // Terminal value
    double terminal_fcf = fcf * (1.0 + terminal_growth);
    double terminal_value = terminal_fcf / (discount_rate - terminal_growth);
    double pv_terminal = terminal_value / pow(1.0 + discount_rate, projection_years);
    
    return pv_sum + pv_terminal;
}

EMSCRIPTEN_KEEPALIVE
double npv(double* cash_flows, int n, double discount_rate) {
    double npv_value = 0.0;
    for (int i = 0; i < n; i++) {
        npv_value += cash_flows[i] / pow(1.0 + discount_rate, i);
    }
    return npv_value;
}

EMSCRIPTEN_KEEPALIVE
double irr(double* cash_flows, int n, int max_iterations) {
    double low = -0.99;
    double high = 10.0;
    double mid, npv_val;
    
    for (int iter = 0; iter < max_iterations; iter++) {
        mid = (low + high) / 2.0;
        npv_val = npv(cash_flows, n, mid);
        
        if (fabs(npv_val) < 0.0001) return mid;
        
        if (npv_val > 0) low = mid;
        else high = mid;
    }
    
    return mid;
}