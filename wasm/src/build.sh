#!/bin/bash
# ATLAS v4.0 - WASM Build Script
# Requer Emscripten SDK instalado e ativado
# 
# Instalação do Emscripten:
#   git clone https://github.com/emscripten-core/emsdk.git
#   cd emsdk
#   ./emsdk install latest
#   ./emsdk activate latest
#   source ./emsdk_env.sh
#
# Uso: ./build.sh [all|financial|analytics|forecast|kpis]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$SCRIPT_DIR"
OUT_DIR="$SCRIPT_DIR/../../scripts/wasm"

# Flags comuns de otimização
COMMON_FLAGS="-O3 -s WASM=1 -s MODULARIZE=1 -s ALLOW_MEMORY_GROWTH=1"
RUNTIME_METHODS="-s EXPORTED_RUNTIME_METHODS=['cwrap','ccall']"

# Cria diretório de saída se não existir
mkdir -p "$OUT_DIR"

build_financial() {
    echo "Building financial.c..."
    emcc "$SRC_DIR/financial.c" -o "$OUT_DIR/financial.js" \
        $COMMON_FLAGS \
        $RUNTIME_METHODS \
        -s EXPORT_NAME="'createFinancialModule'" \
        -s EXPORTED_FUNCTIONS="[ \
            '_seed_rng', \
            '_monte_carlo_fire', \
            '_monte_carlo_investment', \
            '_get_fire_median', '_get_fire_p10', '_get_fire_p25', \
            '_get_fire_p75', '_get_fire_p90', '_get_fire_success_rate', '_get_fire_years', \
            '_get_inv_median', '_get_inv_p10', '_get_inv_p90', '_get_inv_drawdown', \
            '_calculate_volatility', '_calculate_sharpe_ratio', \
            '_compound_growth', '_periods_to_target', \
            '_dcf_valuation', '_npv', '_irr' \
        ]"
    echo "✓ financial.js + financial.wasm"
}

build_analytics() {
    echo "Building analytics.c..."
    emcc "$SRC_DIR/analytics.c" -o "$OUT_DIR/analytics-engine.js" \
        $COMMON_FLAGS \
        $RUNTIME_METHODS \
        -s EXPORT_NAME="'createAnalyticsModule'" \
        -s EXPORTED_FUNCTIONS="[ \
            '_linear_regression_slope', '_linear_regression_intercept', '_predict_value', \
            '_moving_average', '_consistency_index', \
            '_sm2_next_interval', '_sm2_update_easiness', '_sm2_should_reset', \
            '_pearson_correlation', '_percent_change', '_absolute_change', \
            '_detect_trend', '_days_to_goal' \
        ]"
    echo "✓ analytics-engine.js + analytics-engine.wasm"
}

build_forecast() {
    echo "Building forecast.c..."
    emcc "$SRC_DIR/forecast.c" -o "$OUT_DIR/forecast-engine.js" \
        $COMMON_FLAGS \
        $RUNTIME_METHODS \
        -s EXPORT_NAME="'createForecastModule'" \
        -s EXPORTED_FUNCTIONS="[ \
            '_generate_forecast', \
            '_get_forecast_final_balance', '_get_forecast_total_returns', \
            '_get_forecast_total_contributions', '_get_forecast_cagr', \
            '_get_forecast_percent_growth', '_get_forecast_length', '_get_forecast_balance_at', \
            '_run_stress_test', \
            '_get_stress_income', '_get_stress_expenses', '_get_stress_cashflow', \
            '_get_stress_impact', '_get_stress_runway', \
            '_calculate_breakeven', \
            '_get_breakeven_income', '_get_safety_margin', \
            '_get_max_income_reduction', '_get_max_income_reduction_percent', '_get_is_positive', \
            '_run_sensitivity', '_get_sensitivity_count', '_get_sensitivity_result', \
            '_months_to_double', '_future_value', '_present_value_needed', \
            '_cleanup_forecast' \
        ]"
    echo "✓ forecast-engine.js + forecast-engine.wasm"
}

build_kpis() {
    echo "Building kpis.c..."
    emcc "$SRC_DIR/kpis.c" -o "$OUT_DIR/kpis-engine.js" \
        $COMMON_FLAGS \
        $RUNTIME_METHODS \
        -s EXPORT_NAME="'createKPIsModule'" \
        -s EXPORTED_FUNCTIONS="[ \
            '_calc_liquidity_ratio', '_calc_savings_rate', '_calc_operating_margin', \
            '_calc_fire_progress', '_calc_net_worth_growth', '_calc_expense_ratio', \
            '_calc_goals_completion', '_calc_runway', \
            '_calculate_all_kpis', '_calculate_overall_score', \
            '_get_liquidity_ratio', '_get_savings_rate', '_get_operating_margin', \
            '_get_fire_progress', '_get_net_worth_growth', '_get_expense_ratio', \
            '_get_goals_completion', '_get_runway_months', '_get_overall_score', \
            '_get_kpi_level', '_get_overall_level', \
            '_calc_kpi_change', '_get_trend_direction', \
            '_compare_to_benchmark', '_calc_gap_to_target', '_months_to_target' \
        ]"
    echo "✓ kpis-engine.js + kpis-engine.wasm"
}

# Main
case "${1:-all}" in
    financial)
        build_financial
        ;;
    analytics)
        build_analytics
        ;;
    forecast)
        build_forecast
        ;;
    kpis)
        build_kpis
        ;;
    all)
        build_financial
        build_analytics
        build_forecast
        build_kpis
        echo ""
        echo "========================================="
        echo "✓ Build completo!"
        echo "========================================="
        echo "Arquivos gerados em: $OUT_DIR"
        ls -lh "$OUT_DIR"/*.js "$OUT_DIR"/*.wasm 2>/dev/null || true
        ;;
    *)
        echo "Uso: $0 [all|financial|analytics|forecast|kpis]"
        exit 1
        ;;
esac