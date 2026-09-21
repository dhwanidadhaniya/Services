import React, { useState } from 'react';
import { HelpCircle, X, Info } from 'lucide-react';

export const FINANCIAL_GLOSSARY = {
  AUM: {
    term: "Assets Under Management (AUM)",
    definition: "Total market value of all investment assets, cash holdings, and securities administered or managed on behalf of an institutional client.",
    formula: "AUM = Sum(Quantity_i * Current_Price_i) + Cash_Balance",
    interpretation: "Reflects the scale and commercial depth of the institutional client relationship.",
    whyItMatters: "Directly determines custody fee revenue, collateral capacity, and service tier allocation.",
    example: "Atlas Sovereign Fund maintains $12,500.0M across 4 segregated custody accounts.",
    limitation: "AUM fluctuates with market price volatility even without external client cash deposits or withdrawals."
  },
  TWR: {
    term: "Time-Weighted Return (TWR)",
    definition: "A compounding multi-period rate of return that eliminates the distorting effects of client cash deposits and withdrawals.",
    formula: "TWR = Product_{t=1}^N (1 + R_t) - 1",
    interpretation: "Measures pure investment selection and management skill independent of client cash timing.",
    whyItMatters: "Mandated standard in institutional asset management (GIPS compliance) for comparing portfolio managers against benchmark hurdles.",
    example: "A portfolio returning +10% in Month 1 and -5% in Month 2 yields a TWR of (1.10 * 0.95) - 1 = +4.50%.",
    limitation: "Does not reflect the actual dollar-weighted wealth generated if large cash sums were deposited right before a market downturn."
  },
  ACTIVE_RETURN: {
    term: "Active Return (Alpha)",
    definition: "The difference between the portfolio's annualized return and its designated benchmark index return.",
    formula: "Active Return = Portfolio Return (R_p) - Benchmark Return (R_b)",
    interpretation: "Positive active return indicates benchmark outperformance; negative indicates underperformance.",
    whyItMatters: "Validates whether active management fees are justified compared to passive index tracking.",
    example: "If a global equity strategy achieves +11.2% while MSCI World delivers +9.8%, Active Return is +1.40% (140 bps).",
    limitation: "Can be misleading if the portfolio takes excessive uncompensated risk or deviates outside its benchmark mandate."
  },
  SHARPE_RATIO: {
    term: "Sharpe Ratio",
    definition: "The classic risk-adjusted return metric measuring excess return earned per unit of total portfolio volatility.",
    formula: "Sharpe Ratio = (Annualized Return - Risk-Free Rate) / Annualized Volatility",
    interpretation: "Higher values indicate superior return generated per unit of total risk. Negative values indicate underperforming the risk-free rate.",
    whyItMatters: "Enables fair institutional comparison across asset classes and risk profiles with different volatility baselines.",
    example: "With 10.5% return, 4.5% risk-free rate, and 12.0% volatility: Sharpe = (10.5 - 4.5) / 12 = 0.50.",
    limitation: "Penalizes upside volatility equally with downside volatility, and assumes returns follow a normal bell curve."
  },
  SORTINO_RATIO: {
    term: "Sortino Ratio",
    definition: "A variation of the Sharpe ratio that differentiates harmful downside volatility from beneficial upside volatility.",
    formula: "Sortino Ratio = (Annualized Return - Risk-Free Rate) / Downside Semi-Deviation",
    interpretation: "Higher is better. Evaluates returns against only the volatility of negative or sub-hurdle periods.",
    whyItMatters: "Provides a more realistic assessment for asymmetric strategies (e.g. equity long/short, fixed income hedging).",
    example: "A strategy with frequent small gains and zero large losses has a high Sortino even if total standard deviation is moderate.",
    limitation: "Requires sufficient historical downside observations to calculate a robust semi-deviation estimate."
  },
  VOLATILITY: {
    term: "Annualized Volatility",
    definition: "The sample standard deviation of monthly returns scaled to an annual frequency via the square root of time.",
    formula: "Annualized Volatility = sqrt(12) * Sample_StdDev(Monthly_Returns)",
    interpretation: "Measures the dispersion and uncertainty of returns around the expected mean.",
    whyItMatters: "Fundamental input into institutional Value-at-Risk, margin requirements, and risk budgets.",
    example: "A monthly standard deviation of 3.5% scales to an annualized volatility of 3.5% * sqrt(12) = 12.12%.",
    limitation: "Assumes volatility is constant across time and does not capture regime shifts or liquidity shocks."
  },
  TRACKING_ERROR: {
    term: "Tracking Error (TE)",
    definition: "The annualized standard deviation of excess returns (Active Returns) relative to the benchmark index.",
    formula: "Tracking Error = sqrt( 12 / (N-1) * Sum(Active_t - Mean_Active)^2 )",
    interpretation: "Lower TE indicates strict benchmark tracking; higher TE indicates active tactical bets.",
    whyItMatters: "Essential for risk budgeting and evaluating passive index funds vs active satellite managers.",
    example: "An enhanced index fund maintains a tight TE of 1.2%, whereas an active stock-picker operates at 4.5% TE.",
    limitation: "High tracking error can be either positive (high alpha generator) or negative (unintended factor drift)."
  },
  INFORMATION_RATIO: {
    term: "Information Ratio (IR)",
    definition: "The ratio of annualized active return to tracking error.",
    formula: "Information Ratio = Annualized Active Return / Annualized Tracking Error",
    interpretation: "Quantifies the manager's ability to generate excess returns relative to a benchmark per unit of active risk.",
    whyItMatters: "Widely regarded in institutional asset management as the gold standard for measuring pure manager skill.",
    example: "With +1.5% Active Return and 2.5% Tracking Error: IR = 1.5 / 2.5 = 0.60 (Top quartile institutional skill).",
    limitation: "Sensitive to short time horizons where a single large outlier month can distort the ratio."
  },
  MAX_DRAWDOWN: {
    term: "Maximum Drawdown (MDD)",
    definition: "The maximum observed peak-to-trough decline in portfolio cumulative NAV before a new peak is attained.",
    formula: "MDD = min_t ( (NAV_t - max_{s <= t} NAV_s) / max_{s <= t} NAV_s )",
    interpretation: "Measures worst-case historical capital impairment and pain experienced by the investor.",
    whyItMatters: "Critical for evaluating institutional solvency, collateral calls, and client redemption triggers.",
    example: "If portfolio NAV peaks at $120M, drops to $90M, and later rebounds to $130M: MDD is (90 - 120)/120 = -25.0%.",
    limitation: "Historical metric that does not predict future structural crashes or unprecedented liquidity squeezes."
  },
  VAR_95: {
    term: "Historical Value-at-Risk (95% VaR)",
    definition: "The estimated dollar or percentage loss that is expected to be exceeded only 5% of the time over a specified horizon.",
    formula: "VaR_95 = -Quantile(Historical_Monthly_Returns, 0.05) * Portfolio_Value * (1 / sqrt(21))",
    interpretation: "With 95% confidence, 1-day trading loss will not exceed this threshold under normal market conditions.",
    whyItMatters: "Standard institutional metric used by custodians and risk committees to monitor overnight collateral exposure.",
    example: "A 1-Day 95% VaR of $1.8M means there is only a 5% chance the portfolio will lose more than $1.8M on any given trading day.",
    limitation: "CRITICAL: VaR does NOT measure how severe the loss will be when the 5% threshold is breached (tail risk / black swan)."
  },
  CASH_RATIO: {
    term: "Cash / AUM Ratio",
    definition: "The proportion of total institutional client assets maintained in uninvested cash or overnight money market liquidity.",
    formula: "Cash Ratio (%) = (Uninvested Custody Cash / Total AUM) * 100",
    interpretation: "High cash (>10%) suggests defensive positioning, pending acquisitions, or uninvested cash drag.",
    whyItMatters: "Identifies automated liquidity management, multi-currency cash sweeps, and treasury yield optimization opportunities.",
    example: "Atlas Sovereign Fund holds $1,650M in cash on $12,500M AUM (13.2% Cash Ratio).",
    limitation: "High cash may be intentionally held for imminent private equity capital calls or pension benefit payouts."
  },
  CASH_EFFICIENCY: {
    term: "Student-Defined Cash Efficiency Index",
    definition: "A student-designed diagnostic ratio comparing required operating liquidity against actual cash balances held.",
    formula: "Cash Efficiency = Target Operating Buffer (4% of AUM) / Actual Cash Balance",
    interpretation: "~1.0 = Optimal liquidity; < 0.6 = Sub-optimal idle cash drag; > 1.4 = Tight liquidity squeeze risk.",
    whyItMatters: "Helps banking analysts identify institutional clients ready for liquidity sweep optimization discussions.",
    example: "A client requiring $40M buffer but holding $100M has an index of 0.40 (Sub-optimal cash drag).",
    limitation: "Custom student prototype metric; not an official Basel III or regulatory banking standard."
  },
  CONCENTRATION_HHI: {
    term: "Concentration Index (HHI)",
    definition: "Herfindahl-Hirschman Index adapted for portfolio positions, calculating the sum of squared holding percentage weights.",
    formula: "HHI = Sum_{i=1}^M (Weight_i %)^2",
    interpretation: "Scores range from ~100 (equal weight in 100 stocks) to 10,000 (100% in one stock). HHI > 2500 indicates high concentration.",
    whyItMatters: "Detects single-issuer risk breaches and sector over-allocations before they trigger regulatory or policy flags.",
    example: "A portfolio with a 25% holding generates 625 points from that single security alone.",
    limitation: "Treats correlated holdings in different sectors as independent unless paired with sector/country breakdown."
  },
  CLIENT_HEALTH_SCORE: {
    term: "Student-Defined Client Health Score",
    definition: "A composite multi-factor rating (0-100) evaluating the strength, engagement, and operational vitality of an institutional relationship.",
    formula: "Health = 0.25*Perf + 0.20*AUM_Growth + 0.15*Rev_Efficiency + 0.15*Txn_Activity + 0.15*Service_Breadth + 0.10*Liquidity_Balance",
    interpretation: "80-100: Strategic Health; 65-79: Core Stable; 50-64: Moderate Opportunity; <50: Needs Attention / Watchlist.",
    whyItMatters: "Provides relationship managers with an early warning signal on client expansion or attrition risk.",
    example: "Northstar Pension Fund scores 84.5 (Strategic) due to steady AUM growth, broad service usage, and high trade volume.",
    limitation: "Custom analytical model designed for student portfolio presentation; weights are subject to institutional calibration."
  }
};

