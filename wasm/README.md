# ATLAS v5.0 - WebAssembly Build

## Prerequisites

- **Emscripten SDK** (emsdk)
- Download: https://emscripten.org/docs/getting_started/downloads.html

## Build Instructions

### Linux/Mac

```bash
# Activate Emscripten
source /path/to/emsdk/emsdk_env.sh

# Build release
make release

# Or build debug
make debug

# Clean
make clean
```

### Windows

```batch
REM Activate Emscripten
call C:\path\to\emsdk\emsdk_env.bat

REM Build
build.bat

REM Or debug build
build.bat --debug
```

## Output Files

After building, the following files are generated in `../scripts/wasm/`:

| File | Description |
|------|-------------|
| `financial.js` | JavaScript loader for financial WASM |
| `financial.wasm` | Compiled WebAssembly module |
| `analytics.js` | JavaScript loader for analytics WASM |
| `analytics.wasm` | Compiled analytics module |

## Source Files

| File | Description |
|------|-------------|
| `src/financial.c` | Financial calculations (Monte Carlo, DCF, NPV, IRR) |
| `src/analytics.c` | Analytics engine (Atlas score, trends) |

## Exported Functions

### Financial Module

```javascript
// Monte Carlo FIRE simulation
_monte_carlo_fire(savings, contribution, return, volatility, expenses, years, iterations)
_get_fire_median()
_get_fire_p10()
_get_fire_p90()
_get_fire_success_rate()

// Investment analysis
_monte_carlo_investment(...)
_calculate_volatility(data, length)
_calculate_sharpe_ratio(returns, risk_free, length)

// Financial math
_compound_growth(principal, rate, periods)
_periods_to_target(principal, contribution, rate, target)
_dcf_valuation(cashflows, discount_rate, length)
_npv(cashflows, rate, length)
_irr(cashflows, length)
```

### Analytics Module

```javascript
_calculate_atlas_score(growth, liquidity, stability, predictability)
_analyze_trends(data, length)
_detect_anomalies(data, length, threshold)
```

## Usage in JavaScript

```javascript
// Load module
createFinancialModule().then(function(Module) {
    // Seed RNG
    Module._seed_rng(Date.now());
    
    // Run Monte Carlo
    Module._monte_carlo_fire(100000, 2000, 0.08, 0.15, 5000, 30, 10000);
    
    // Get results
    var median = Module._get_fire_median();
    var successRate = Module._get_fire_success_rate();
});
```

## Troubleshooting

### "emcc not found"
Make sure to run `emsdk_env.sh` (Linux/Mac) or `emsdk_env.bat` (Windows) first.

### "Module not defined"
WASM files must be served over HTTP. Use a local server like `python -m http.server`.

---

*ATLAS Enterprise v5.0 - WASM Build System*
