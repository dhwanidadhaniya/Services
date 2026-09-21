import React, { useState, useEffect } from 'react';
import {
  Activity,
  Layers,
  PieChart,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  ArrowLeftRight,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { fetchPortfolios, fetchPortfolioDetail } from '../services/api';
import TooltipHelp from '../components/common/TooltipHelp';

export default function PortfolioDetailPage({ selectedPortfolioId }) {
  const [portfolios, setPortfolios] = useState([]);
  const [currentId, setCurrentId] = useState(selectedPortfolioId || 'P-101');
  const [portfolioDetail, setPortfolioDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolios().then(setPortfolios).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedPortfolioId) {
      setCurrentId(selectedPortfolioId);
    }
  }, [selectedPortfolioId]);

  useEffect(() => {
    if (!currentId) return;
    setLoading(true);
    fetchPortfolioDetail(currentId)
      .then((data) => {
        setPortfolioDetail(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching portfolio detail:", err);
        setLoading(false);
      });
  }, [currentId]);

  if (loading || !portfolioDetail) {
    return (
      <div className="h-96 flex items-center justify-center text-xs text-slate-400">
        Loading Portfolio Detail...
      </div>
    );
  }

  const { portfolio_info, holdings, metrics, concentration, time_series } = portfolioDetail;

  return (
    <div className="space-y-6">
      {/* Portfolio Selector Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">{portfolio_info.Portfolio_Name}</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                {portfolio_info.Portfolio_ID}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Client: {portfolio_info.Client_Name} ({portfolio_info.Client_ID}) • Benchmark: {portfolio_info.Benchmark}
            </p>
          </div>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center space-x-2 self-stretch sm:self-auto">
          <span className="text-xs text-slate-400 font-medium">Switch Portfolio:</span>
          <select
            value={currentId}
            onChange={(e) => setCurrentId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {portfolios.map((p) => (
              <option key={p.Portfolio_ID} value={p.Portfolio_ID}>
                {p.Portfolio_ID} - {p.Portfolio_Name} ({p.Client_Name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Portfolio KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Market Value</div>
          <div className="text-lg font-bold text-slate-900 mt-1 font-mono">${portfolio_info.Total_Market_Value_USD_M.toLocaleString()}M</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{holdings.length} Holdings</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Annual Return</div>
          <div className="text-lg font-bold text-emerald-600 mt-1 font-mono">+{metrics.annualized_return_pct}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Benchmark: {metrics.benchmark_annualized_return_pct}%</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Active Alpha</div>
          <div className="text-lg font-bold text-blue-700 mt-1 font-mono">+{metrics.active_return_pct}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">IR: {metrics.information_ratio}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Volatility & Beta</div>
          <div className="text-lg font-bold text-slate-900 mt-1 font-mono">{metrics.annualized_volatility_pct}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Beta: {metrics.beta}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Sharpe Ratio</div>
          <div className="text-lg font-bold text-slate-900 mt-1 font-mono">{metrics.sharpe_ratio}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sortino: {metrics.sortino_ratio}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">1-Day VaR (95%)</div>
          <div className="text-lg font-bold text-slate-900 mt-1 font-mono">${metrics.var_1d_usd_m}M</div>
          <div className="text-[10px] text-slate-400 mt-0.5">10-Day: ${metrics.var_10d_usd_m}M</div>
        </div>
      </div>

      {/* Historical NAV Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Historical Monthly NAV Trajectory</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={time_series} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} unit="M" />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#FFF', fontSize: '11px' }} />
              <Line type="monotone" dataKey="nav_usd_m" name="Account NAV ($M)" stroke="#1E3A8A" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Positions & Holdings Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Account Position Holdings</h3>
          <span className="text-[11px] text-slate-400">{holdings.length} Securities</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] uppercase text-slate-500 font-bold">
                <th className="py-2.5 px-3">Ticker</th>
                <th className="py-2.5 px-3">Security Name</th>
                <th className="py-2.5 px-3">Asset Class</th>
                <th className="py-2.5 px-3">Sector</th>
                <th className="py-2.5 px-3 text-right">Weight</th>
                <th className="py-2.5 px-3 text-right">Market Value</th>
                <th className="py-2.5 px-3 text-right">Cost Basis</th>
                <th className="py-2.5 px-3 text-right">Unrealized P&L</th>
                <th className="py-2.5 px-3 text-center">Rating/Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {holdings.map((h, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{h.Security_Ticker}</td>
                  <td className="py-2.5 px-3 text-slate-800">{h.Security_Name}</td>
                  <td className="py-2.5 px-3 text-slate-500">{h.Asset_Class}</td>
                  <td className="py-2.5 px-3 text-slate-500">{h.Sector}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">{h.Weight_Pct}%</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">${h.Market_Value_USD_M.toLocaleString()}M</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-500">${h.Cost_Basis_USD_M.toLocaleString()}M</td>
                  <td className={`py-2.5 px-3 text-right font-mono font-bold ${h.Unrealized_PnL_USD_M >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {h.Unrealized_PnL_USD_M >= 0 ? `+$${h.Unrealized_PnL_USD_M}M` : `-$${Math.abs(h.Unrealized_PnL_USD_M)}M`}
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-500">
                    {h.Credit_Rating !== 'N/A' ? `${h.Credit_Rating} (${h.Duration_Years}y)` : 'Equity/Cash'}
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
