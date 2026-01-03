@echo off
REM ============================================
REM ATLAS v5.0 Enterprise - WASM Build Script
REM ============================================
REM Requires: Emscripten SDK (emsdk)
REM Run emsdk_env.bat before this script
REM ============================================

setlocal enabledelayedexpansion

echo.
echo  ╔═══════════════════════════════════════════╗
echo  ║     ATLAS v5.0 Enterprise Build Tool      ║
echo  ╚═══════════════════════════════════════════╝
echo.

REM Check if emcc is available
where emcc >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Emscripten not found in PATH.
    echo.
    echo Please run: emsdk_env.bat
    echo Or install Emscripten from: https://emscripten.org/docs/getting_started/downloads.html
    echo.
    goto :error
)

REM Create output directory
set OUT_DIR=..\scripts\wasm
if not exist "%OUT_DIR%" (
    echo [INFO] Creating output directory...
    mkdir "%OUT_DIR%"
)

REM Common flags
set COMMON_FLAGS=-s WASM=1 -s MODULARIZE=1 -s ENVIRONMENT="web" -s ALLOW_MEMORY_GROWTH=1 -s NO_EXIT_RUNTIME=1 -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap']"

REM Build mode
set BUILD_MODE=release
if "%1"=="debug" set BUILD_MODE=debug
if "%1"=="--debug" set BUILD_MODE=debug

echo [INFO] Build mode: %BUILD_MODE%
echo.

REM ============================================
REM Build financial.c (Main Financial Module)
REM ============================================
echo [1/2] Building financial.wasm...

set FINANCIAL_EXPORTS=-s EXPORTED_FUNCTIONS="['_seed_rng','_monte_carlo_fire','_get_fire_median','_get_fire_p10','_get_fire_p25','_get_fire_p75','_get_fire_p90','_get_fire_success_rate','_get_fire_years','_monte_carlo_investment','_get_inv_median','_get_inv_p10','_get_inv_p90','_get_inv_drawdown','_calculate_volatility','_calculate_sharpe_ratio','_compound_growth','_periods_to_target','_dcf_valuation','_npv','_irr','_malloc','_free']"

if "%BUILD_MODE%"=="debug" (
    emcc src/financial.c -O0 -g -s ASSERTIONS=2 %COMMON_FLAGS% %FINANCIAL_EXPORTS% -s EXPORT_NAME="createFinancialModule" -o %OUT_DIR%\financial.js
) else (
    emcc src/financial.c -O3 -flto %COMMON_FLAGS% %FINANCIAL_EXPORTS% -s EXPORT_NAME="createFinancialModule" -o %OUT_DIR%\financial.js
)

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to build financial.wasm
    goto :error
)
echo [OK] financial.wasm built successfully
echo.

REM ============================================
REM Build analytics.c (Analytics Module)
REM ============================================
echo [2/2] Building analytics.wasm...

set ANALYTICS_EXPORTS=-s EXPORTED_FUNCTIONS="['_calculate_atlas_score','_analyze_trends','_detect_anomalies','_malloc','_free']"

if "%BUILD_MODE%"=="debug" (
    emcc src/analytics.c -O0 -g -s ASSERTIONS=2 %COMMON_FLAGS% %ANALYTICS_EXPORTS% -s EXPORT_NAME="createAnalyticsModule" -o %OUT_DIR%\analytics.js
) else (
    emcc src/analytics.c -O3 -flto %COMMON_FLAGS% %ANALYTICS_EXPORTS% -s EXPORT_NAME="createAnalyticsModule" -o %OUT_DIR%\analytics.js
)

if %ERRORLEVEL% NEQ 0 (
    echo [WARN] Failed to build analytics.wasm (optional module)
) else (
    echo [OK] analytics.wasm built successfully
)

echo.
echo ============================================
echo  Build Complete!
echo ============================================
echo  Output files:
echo    - %OUT_DIR%\financial.js
echo    - %OUT_DIR%\financial.wasm
echo    - %OUT_DIR%\analytics.js (optional)
echo    - %OUT_DIR%\analytics.wasm (optional)
echo ============================================
echo.
goto :end

:error
echo.
echo Build failed with errors.
echo.

:end
endlocal
pause