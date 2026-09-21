import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';

export default function OpportunitiesSection({ opportunities, onSelectClient }) {
  const topOpps = (opportunities || []).slice(0, 4);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Institutional Opportunity Engine</h2>
            <p className="text-xs text-slate-500">Automated business development triggers & cross-sell conversation points</p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60 self-start sm:self-auto">
          {opportunities?.length || 18} Active Institutional Triggers
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {topOpps.map((opp, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                  {opp.category}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  opp.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {opp.priority} Priority
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 mt-2">{opp.client_name}</h4>
              <p className="text-[11px] text-slate-600 mt-1 italic leading-snug">
                "{opp.observation}"
              </p>

              <div className="mt-2.5 p-2 bg-white rounded-lg border border-slate-200/80 text-[11px] text-slate-800">
                <span className="font-semibold text-slate-900 block text-[10px] uppercase text-blue-800">
                  Potential Service Opportunity
                </span>
                {opp.potential_opportunity}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-medium font-mono">
                +${opp.estimated_rev_impact_usd_k}k Est. Rev
              </span>
              <button
                onClick={() => onSelectClient && onSelectClient(opp.client_id)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <span>View Client 360</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
