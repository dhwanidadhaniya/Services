import React, { useState, useEffect } from 'react';
import { ShieldAlert, Droplets, Gauge, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';
import { fetchRiskAnalytics, fetchLiquidityAnalytics } from '../services/api';
import TooltipHelp from '../components/common/TooltipHelp';

export default function RiskLiquidityPage() {
  const [riskData, setRiskData] = useState(null);
  const [liqData, setLiqData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchRiskAnalytics(), fetchLiquidityAnalytics()])
      .then(([r, l]) => {
        setRiskData(r);
        setLiqData(l);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="h-96 flex items-center justify-center text-xs text-slate-400">Loading Risk & Liquidity Module...</div>;
  }

  const clientLiquidity = liqData?.client_liquidity || [];
  const portfoliosRisk = riskData?.portfolios_risk || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900">Institutional Risk & Cash Liquidity Diagnostic</h2>
        <p className="text-xs text-slate-500">Historical Value-at-Risk (95%), concentration scoring (HHI), and cash efficiency framework</p>
      </div>

      {/* Top Diagnostic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Historical VaR Framework</span>
            <TooltipHelp metricKey="VAR_95" />
          </div>
          <div className="mt-2 space-y-1">
            <div className="text-2xl font-bold font-mono text-slate-900">$48.2M</div>
            <div className="text-xs text-slate-500">1-Day 95% Confidence Loss Threshold</div>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 font-mono">10-Day VaR: $152.4M</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Single-Name Concentration</span>
            <TooltipHelp metricKey="CONCENTRATION_HHI" />
          </div>
          <div className="mt-2 space-y-1">
            <div className="text-2xl font-bold font-mono text-amber-600">24.5% Peak</div>
            <div className="text-xs text-slate-500">Policy Breach Limit: 15.0%</div>
            <div className="text-[11px] text-amber-700 pt-1 border-t border-slate-100">1 Portfolio Flagged (P-104)</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Total Idle Custody Cash</span>
            <TooltipHelp metricKey="CASH_EFFICIENCY" />
          </div>
          <div className="mt-2 space-y-1">
            <div className="text-2xl font-bold font-mono text-slate-900">$2,480.0M</div>
            <div className="text-xs text-slate-500">Above Required 4% Operating Buffer</div>
            <div className="text-[11px] text-blue-700 pt-1 border-t border-slate-100">Direct Multi-Currency Sweep Opportunity</div>
          </div>
        </div>
      </div>

      {/* Client Cash Efficiency Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Client Cash Efficiency & Runway Analysis</h3>
            <p className="text-xs text-slate-400">Comparing required operating liquidity vs actual custody cash held</p>
          </div>
          <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded">25 Institutional Accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] uppercase text-slate-500 font-bold">
                <th className="py-2.5 px-3">Client Entity</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">AUM ($M)</th>
                <th className="py-2.5 px-3 text-right">Cash Balance</th>
                <th className="py-2.5 px-3 text-right">Cash %</th>
                <th className="py-2.5 px-3 text-right">Idle Cash ($M)</th>
                <th className="py-2.5 px-3 text-right">Days Liquidity</th>
                <th className="py-2.5 px-3 text-center">Efficiency Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clientLiquidity.map((c) => (
                <tr key={c.client_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{c.client_name}</td>
                  <td className="py-2.5 px-3 text-slate-500">{c.client_type}</td>
                  <td className="py-2.5 px-3 text-right font-mono">${c.aum_usd_m.toLocaleString()}M</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">${c.cash_balance_usd_m.toLocaleString()}M</td>
                  <td className="py-2.5 px-3 text-right font-mono">{c.cash_ratio_pct}%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">${c.idle_cash_usd_m}M</td>
                  <td className="py-2.5 px-3 text-right font-mono">{c.days_of_liquidity}d</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                      c.cash_efficiency_index < 0.6 ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {c.cash_efficiency_index}x ({c.status})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
