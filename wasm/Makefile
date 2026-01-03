# ============================================
# ATLAS v5.0 Enterprise - WASM Build System
# ============================================
# Usage:
#   make          - Build release (default)
#   make release  - Build optimized release
#   make debug    - Build with debug symbols
#   make clean    - Remove build artifacts
#   make help     - Show this help
# ============================================

CC = emcc
SRC_DIR = src
OUT_DIR = ../scripts/wasm

# Source files
FINANCIAL_SRC = $(SRC_DIR)/financial.c
ANALYTICS_SRC = $(SRC_DIR)/analytics.c

# Output names
FINANCIAL_OUT = financial
ANALYTICS_OUT = analytics

# Common compiler flags
COMMON_FLAGS = -s WASM=1 \
               -s MODULARIZE=1 \
               -s ENVIRONMENT='web' \
               -s ALLOW_MEMORY_GROWTH=1 \
               -s NO_EXIT_RUNTIME=1 \
               -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]'

# Release optimization flags
RELEASE_FLAGS = -O3 -flto

# Debug flags
DEBUG_FLAGS = -O0 -g -s ASSERTIONS=2

# Financial module exports
FINANCIAL_EXPORTS = -s EXPORTED_FUNCTIONS='[ \
    "_seed_rng", \
    "_monte_carlo_fire", \
    "_get_fire_median", \
    "_get_fire_p10", \
    "_get_fire_p25", \
    "_get_fire_p75", \
    "_get_fire_p90", \
    "_get_fire_success_rate", \
    "_get_fire_years", \
    "_monte_carlo_investment", \
    "_get_inv_median", \
    "_get_inv_p10", \
    "_get_inv_p90", \
    "_get_inv_drawdown", \
    "_calculate_volatility", \
    "_calculate_sharpe_ratio", \
    "_compound_growth", \
    "_periods_to_target", \
    "_dcf_valuation", \
    "_npv", \
    "_irr", \
    "_malloc", \
    "_free" \
]'

# Analytics module exports
ANALYTICS_EXPORTS = -s EXPORTED_FUNCTIONS='[ \
    "_calculate_atlas_score", \
    "_analyze_trends", \
    "_detect_anomalies", \
    "_malloc", \
    "_free" \
]'

# ============================================
# Targets
# ============================================

.PHONY: all release debug clean help setup financial analytics

all: release

help:
	@echo ""
	@echo "ATLAS v5.0 WASM Build System"
	@echo "============================"
	@echo ""
	@echo "Targets:"
	@echo "  make          - Build release (default)"
	@echo "  make release  - Build optimized release"
	@echo "  make debug    - Build with debug symbols"
	@echo "  make clean    - Remove build artifacts"
	@echo "  make help     - Show this help"
	@echo ""
	@echo "Individual modules:"
	@echo "  make financial - Build only financial module"
	@echo "  make analytics - Build only analytics module"
	@echo ""

setup:
	@mkdir -p $(OUT_DIR)
	@echo "[INFO] Output directory ready: $(OUT_DIR)"

# ============================================
# Release builds
# ============================================

release: setup financial-release analytics-release
	@echo ""
	@echo "============================================"
	@echo " Release build complete!"
	@echo "============================================"
	@echo " Output: $(OUT_DIR)/"
	@ls -la $(OUT_DIR)/*.js $(OUT_DIR)/*.wasm 2>/dev/null || true
	@echo "============================================"

financial-release: setup
	@echo "[1/2] Building financial.wasm (release)..."
	@$(CC) $(FINANCIAL_SRC) $(RELEASE_FLAGS) $(COMMON_FLAGS) \
		-s EXPORT_NAME='createFinancialModule' \
		$(FINANCIAL_EXPORTS) \
		-o $(OUT_DIR)/$(FINANCIAL_OUT).js
	@echo "[OK] financial.wasm built"

analytics-release: setup
	@echo "[2/2] Building analytics.wasm (release)..."
	@$(CC) $(ANALYTICS_SRC) $(RELEASE_FLAGS) $(COMMON_FLAGS) \
		-s EXPORT_NAME='createAnalyticsModule' \
		$(ANALYTICS_EXPORTS) \
		-o $(OUT_DIR)/$(ANALYTICS_OUT).js 2>/dev/null || \
		echo "[WARN] analytics.wasm build failed (optional module)"

# ============================================
# Debug builds
# ============================================

debug: setup financial-debug analytics-debug
	@echo ""
	@echo "============================================"
	@echo " Debug build complete!"
	@echo "============================================"

financial-debug: setup
	@echo "[1/2] Building financial.wasm (debug)..."
	@$(CC) $(FINANCIAL_SRC) $(DEBUG_FLAGS) $(COMMON_FLAGS) \
		-s EXPORT_NAME='createFinancialModule' \
		$(FINANCIAL_EXPORTS) \
		-o $(OUT_DIR)/$(FINANCIAL_OUT).js
	@echo "[OK] financial.wasm built (debug)"

analytics-debug: setup
	@echo "[2/2] Building analytics.wasm (debug)..."
	@$(CC) $(ANALYTICS_SRC) $(DEBUG_FLAGS) $(COMMON_FLAGS) \
		-s EXPORT_NAME='createAnalyticsModule' \
		$(ANALYTICS_EXPORTS) \
		-o $(OUT_DIR)/$(ANALYTICS_OUT).js 2>/dev/null || \
		echo "[WARN] analytics.wasm build failed (optional module)"

# ============================================
# Shortcuts
# ============================================

financial: financial-release
analytics: analytics-release

# ============================================
# Clean
# ============================================

clean:
	@echo "Cleaning build artifacts..."
	@rm -f $(OUT_DIR)/$(FINANCIAL_OUT).js $(OUT_DIR)/$(FINANCIAL_OUT).wasm
	@rm -f $(OUT_DIR)/$(ANALYTICS_OUT).js $(OUT_DIR)/$(ANALYTICS_OUT).wasm
	@echo "[OK] Clean complete"