import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import TooltipHelp from './TooltipHelp';

export default function MetricCard({
  title,
  value,
  previousValue,
  changePct,
  changeLabel = "vs prev period",
  metricKey,
  format = "number",
  icon: Icon,
  subtitle,
  positiveIsGood = true,
  className = ""
}) {
  const isPositive = changePct > 0;
  const isZero = changePct === 0 || changePct === undefined || changePct === null;

  let trendColor = "text-slate-500 bg-slate-50";
  let TrendIcon = Minus;

  if (!isZero) {
    if ((isPositive && positiveIsGood) || (!isPositive && !positiveIsGood)) {
      trendColor = "text-emerald-700 bg-emerald-50 border-emerald-200/60";
      TrendIcon = isPositive ? TrendingUp : TrendingDown;
    } else {
      trendColor = "text-rose-700 bg-rose-50 border-rose-200/60";
      TrendIcon = isPositive ? TrendingUp : TrendingDown;
    }
  }

  return (
    <div className={`kpi-card rounded-xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden ${className}`}>
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-1.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
          {metricKey && <TooltipHelp metricKey={metricKey} label={title} />}
        </div>
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Main KPI Value */}
      <div className="my-2">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-sans">
          {value}
        </div>
        {subtitle && (
          <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>
        )}
      </div>

      {/* Bottom Delta and Benchmark Context */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        {changePct !== undefined && changePct !== null ? (
          <div className="flex items-center space-x-1.5">
            <span className={`inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded border text-[11px] font-medium ${trendColor}`}>
              <TrendIcon className="w-3 h-3" />
              <span>{changePct > 0 ? `+${changePct}%` : `${changePct}%`}</span>
            </span>
            <span className="text-slate-400 text-[11px]">{changeLabel}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-[11px]">Synthetic Verified Metric</span>
        )}
        {previousValue && (
          <span className="text-slate-400 text-[11px]">Prev: {previousValue}</span>
        )}
      </div>
    </div>
  );
}
