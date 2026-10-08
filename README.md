# ATLAS Lite

![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=111111)
![WebAssembly](https://img.shields.io/badge/WebAssembly-C_Engine-654FF0?logo=webassembly&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)
![Status](https://img.shields.io/badge/Status-Portfolio_Demo-2563EB)

Local browser-based financial analysis and visualization demo focused on performance, transparent calculations, and user control.

## Modules

- Financial health dashboard.
- Compound-interest simulator.
- Financial independence calculator.
- Investment comparison.
- Monte Carlo and discounted cash-flow simulations.
- What-if scenarios.
- Strategic goals.
- ATLAS financial health score.

## Technology

- Vanilla JavaScript with no framework.
- C compiled to WebAssembly for numerical simulations.
- Native Canvas 2D charts.
- Progressive Web App assets.
- Fully client-side execution without a backend.

The C source under `wasm/src/` covers Monte Carlo simulations, discounted cash flow, net present value, and internal rate of return calculations.

## Run locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Structure

```text
index.html       Application shell
css/             Layout and module presentation
js/              Dashboard, calculators, charts, and orchestration
wasm/src/        Auditable C calculation sources
assets/          Local visual assets
manifest.json    PWA metadata
```

## Demo limits

- Data resets when the page reloads.
- Example data is included for demonstration.
- Eight modules are exposed in this public demo.
- This repository does not include a production financial service or advisory system.

## License

Portfolio demonstration. See the repository license terms before reuse.
