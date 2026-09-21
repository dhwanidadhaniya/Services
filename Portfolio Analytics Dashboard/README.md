# Financial Services / Portfolio Analytics Dashboard

> **Target Role**: Citi Services – Summer Analyst, India, 2027 (Mumbai)  
> **Student Portfolio Project**: Institutional Portfolio Performance, Risk Budgeting, Liquidity Analytics, and Client Insights Engine.

---

## 1. Project Overview & Story

Institutional financial services institutions (such as **Citi Services**) manage and administer trillions of dollars in assets across pension funds, sovereign wealth funds, insurance corporations, endowments, and corporate treasuries. Relationship managers, custody operations analysts, and risk officers need integrated tools to turn high-volume transaction books into actionable insights across performance attribution, liquidity runways, trade breaks, and cross-sell opportunities.

This project is a **student-built institutional analytics platform** combining an active **13-sheet professional Excel financial workbook** with a modern **Python FastAPI + React web terminal**. It models a realistic synthetic book of **25 institutional clients**, **74 segregated custody accounts**, and **5,200+ transaction records** across multi-asset classes and global markets (India, US, UK, Europe, Singapore, Japan).

---

## 2. Institutional Financial Services Context

The platform is designed around the core business lines of institutional transaction banking:
- **Cash Management & Liquidity**: Automated cash sweep identification, uninvested idle cash diagnostics, and operating buffer monitoring.
- **Global Custody & Administration**: Segregated account tracking, multi-asset holding valuations, and trade settlement affirmations (T+1/T+2).
- **Trade Finance & FX Services**: Cross-border flow surveillance, FX hedging opportunity triggers, and transaction fee capture analysis.
- **Collateral Management & Financing**: Sovereign/corporate bond inventory tracking for tri-party collateral optimization and securities lending.
- **Performance & Risk Analytics**: Time-Weighted Return (TWR), active alpha attribution against global benchmarks (NIFTY 50, S&P 500, MSCI World), 95% Historical Value-at-Risk (VaR), Tracking Error, and Drawdowns.

---

## 3. Technology Architecture

```
financial-services-portfolio-analytics/
├── backend/
│   ├── analytics/              # Pure Python financial calculation engines
│   │   ├── performance.py      # TWR, Modified Dietz, Active Alpha, Tracking Error, Information Ratio
│   │   ├── risk.py             # Annualized Volatility, Sharpe, Sortino, Historical VaR 95%, MDD, Beta
│   │   ├── liquidity.py        # Cash/AUM %, Days of Liquidity, Student Cash Efficiency Index
│   │   ├── concentration.py    # Top 5/10 weights, Sector/Country exposure, HHI score
│   │   ├── client.py           # Student Client Health Score (0-100), 2D Institutional Segmentation Grid
│   │   ├── opportunities.py    # Systematic business development cross-sell triggers
│   │   ├── data_quality.py     # Reconciliation breaks, failed settlement audit, Data Quality Score
│   │   └── exceptions.py       # Operational surveillance & risk exception engine
│   ├── api/                    # FastAPI REST routes with comprehensive query parameter filtering
│   ├── models/                 # Pydantic schemas with typed data contracts and docstrings
│   ├── services/               # Data generator and in-memory query repository
│   ├── tests/                  # 20 automated unit and endpoint tests (pytest)
│   ├── generate_excel.py       # openpyxl generator for the 13-sheet financial workbook
│   └── main.py                 # FastAPI application entry point
├── frontend/
│   ├── src/
│   │   ├── components/         # Recharts, MetricCard, TooltipHelp (with formulas/limitations), Filters
│   │   ├── pages/              # Landing, Dashboard, Client 360, Portfolios, Risk/Liquidity, Reports
│   │   ├── context/            # Reactive FilterContext with Demo Mode launcher
│   │   └── services/           # Backend API adapter
├── excel/
│   └── portfolio_analytics.xlsx # Production-grade 13-sheet financial workbook with active formulas
├── docs/
│   ├── METHODOLOGY.md          # Comprehensive mathematical derivations and formula definitions
│   ├── DATA_DICTIONARY.md      # Field-by-field schema, calculation sources, and business meaning
│   └── INTERVIEW_PREP.md       # 10 institutional interview questions & model answers
└── requirements.txt
```

---

## 4. Key Financial Calculations & Metrics

Every metric in the platform includes plain-English definitions, mathematical formulas, business relevance, and known limitations:

