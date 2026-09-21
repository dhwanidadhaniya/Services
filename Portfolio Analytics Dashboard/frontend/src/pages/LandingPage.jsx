import React from 'react';
import { Play, ArrowRight, BarChart3, ShieldCheck, Users, FileSpreadsheet, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { useFilters } from '../context/FilterContext';

export default function LandingPage({ onOpenAnalytics, onOpenTab }) {
  const { runDemoScenario } = useFilters();

  const handleDemoClick = () => {
    runDemoScenario();
    if (onOpenAnalytics) {
      onOpenAnalytics();
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Citi Services – Summer Analyst, India 2027 (Mumbai)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Financial Services / Portfolio Analytics Dashboard
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          Turning institutional portfolio and client transaction data into actionable financial insights across performance, risk, liquidity, and cross-sell opportunities.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenAnalytics}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <span>Open Executive Analytics</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleDemoClick}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Run Interview Demo (Atlas Sovereign Fund)</span>
          </button>
        </div>
      </div>

      {/* 3 Core Analytical Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Performance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Performance Analytics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Understand returns, Time-Weighted Returns (TWR), active alpha generation, tracking error, and benchmark comparisons against global indices (NIFTY 50, S&P 500, MSCI World).
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs text-blue-700 font-semibold">
            <span>TWR • Modified Dietz • Information Ratio</span>
          </div>
        </div>

        {/* Pillar 2: Risk & Liquidity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Risk & Liquidity Framework</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Measure annualized volatility, Sharpe/Sortino ratios, 95% Historical Value-at-Risk (1D & 10D), maximum drawdowns, uninvested idle cash, and concentration scoring (HHI).
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs text-emerald-700 font-semibold">
            <span>Historical VaR • Sharpe • Cash Efficiency</span>
          </div>
        </div>

        {/* Pillar 3: Client Insights */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Client Insights & Opportunities</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Analyze institutional relationship health, 2D client segmentation, service utilization heatmaps across 8 Citi Services lines, and rule-based business development triggers.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs text-indigo-700 font-semibold">
            <span>Health Score • Cross-Sell • Service Heatmap</span>
          </div>
        </div>
      </div>

      {/* Institutional Services Scope Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Citi Services Workflow Scope</span>
            <h3 className="text-lg font-bold text-white">Full Cross-Functional Institutional Capabilities</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Built specifically around institutional financial services: Cash Management, Custody, Trade Finance, Fund Administration, Collateral Management, FX Services, Liquidity Management, and Performance Analytics.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs w-full lg:w-auto">
            {['Cash Management', 'Trade Finance', 'Global Custody', 'Fund Admin', 'Collateral Mgt', 'FX Solutions', 'Liquidity Sweeps', 'Perf. Analytics'].map((s, idx) => (
              <div key={idx} className="bg-slate-800/90 border border-slate-700 px-3 py-2 rounded-lg font-medium text-slate-200 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
