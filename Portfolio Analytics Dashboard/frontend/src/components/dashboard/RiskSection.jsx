import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import TooltipHelp from '../common/TooltipHelp';

export default function RiskSection({ riskData }) {
  const portfoliosRisk = riskData?.portfolios_risk || [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Risk Analytics & Volatility Distribution</h2>
            <TooltipHelp metricKey="SHARPE_RATIO" label="Risk-Adjusted Return" />
          </div>
          <p className="text-xs text-slate-500">Portfolio Volatility vs Return vs Sharpe Ratio vs VaR</p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="flex items-center space-x-1 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            <span>Portfolios</span>
          </span>
          <TooltipHelp metricKey="VAR_95" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Risk-Return Scatter Plot */}
        <div className="lg:col-span-8">
          <div className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">
            Risk-Return Efficiency Frontier (X: Ann Volatility % | Y: Ann Return %)
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  type="number"
                  dataKey="annualized_volatility_pct"
                  name="Annualized Volatility"
                  unit="%"
                  tick={{ fontSize: 10, fill: '#64748B' }}
                />
                <YAxis
                  type="number"
                  dataKey="annualized_return_pct"
                  name="Annualized Return"
                  unit="%"
                  tick={{ fontSize: 10, fill: '#64748B' }}
                />
                <ZAxis type="number" dataKey="aum_usd_m" range={[40, 200]} name="AUM ($M)" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-xl border border-slate-800">
                          <div className="font-bold text-blue-300">{data.portfolio_id}</div>
                          <div className="text-[11px] text-slate-300">{data.client_name}</div>
                          <div className="mt-1 pt-1 border-t border-slate-800 space-y-0.5 font-mono text-[11px]">
                            <div>Return: {data.annualized_return_pct}%</div>
                            <div>Vol: {data.annualized_volatility_pct}%</div>
                            <div>Sharpe: {data.sharpe_ratio}</div>
                            <div>1D VaR: ${data.var_1d_usd_m}M</div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Portfolios" data={portfoliosRisk} fill="#2563EB" opacity={0.8} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Metrics Quick Insight Table */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Risk Profile Snapshot
            </span>

            <div className="space-y-2.5 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-800 block">Avg Portfolio Sharpe</span>
                  <span className="text-[10px] text-slate-400">Target hurdle &gt; 0.50</span>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm">0.58</span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-800 block">Aggregate 1-Day VaR (95%)</span>
                  <span className="text-[10px] text-slate-400">Normal market conditions</span>
                </div>
                <span className="font-mono font-bold text-blue-700 text-sm">$48.2M</span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-800 block">Single-Name Concentration</span>
                  <span className="text-[10px] text-slate-400">Threshold: 15.0%</span>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                  1 Exception
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded text-[10px] text-blue-800 leading-snug">
            <strong>Analyst Note:</strong> P-104 maintains a 24.5% position in Apple Inc., triggering a single-position concentration risk alert.
          </div>
        </div>
      </div>
    </div>
  );
}
