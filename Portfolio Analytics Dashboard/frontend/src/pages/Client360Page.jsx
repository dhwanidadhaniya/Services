import React, { useState, useEffect } from 'react';
import {
  Users,
  PieChart,
  Activity,
  Droplets,
  ArrowLeftRight,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Building,
  Award
} from 'lucide-react';
import { fetchClients, fetchClientDetail } from '../services/api';
import TooltipHelp from '../components/common/TooltipHelp';

export default function Client360Page({ selectedClientId, onSelectPortfolio }) {
  const [clients, setClients] = useState([]);
  const [currentId, setCurrentId] = useState(selectedClientId || 'CLT-1005'); // Default Atlas Sovereign Fund
  const [clientDetail, setClientDetail] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview | performance | risk | liquidity | services | opportunities
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients().then(setClients).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      setCurrentId(selectedClientId);
    }
  }, [selectedClientId]);

  useEffect(() => {
    if (!currentId) return;
    setLoading(true);
    fetchClientDetail(currentId)
      .then((data) => {
        setClientDetail(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching client detail:", err);
        setLoading(false);
      });
  }, [currentId]);

  if (loading || !clientDetail) {
    return (
      <div className="h-96 flex items-center justify-center text-xs text-slate-400">
        Loading Client 360 Profile...
      </div>
    );
  }

  const { client_info, portfolios, performance, concentration, liquidity, health, segmentation, opportunities, service_matrix } = clientDetail;

  return (
    <div className="space-y-6">
      {/* Top Client Selector Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">{client_info.Client_Name}</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                {client_info.Client_ID}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {client_info.Client_Type} • {client_info.Country} ({client_info.Region}) • RM: {client_info.Relationship_Manager}
            </p>
          </div>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center space-x-2 self-stretch sm:self-auto">
          <span className="text-xs text-slate-400 font-medium">Switch Client:</span>
          <select
            value={currentId}
            onChange={(e) => setCurrentId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {clients.map((c) => (
              <option key={c.Client_ID} value={c.Client_ID}>
                {c.Client_Name} ({c.Client_Type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Client KPI Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total AUM</div>
          <div className="text-lg font-bold text-slate-900 mt-1 font-mono">${client_info.AUM_USD_M.toLocaleString()}M</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{portfolios.length} Accounts</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Cash Balance</div>
          <div className={`text-lg font-bold mt-1 font-mono ${client_info.Cash_Ratio_Pct > 10 ? 'text-amber-700' : 'text-slate-900'}`}>
            ${client_info.Cash_Balance_USD_M.toLocaleString()}M
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{client_info.Cash_Ratio_Pct}% Cash Ratio</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Annual Revenue</div>
          <div className="text-lg font-bold text-slate-900 mt-1 font-mono">${client_info.Annual_Revenue_USD_M}M</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{client_info.Revenue_Bps_AUM} bps fee capture</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Annual Return</div>
          <div className="text-lg font-bold text-emerald-600 mt-1 font-mono">+{performance.annualized_return_pct}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sharpe: {performance.sharpe_ratio}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
            <span>Health Score</span>
            <TooltipHelp metricKey="CLIENT_HEALTH_SCORE" />
          </div>
          <div className="text-lg font-bold text-blue-700 mt-1 font-mono">{health.health_score} / 100</div>
          <div className="text-[10px] text-blue-600 font-medium mt-0.5">{health.grade}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Segment</div>
          <div className="text-lg font-bold mt-1" style={{ color: segmentation.color }}>
            {segmentation.segment}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{client_info.Client_Tenure_Years}y Tenure</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-xl shadow-2xs space-x-4 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview & Portfolios' },
          { id: 'services', label: 'Services Matrix & Heatmap' },
          { id: 'opportunities', label: `Opportunities (${opportunities.length})` },
          { id: 'risk-liquidity', label: 'Risk & Liquidity Diagnostic' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Overview & Portfolios */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Segregated Custody Accounts ({portfolios.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] uppercase text-slate-500 font-bold">
                    <th className="py-2.5 px-3">Account ID</th>
                    <th className="py-2.5 px-3">Account Strategy</th>
                    <th className="py-2.5 px-3">Benchmark</th>
                    <th className="py-2.5 px-3 text-right">Market Value</th>
                    <th className="py-2.5 px-3 text-right">Cost Basis</th>
                    <th className="py-2.5 px-3 text-right">Unrealized P&L</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {portfolios.map((p) => (
                    <tr key={p.Portfolio_ID} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{p.Portfolio_ID}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{p.Portfolio_Name}</td>
                      <td className="py-2.5 px-3 text-slate-500">{p.Benchmark}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold">${p.Total_Market_Value_USD_M.toLocaleString()}M</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">${p.Cost_Basis_USD_M.toLocaleString()}M</td>
                      <td className={`py-2.5 px-3 text-right font-mono font-bold ${p.Unrealized_PnL_USD_M >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {p.Unrealized_PnL_USD_M >= 0 ? `+$${p.Unrealized_PnL_USD_M}M` : `-$${Math.abs(p.Unrealized_PnL_USD_M)}M`}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => onSelectPortfolio && onSelectPortfolio(p.Portfolio_ID)}
                          className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-[11px] transition-colors"
                        >
                          View Holdings
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Services Matrix */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Citi Services Utilization Matrix</h3>
            <p className="text-xs text-slate-500">Cross-functional service penetration across 8 institutional service lines</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {service_matrix.map((s, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all ${
                  s.status === 'USED'
                    ? 'bg-blue-50/50 border-blue-200 text-blue-950'
                    : s.status === 'OPPORTUNITY'
                    ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold">{s.service_name}</span>
                  {s.status === 'USED' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : s.status === 'OPPORTUNITY' ? (
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                </div>

                <div className="text-[11px] font-medium">
                  {s.status === 'USED' && (
                    <span className="text-blue-700">Active Mandate {s.is_primary ? '(Primary)' : s.is_secondary ? '(Secondary)' : ''}</span>
                  )}
                  {s.status === 'OPPORTUNITY' && (
                    <span className="text-amber-700 font-semibold">Identified Opportunity</span>
                  )}
                  {s.status === 'NOT_USED' && (
                    <span className="text-slate-400">Not Utilized</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Opportunities */}
      {activeTab === 'opportunities' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Identified Business Development & Expansion Opportunities
          </h3>
          {opportunities.length === 0 ? (
            <div className="text-xs text-slate-400 py-6 text-center">No active expansion alerts flagged.</div>
          ) : (
            <div className="space-y-3">
              {opportunities.map((opp, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded text-[10px]">
                      {opp.category}
                    </span>
                    <span className="font-semibold text-emerald-700 font-mono">
                      +${opp.estimated_rev_impact_usd_k}k Est. Annual Headroom
                    </span>
                  </div>
                  <p className="text-slate-700 italic font-medium leading-relaxed">
                    "{opp.observation}"
                  </p>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-900 font-semibold">
                    <span className="text-[10px] uppercase text-slate-400 block font-bold">Suggested Service Solution</span>
                    {opp.potential_opportunity}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Risk & Liquidity Diagnostic */}
      {activeTab === 'risk-liquidity' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Concentration Diagnostic */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Concentration Diagnostic</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                concentration.alert_code === 'RED' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {concentration.concentration_level}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-400">Top 1 Holding</div>
                <div className="font-bold font-mono text-slate-900 mt-0.5">{concentration.top_1_weight_pct}%</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-400">Top 5 Holdings</div>
                <div className="font-bold font-mono text-slate-900 mt-0.5">{concentration.top_5_weight_pct}%</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-400">HHI Index</div>
                <div className="font-bold font-mono text-slate-900 mt-0.5">{concentration.hhi_score}</div>
              </div>
            </div>
          </div>

          {/* Liquidity & Cash Diagnostic */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Liquidity Diagnostic</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                {liquidity.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-400">Actual Cash</div>
                <div className="font-bold font-mono text-slate-900 mt-0.5">${liquidity.actual_cash_usd_m}M</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-400">Required Buffer</div>
                <div className="font-bold font-mono text-slate-900 mt-0.5">${liquidity.target_buffer_usd_m}M</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-400">Idle Cash</div>
                <div className="font-bold font-mono text-amber-700 mt-0.5">${liquidity.idle_cash_usd_m}M</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