| Metric | Mathematical Formula | Institutional Purpose |
| :--- | :--- | :--- |
| **Time-Weighted Return (TWR)** | $\text{TWR} = \prod (1 + R_t) - 1$ | Eliminates cash flow distortion to measure pure investment management skill. |
| **Active Return (Alpha)** | $\alpha = R_{\text{portfolio}} - R_{\text{benchmark}}$ | Quantifies excess return generated above the designated benchmark hurdle. |
| **Tracking Error (TE)** | $\text{TE} = \sqrt{\frac{12}{N-1}\sum (\text{Active}_t - \overline{\text{Active}})^2}$ | Measures consistency and volatility of active bets relative to the index. |
| **Information Ratio (IR)** | $\text{IR} = \frac{\text{Active Return}}{\text{Tracking Error}}$ | Industry standard measuring manager skill per unit of active risk taken. |
| **Sharpe Ratio** | $\text{Sharpe} = \frac{R_{\text{ann}} - 4.5\%}{\sigma_{\text{ann}}}$ | Measures excess return per unit of total annualized volatility. |
| **Sortino Ratio** | $\text{Sortino} = \frac{R_{\text{ann}} - 4.5\%}{\sigma_{\text{downside}}}$ | Evaluates return against only negative/downside volatility. |
| **Historical VaR (95%)** | $\text{VaR}_{95} = -\text{Quantile}(R, 0.05) \cdot V \cdot \frac{1}{\sqrt{21}}$ | Estimates maximum expected 1-day/10-day loss bound at 95% confidence. |
| **Maximum Drawdown** | $\text{MDD} = \min_t \frac{\text{NAV}_t - \text{Peak}_t}{\text{Peak}_t}$ | Worst-case historical peak-to-trough capital decline. |
| **Student Cash Efficiency** | $\text{Efficiency} = \frac{\text{Target Buffer (4\% AUM)}}{\text{Actual Custody Cash}}$ | Identifies sub-optimal cash drag ($<0.5\text{x}$) vs liquidity squeeze risk ($>1.4\text{x}$). |
| **Client Health Score** | Multi-factor weighted rating (0–100) | Assesses relationship vitality across performance, growth, rev, txn volume, and services. |

---

## 5. Professional 13-Sheet Excel Model (`portfolio_analytics.xlsx`)

The workbook is structured into 13 cleanly formatted sheets with live formulas:
1. `01_README`: Overview, Sheet Directory, Assumptions ($R_f=4.5\%$), and student disclaimer.
2. `02_CLIENTS`: Master table of 25 institutional clients with formatted numbers (`$#,##0.0M`, `0.0 bps`).
3. `03_PORTFOLIOS`: Master account holdings with asset classes, sectors, weights, and ratings.
4. `04_TRANSACTIONS`: 5,200+ transaction journal rows tracking gross, fees, net, and settlement status.
5. `05_PRICES`: Historical monthly asset pricing matrix (2021–2026).
6. `06_BENCHMARKS`: Benchmark monthly return series (NIFTY 50, S&P 500, MSCI World, Bloomberg Agg).
7. `07_CASHFLOW`: Portfolio monthly cash contributions and distributions.
8. `08_CALCULATIONS`: Intermediate calculations using `SUMIFS`, `COUNTIF`, and `XLOOKUP`.
9. `09_PERFORMANCE`: Active formulas for cumulative TWR, annualized return, active alpha, and IR.
10. `10_RISK`: Annualized volatility (`STDEV.S*SQRT(12)`), Sharpe ratio, and 95% VaR formulas.
11. `11_CLIENT_ANALYTICS`: Client health score decomposition and revenue per AUM basis points.
12. `12_OPPORTUNITIES`: Dynamic logic flags identifying cash sweep and collateral financing candidates.
13. `13_DASHBOARD`: Institutional summary dashboard with KPI cards and client rank tables.

---

## 6. Interactive Web Terminal Features

- **Executive KPI Cards**: Real-time totals for AUM ($104.8B), annual fee revenue ($74.8M), annualized returns (10.82%), active alpha (+1.30%), and settlement efficiency (98.80%).
- **Interactive Charts**: Recharts-powered Cumulative Growth curves, Monthly Return bar charts, Underwater Drawdown curves, and Risk-Return scatter plots.
- **Client 360 Deep-Dive**: Comprehensive client profiles featuring service utilization heatmaps across all 8 Citi Services lines.
- **Surveillance & Exception Engine**: Explains **WHAT** happened, **WHY** it was flagged, and the **EXACT DATA TRIGGER** for concentration breaches, large trades, and settlement breaks.
- **Deterministic "Ask the Data" Assistant**: Pre-computed query engine resolving common analyst questions without AI hallucinations.
- **Executive Client Report Generator**: One-click printable PDF memo format for client reviews.
- **Demo Mode (Atlas Sovereign Fund)**: Pre-loads an interview scenario highlighting elevated cash ($1.65B uninvested) and cross-sell sweep opportunities.

---

## 7. Setup & Run Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Backend Setup
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run test verification suite
python -m pytest backend/tests/ -v

# 3. (Optional) Re-generate synthetic data & Excel workbook
python backend/services/data_generator.py
python backend/generate_excel.py

# 4. Start FastAPI backend server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend Setup
```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies & run development server
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 8. Resume Bullets (For Internship Applications)

• **Institutional Portfolio & Client Analytics Platform**: Engineered an institutional financial services analytics dashboard processing synthetic transaction, portfolio, and liquidity records across 25 institutional clients ($104B+ AUM) using Python (FastAPI, Pandas, NumPy), React, and Tailwind CSS.

• **Quantitative Risk & Performance Attribution Engine**: Developed institutional performance attribution and risk analytics modules—calculating Time-Weighted Return (TWR), active alpha, tracking error, Information Ratio, Sortino Ratio, 95% Historical Value-at-Risk (1D & 10D), and concentration metrics across 74 multi-asset accounts.

• **Client Insights & Liquidity Optimization Framework**: Built client health scoring (0–100), 2D institutional segmentation, and an automated opportunity engine identifying uninvested cash drag ($2.4B+ idle liquidity) and cross-functional Citi Services expansion triggers across Global Custody, Cash Management, and FX solutions.

---

## 9. Disclaimer
This project is an academic prototype built for educational and portfolio demonstration purposes. All client names, entity identifiers, and portfolio holdings are completely fictional/synthetic.
