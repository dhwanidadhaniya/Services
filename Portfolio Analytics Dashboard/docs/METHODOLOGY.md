# Financial Services & Portfolio Analytics Methodology

**Target Role Context**: Citi Services – Summer Analyst, India 2027 (Mumbai)  
**Author**: Portfolio & Financial Services Analyst Prototype  
**Scope**: Institutional Performance Attribution, Risk Budgeting, Cash & Liquidity Management, Concentration Analysis, and Business Development Identification.

---

## 1. Executive Summary & Purpose

In institutional financial services—particularly across **Global Custody, Cash Management, Trade Finance, Fund Administration, and Collateral Management**—portfolio analysts and product engineers must transform massive transaction books into accurate, risk-adjusted performance insights and client relationship metrics.

This document details the exact mathematical formulas, analytical logic, baseline assumptions, and real-world limitations underpinning the analytics platform.

---

## 2. Portfolio Performance Calculations

### A. Time-Weighted Return (TWR)
- **Definition**: The compounding rate of return over multiple periods that isolates portfolio management skill by eliminating the distorting impact of external client cash deposits and withdrawals.
- **Formula**:
  $$\text{TWR} = \prod_{t=1}^N (1 + R_t) - 1$$
  Where $R_t$ is the single-period return calculated via Modified Dietz cash-flow adjustment:
  $$R_t = \frac{\text{NAV}_t - (\text{NAV}_{t-1} + \text{NetFlow}_t)}{\text{NAV}_{t-1} + 0.5 \cdot \text{NetFlow}_t}$$
- **Interpretation**: Standard required by Global Investment Performance Standards (GIPS) to evaluate asset managers against benchmark hurdles.
- **Limitations**: Does not reflect the dollar-weighted investor experience if large cash injections occur prior to market declines.

### B. Annualized Return
- **Formula**:
  $$R_{\text{ann}} = (1 + \text{TWR})^{\frac{12}{N}} - 1$$
  Where $N$ is the number of historical months evaluated.

### C. Active Return (Alpha)
- **Formula**:
  $$\alpha_{\text{active}} = R_{\text{portfolio, ann}} - R_{\text{benchmark, ann}}$$
- **Interpretation**: Positive active return demonstrates manager outperformance relative to the benchmark mandate; negative return indicates active drag.

### D. Tracking Error (TE) & Information Ratio (IR)
- **Tracking Error Formula**:
  $$\text{TE} = \sqrt{\frac{12}{N - 1} \sum_{t=1}^N (R_{p,t} - R_{b,t} - \overline{R_{\text{active}}})^2}$$
- **Information Ratio Formula**:
  $$\text{IR} = \frac{R_{\text{portfolio, ann}} - R_{\text{benchmark, ann}}}{\text{TE}}$$
- **Interpretation**: Measures the efficiency of active risk taken. An Information Ratio $> 0.50$ signifies consistent, skilled active management.

---

## 3. Risk Analytics Framework

### A. Annualized Volatility
- **Formula**:
  $$\sigma_{\text{ann}} = \sqrt{12} \cdot \sigma_{\text{sample, monthly}}$$

### B. Sharpe Ratio & Sortino Ratio
- **Sharpe Ratio**:
  $$\text{Sharpe} = \frac{R_{\text{ann}} - R_f}{\sigma_{\text{ann}}}$$
  *Baseline Assumption*: Risk-Free Rate $R_f = 4.50\%$ (representing the US Treasury 3-Month / INR Overnight risk-free rate hurdle).
- **Sortino Ratio**:
  $$\text{Sortino} = \frac{R_{\text{ann}} - R_f}{\sigma_{\text{downside}}}$$
  Where $\sigma_{\text{downside}} = \sqrt{\frac{12}{N} \sum_{t=1}^N \min(0, R_t - \frac{R_f}{12})^2}$.
- **Interpretation**: Sortino penalizes only harmful downside volatility, avoiding penalizing beneficial upside volatility.

### C. Historical Value-at-Risk (95% VaR)
- **Formula**:
  $$\text{VaR}_{95\%} = -\text{Quantile}(R_{\text{monthly}}, 0.05) \cdot \text{Portfolio Value} \cdot \frac{1}{\sqrt{21}}$$
  $$\text{VaR}_{10\text{-Day}} = \text{VaR}_{1\text{-Day}} \cdot \sqrt{10}$$
- **Key Limitation**: VaR specifies the minimum threshold loss at the 95th percentile, but does not measure expected severity during extreme tail events (Conditional VaR / Expected Shortfall).

### D. Maximum Drawdown (MDD)
- **Formula**:
  $$\text{Drawdown}_t = \frac{\text{NAV}_t - \max_{s \le t} \text{NAV}_s}{\max_{s \le t} \text{NAV}_s}$$
  $$\text{MDD} = \min_{t} (\text{Drawdown}_t)$$

---

## 4. Liquidity & Cash Management Framework

### A. Cash / AUM Ratio
- **Formula**: $\frac{\text{Uninvested Custody Cash}}{\text{Total Client AUM}} \times 100\%$

### B. Days of Liquidity Runway
- **Formula**:
  $$\text{Days of Liquidity} = \frac{\text{Cash \& Level-1 Liquid Assets}}{\text{Average Monthly Outflows} / 30}$$

### C. Student-Defined Cash Efficiency Index
- **Formula**:
  $$\text{Cash Efficiency} = \frac{\text{Target Operating Buffer (4.0\% of AUM)}}{\text{Actual Cash Balance Held}}$$
- **Diagnostic Tiers**:
  - $\approx 1.0$: Optimal cash deployment.
  - $< 0.50$: Sub-optimal cash drag (High potential for automated liquidity sweeps).
  - $> 1.40$: Tight liquidity runway (Elevated settlement squeeze risk).

---

## 5. Portfolio Concentration Metrics

### A. Herfindahl-Hirschman Index (HHI)
- **Formula**: $\text{HHI} = \sum_{i=1}^M (w_i \%)^2$
- **Alert Tiers**: Low ($< 1500$), Moderate ($1500 - 2500$), High Risk ($> 2500$ or single holding $> 15.0\%$).

---

## 6. Student-Defined Client Health Score & 2D Segmentation

### A. Composite Health Formula
$$\text{Health Score} = 0.25(\text{Perf Score}) + 0.20(\text{AUM Growth}) + 0.15(\text{Rev Efficiency}) + 0.15(\text{Txn Volume}) + 0.15(\text{Service Breadth}) + 0.10(\text{Liquidity Stability})$$

### B. 2D Institutional Grid
- **X-Axis (Client Value)**: Scale based on AUM and fee revenue.
- **Y-Axis (Expansion Potential)**: YoY growth trajectory combined with unutilized service lines.
- **Segments**: `Strategic`, `Core`, `Growth`, `Emerging`, `Needs Attention`.
