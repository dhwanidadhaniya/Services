import React from 'react';
import { Droplets, AlertCircle, ArrowUpRight, Gauge } from 'lucide-react';
import TooltipHelp from '../common/TooltipHelp';

export default function LiquiditySection({ liquidityData }) {
  const clientsLiq = (liquidityData?.client_liquidity || []).slice(0, 6);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Institutional Cash & Liquidity Management</h2>
            <TooltipHelp metricKey="CASH_EFFICIENCY" label="Cash Efficiency Index" />
          </div>
          <p className="text-xs text-slate-500">Uninvested cash balances, days of liquidity runway, and idle cash sweeps</p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-200/60">
            Target Buffer: 4.0% of AUM
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider bg-slate-50/70">
              <th className="py-2.5 px-3">Client Entity</th>
              <th className="py-2.5 px-3">Client Type</th>
              <th className="py-2.5 px-3 text-right">Total AUM</th>
              <th className="py-2.5 px-3 text-right">Cash Balance</th>
              <th className="py-2.5 px-3 text-right">Cash %</th>
              <th className="py-2.5 px-3 text-right">Idle Cash ($M)</th>
              <th className="py-2.5 px-3 text-right">Days Liq</th>
              <th className="py-2.5 px-3 text-center">Cash Efficiency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clientsLiq.map((c) => {
              const isHighCash = c.cash_ratio_pct > 10.0;
              return (
                <tr key={c.client_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{c.client_name}</td>
                  <td className="py-2.5 px-3 text-slate-500">{c.client_type}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-800">${c.aum_usd_m.toLocaleString()}M</td>
                  <td className={`py-2.5 px-3 text-right font-mono font-semibold ${isHighCash ? 'text-amber-700' : 'text-slate-800'}`}>
                    ${c.cash_balance_usd_m.toLocaleString()}M
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                      isHighCash ? 'bg-amber-100 text-amber-800' : 'text-slate-700'
                    }`}>
                      {c.cash_ratio_pct}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">${c.idle_cash_usd_m}M</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">{c.days_of_liquidity}d</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                      c.cash_efficiency_index < 0.6
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {c.cash_efficiency_index}x ({c.cash_efficiency_index < 0.6 ? 'Cash Drag' : 'Optimal'})
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
