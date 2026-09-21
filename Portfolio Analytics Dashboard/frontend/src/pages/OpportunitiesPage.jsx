import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, TrendingUp, DollarSign, Filter } from 'lucide-react';
import { fetchOpportunities } from '../services/api';

export default function OpportunitiesPage({ onSelectClient }) {
  const [opportunities, setOpportunities] = useState([]);
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities()
      .then((data) => {
        setOpportunities(data?.opportunities || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredOpps = filterPriority === 'ALL'
    ? opportunities
    : opportunities.filter(o => o.priority === filterPriority);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Institutional Opportunity Engine</h2>
          <p className="text-xs text-slate-500">Systematic, rule-based cross-sell triggers and liquidity optimization insights</p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-medium">Filter Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Priorities ({opportunities.length})</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOpps.map((opp, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {opp.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  opp.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {opp.priority} Priority
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{opp.client_name}</h3>
                <span className="text-[10px] text-slate-400 font-mono">{opp.client_id}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Analyst Observation</span>
                "{opp.observation}"
              </div>

              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs text-slate-900 font-semibold">
                <span className="text-[10px] uppercase font-bold text-blue-800 block mb-0.5">Potential Service Solution</span>
                {opp.potential_opportunity}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-700">
                +${opp.estimated_rev_impact_usd_k}k Est. Revenue Headroom
              </span>
              <button
                onClick={() => onSelectClient && onSelectClient(opp.client_id)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <span>Client 360</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
