# Institutional Interview Preparation Guide

**Target Role**: Citi Services – Summer Analyst, India 2027 (Mumbai)  
**Context**: Institutional Portfolio Analytics, Cash Management, Custody, Risk Budgeting & Client Insights

---

### Q1: What problem does this project solve?
**Model Answer:**  
"Institutional service providers—such as Citi Services—manage trillions of dollars in assets across global pension funds, sovereign entities, and corporate treasuries. Relationship managers, custody operations, and risk officers cannot rely on disparate static reports to understand their book. This project builds an end-to-end analytics platform that reconciles portfolio performance, tracking error, Value-at-Risk, cash drag, and trade exceptions into an integrated dashboard. It translates raw accounting transactions into actionable client opportunities—such as automated cash sweeps, tri-party collateral financing, and trade settlement optimizations."

---

### Q2: Why did you build this using both Excel and Python?
**Model Answer:**  
"In institutional finance, Python and Excel serve complementary roles. Python excels at heavy data processing, vectorized statistical computations (like 95% Historical VaR and 60-month Time-Weighted Returns), and serving clean REST APIs. Excel, however, is the universal language of financial institutions. I built a dynamic 13-sheet Excel model using `SUMIFS`, `XLOOKUP`, and `STDEV.S` so that any senior analyst or relationship manager can audit formulas directly, verify calculations independently, and inspect client summaries without needing a coding environment."

---

### Q3: How is Time-Weighted Return (TWR) different from Money-Weighted Return (IRR / Dietz)?
**Model Answer:**  
"Time-Weighted Return (TWR) measures pure portfolio investment management skill by geometrically linking period returns and removing the impact of external client cash deposits or withdrawals. This is the mandatory standard for comparing a fund manager to a benchmark index. Money-Weighted Return (IRR / Modified Dietz), on the other hand, accounts for the exact timing and magnitude of external cash flows, measuring the actual net dollar return experienced by the client. An analyst uses TWR to evaluate manager skill and IRR to understand client wealth accumulation."

---

### Q4: What is the Sharpe Ratio, and what are its key limitations?
**Model Answer:**  
"The Sharpe Ratio measures excess return earned per unit of total risk:
$$\text{Sharpe} = \frac{R_p - R_f}{\sigma_p}$$
In our platform, we use a 4.5% risk-free rate. While it is the industry standard for risk-adjusted performance, its key limitation is that it treats upside and downside volatility identically and assumes returns are normally distributed. In strategies with fat tails or positive skewness, Sharpe can penalize high upside gains. That is why our platform also provides the Sortino Ratio to evaluate downside semi-deviation alone."

---

### Q5: What is Tracking Error and Information Ratio?
**Model Answer:**  
"Tracking Error (TE) is the annualized standard deviation of active returns ($R_p - R_b$), reflecting how closely a portfolio tracks its benchmark mandate. The Information Ratio (IR) divides the annualized active return by the tracking error. It tells us whether a manager's active excess return was achieved through consistent analytical skill or random, volatile bets. An Information Ratio above 0.50 is widely considered strong institutional skill."

---

### Q6: How does your Cash & Liquidity Module identify client opportunities?
**Model Answer:**  
"We developed a Student-Defined Cash Efficiency Index that compares a client's target operating buffer (4% of AUM) against their actual uninvested custody cash balance. When a sovereign or corporate client maintains an uninvested cash ratio above 10–13%—such as Atlas Sovereign Fund holding $1.65B in cash—the engine flags an automated conversation opportunity for multi-currency automated cash sweeps, overnight yield optimization, and collateral management mandates."

---

### Q7: What is Historical Value-at-Risk (95% VaR) and why must analysts understand its limitations?
**Model Answer:**  
"Our 95% Historical VaR calculates the empirical 5th percentile of historical returns scaled to 1-day and 10-day holding horizons. It indicates that under normal market conditions, there is a 95% probability daily loss will not exceed that threshold. However, analysts must explicitly understand that VaR does not forecast the magnitude of losses beyond that 5% cutoff during black swan events or liquidity crises (tail risk), which is why stress testing and drawdown analysis must accompany VaR."

---

### Q8: How did you ensure data accuracy and operational exception tracking?
**Model Answer:**  
"Attention to detail and data integrity are fundamental to institutional operations. We built a dedicated Data Quality and Exception Engine that audits trade reconciliation breaks, failed settlements ($T+1 / T+2$), negative fee anomalies, and single-name concentration breaches ($>15\%$). Every exception alert clearly specifies **WHAT** happened, **WHY** it was flagged, and the **EXACT DATA** that triggered the breach."

---

### Q9: How would a Citi Services team use this platform to support business development?
**Model Answer:**  
"A coverage banker or summer analyst preparing for a quarterly client review can open the Client 360 page to review the service utilization matrix across all 8 Citi Services lines. If an institutional client trades heavily across foreign currencies but lacks an active FX mandate, or holds $1B+ in bonds without collateral financing, the system surfaces these as high-priority, data-backed cross-sell opportunities with estimated revenue impact."

---

### Q10: What would you improve if given access to live institutional market data?
**Model Answer:**  
"With live production feeds, I would integrate real-time FIX protocol trade affirmations for intraday settlement monitoring, multi-factor risk decomposition (Fama-French / Barra factor attribution), automated SWIFT cash message parsing (MT940/MT950), and dynamic stress-testing models simulating interest rate curve shocks and geopolitical liquidity dislocations."
