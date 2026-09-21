import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  Cell
} from 'recharts';
import { TrendingUp, BarChart3, ShieldAlert, Award, Activity } from 'lucide-react';
import TooltipHelp from '../common/TooltipHelp';

export default function PerformanceSection({ perfData }) {
  const [activeChart, setActiveChart] = useState('cumulative'); // 'cumulative' | 'monthly' | 'drawdown'
  const timeSeries = perfData?.time_series || [];
  const summary = perfData?.summary || {};

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
      {/* Section Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Portfolio Performance & Benchmark Attribution</h2>
            <TooltipHelp metricKey="TWR" label="Time-Weighted Return" />
          </div>
          <p className="text-xs text-slate-500">Historical performance vs designated benchmark index (2021-2026)</p>
        </div>

        {/* Chart View Switcher */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setActiveChart('cumulative')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeChart === 'cumulative' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cumulative Growth
          </button>
          <button
            onClick={() => setActiveChart('monthly')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeChart === 'monthly' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Returns
          </button>
          <button
            onClick={() => setActiveChart('drawdown')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeChart === 'drawdown' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Drawdown Curve
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-5">
        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-semibold">
            <span>Portfolio Ann. Ret</span>
            <TooltipHelp metricKey="TWR" />
          </div>
          <div className="text-base font-bold text-slate-900 mt-0.5">
            {summary.portfolio_annualized_return_pct ?? 10.8}%
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-semibold">
            <span>Benchmark Ann. Ret</span>
          </div>
          <div className="text-base font-bold text-slate-600 mt-0.5">
            {summary.benchmark_annualized_return_pct ?? 9.5}%
          </div>
        </div>

        <div className="bg-blue-50/60 border border-blue-100 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-[10px] text-blue-700 uppercase font-semibold">
            <span>Active Alpha</span>
            <TooltipHelp metricKey="ACTIVE_RETURN" />
          </div>
          <div className="text-base font-bold text-blue-700 mt-0.5 font-mono">
            +{summary.active_return_pct ?? 1.30}%
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-semibold">
            <span>Tracking Error</span>
            <TooltipHelp metricKey="TRACKING_ERROR" />
          </div>
          <div className="text-base font-bold text-slate-900 mt-0.5">
            {summary.tracking_error_pct ?? 2.40}%
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-semibold">
            <span>Information Ratio</span>
            <TooltipHelp metricKey="INFORMATION_RATIO" />
          </div>
          <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">
            {summary.information_ratio ?? 0.54}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-semibold">
            <span>Max Drawdown</span>
            <TooltipHelp metricKey="MAX_DRAWDOWN" />
          </div>
          <div className="text-base font-bold text-rose-600 mt-0.5 font-mono">
            {summary.max_drawdown_pct ?? -12.4}%
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="h-72 w-full">
        {activeChart === 'cumulative' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#FFF', fontSize: '11px' }}
                formatter={(val) => [`${val}`, 'Growth Index (Base 100)']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="portfolio_index"
                name="Portfolio Value Index"
                stroke="#1E3A8A"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="benchmark_index"
                name="Benchmark Index"
                stroke="#94A3B8"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'monthly' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#FFF', fontSize: '11px' }}
                formatter={(val) => [`${val}%`, 'Monthly Return']}
              />
              <ReferenceLine y={0} stroke="#64748B" />
              <Bar dataKey="portfolio_monthly_ret" name="Monthly Return %">
                {timeSeries.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.portfolio_monthly_ret >= 0 ? '#10B981' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'drawdown' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#FFF', fontSize: '11px' }}
                formatter={(val) => [`${val}%`, 'Underwater Drawdown']}
              />
              <ReferenceLine y={0} stroke="#64748B" />
              <Area
                type="monotone"
                dataKey="drawdown_pct"
                name="Drawdown from Peak"
                stroke="#EF4444"
                fill="#FEE2E2"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
