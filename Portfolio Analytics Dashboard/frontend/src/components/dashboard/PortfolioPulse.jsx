import React from 'react';
import { Activity, CheckCircle, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import TooltipHelp from '../common/TooltipHelp';

export default function PortfolioPulse({ kpis }) {
  const activeRet = kpis?.active_return_pct ?? 1.3;
  const cashRatio = kpis?.cash_ratio_pct ?? 6.4;
  const isBeating = activeRet > 0;

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-700/50">
      {/* Left Pulse Meta */}
      <div className="flex items-start space-x-3.5">
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
          <Activity className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">Portfolio Pulse</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Active Book Normal
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Aggregate institutional book is <strong className="text-white">outperforming benchmark hurdles by +{activeRet}% annualized alpha</strong>. Cash deployment is stable with <strong className="text-white">{cashRatio}% uninvested custody liquidity</strong>.
          </p>
        </div>
      </div>

      {/* Right Quick Summary Badges */}
      <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end text-xs">
        <div className="bg-slate-800/80 border border-slate-700 px-3 py-2 rounded-lg flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Alpha</div>
            <div className="font-mono font-bold text-emerald-400">+{activeRet}%</div>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 px-3 py-2 rounded-lg flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-blue-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Settlement Rate</div>
            <div className="font-mono font-bold text-white">{kpis?.settlement_efficiency_pct ?? 98.8}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