export default function TooltipHelp({ metricKey, label, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const data = FINANCIAL_GLOSSARY[metricKey] || {
    term: label || "Financial Metric",
    definition: "Institutional analytical metric calculated across client and portfolio records.",
    formula: "Refer to Methodology Documentation",
    interpretation: "Evaluated in context of portfolio strategy and client mandate.",
    whyItMatters: "Core indicator used in institutional custody and risk reporting.",
    example: "Derived from multi-year synthetic institutional transactions.",
    limitation: "Subject to data availability and market conditions."
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="text-slate-400 hover:text-blue-600 focus:outline-none transition-colors ml-1"
        title="View financial methodology, formula, and limitations"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div
            className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 text-left relative animate-in fade-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{data.term}</h3>
                  <span className="text-xs text-blue-600 font-medium">Financial Methodology & Interpretation</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-600 leading-relaxed max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] block mb-1">Plain-English Definition</span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{data.definition}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] block mb-1">Mathematical Formula</span>
                <p className="font-mono text-slate-900 bg-blue-50/70 p-2.5 rounded-lg border border-blue-100/80 text-[11px] font-medium">{data.formula}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] block mb-1">How to Interpret</span>
                  <p className="text-slate-600 text-[11px]">{data.interpretation}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] block mb-1">Why It Matters</span>
                  <p className="text-slate-600 text-[11px]">{data.whyItMatters}</p>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] block mb-1">Practical Example</span>
                <p className="text-slate-700 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100/60 text-[11px]">{data.example}</p>
              </div>

              <div>
                <span className="font-semibold text-rose-800 uppercase tracking-wider text-[10px] block mb-1">Key Analytical Limitations</span>
                <p className="text-rose-900 bg-rose-50/60 p-2 rounded-lg border border-rose-100/80 text-[11px]">{data.limitation}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
              <span>Citi Services Summer Analyst 2027 Prototype</span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
