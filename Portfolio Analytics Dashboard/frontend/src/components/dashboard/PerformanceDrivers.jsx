import React from 'react';
import { ArrowUpRight, ArrowDownRight, Compass } from 'lucide-react';

const TOP_CONTRIBUTORS = [
  { name: "NVIDIA Corp. (NVDA)", ticker: "NVDA", asset: "US Equity", weight: "4.8%", returnPct: "+38.4%", contribution: "+1.84%" },
  { name: "Reliance Industries (RELIANCE_IN)", ticker: "RELIANCE_IN", asset: "Indian Equity", weight: "3.5%", returnPct: "+22.1%", contribution: "+0.77%" },
  { name: "Microsoft Corp. (MSFT)", ticker: "MSFT", asset: "US Equity", weight: "5.2%", returnPct: "+14.2%", contribution: "+0.74%" }
];

const TOP_DETRACTORS = [
  { name: "UK 10-Yr Gilt 3.75%", ticker: "UK_10Y_GILT", asset: "Govt Bonds", weight: "3.2%", returnPct: "-6.8%", contribution: "-0.22%" },
  { name: "Germany Bund 2.60%", ticker: "GER_10Y_BUND", asset: "Govt Bonds", weight: "2.8%", returnPct: "-4.5%", contribution: "-0.13%" },
  { name: "Euro High Grade Bond", ticker: "CORP_IG_EUR", asset: "Corp Credit", weight: "2.1%", returnPct: "-3.1%", contribution: "-0.07%" }
];

export default function PerformanceDrivers() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">What's Driving Performance?</h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Attribution Breakdown</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Contributors */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
            <span>Top Contributors (Alpha Drivers)</span>
            <span>Impact</span>
          </div>
          <div className="space-y-2">
            {TOP_CONTRIBUTORS.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <div className="font-semibold text-slate-800 flex items-center space-x-1">
                    <span>{c.ticker}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({c.asset})</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Weight: {c.weight} | Return: {c.returnPct}</div>
                </div>
                <div className="flex items-center text-emerald-600 font-mono font-bold text-xs">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  <span>{c.contribution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Detractors */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded">
            <span>Top Detractors (Drag Factors)</span>
            <span>Impact</span>
          </div>
          <div className="space-y-2">
            {TOP_DETRACTORS.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <div className="font-semibold text-slate-800 flex items-center space-x-1">
                    <span>{d.ticker}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({d.asset})</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Weight: {d.weight} | Return: {d.returnPct}</div>
                </div>
                <div className="flex items-center text-rose-600 font-mono font-bold text-xs">
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                  <span>{d.contribution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
