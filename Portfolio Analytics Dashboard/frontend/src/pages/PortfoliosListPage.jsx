import React, { useState, useEffect } from 'react';
import { Activity, Search, ArrowRight, PieChart } from 'lucide-react';
import { fetchPortfolios } from '../services/api';

export default function PortfoliosListPage({ onSelectPortfolio }) {
  const [portfolios, setPortfolios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolios()
      .then((data) => {
        setPortfolios(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = portfolios.filter(p =>
    p.Portfolio_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.Client_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.Portfolio_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.Benchmark.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Portfolio & Account Master Directory</h2>
          <p className="text-xs text-slate-500">74 segregated institutional accounts and risk strategies</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search portfolios by ID, client, strategy..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] uppercase text-slate-500 font-bold">
                <th className="py-3 px-3.5">Account ID</th>
                <th className="py-3 px-3.5">Portfolio Strategy</th>
                <th className="py-3 px-3.5">Client Legal Entity</th>
                <th className="py-3 px-3.5">Benchmark</th>
                <th className="py-3 px-3.5 text-right">Market Value</th>
                <th className="py-3 px-3.5 text-right">Cost Basis</th>
                <th className="py-3 px-3.5 text-right">Unrealized P&L</th>
                <th className="py-3 px-3.5 text-center">Holdings</th>
                <th className="py-3 px-3.5 text-right">Top Position</th>
                <th className="py-3 px-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.Portfolio_ID} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3.5 font-mono font-bold text-blue-700">{p.Portfolio_ID}</td>
                  <td className="py-3 px-3.5 font-semibold text-slate-900">{p.Portfolio_Name}</td>
                  <td className="py-3 px-3.5 text-slate-600">{p.Client_Name}</td>
                  <td className="py-3 px-3.5 text-slate-500">{p.Benchmark}</td>
                  <td className="py-3 px-3.5 text-right font-mono font-semibold">${p.Total_Market_Value_USD_M.toLocaleString()}M</td>
                  <td className="py-3 px-3.5 text-right font-mono text-slate-500">${p.Cost_Basis_USD_M.toLocaleString()}M</td>
                  <td className={`py-3 px-3.5 text-right font-mono font-bold ${p.Unrealized_PnL_USD_M >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {p.Unrealized_PnL_USD_M >= 0 ? `+$${p.Unrealized_PnL_USD_M}M` : `-$${Math.abs(p.Unrealized_PnL_USD_M)}M`}
                  </td>
                  <td className="py-3 px-3.5 text-center font-mono text-slate-600">{p.Number_of_Holdings}</td>
                  <td className="py-3 px-3.5 text-right font-mono font-semibold">
                    <span className={p.Top_Holding_Weight_Pct > 20 ? 'text-amber-700' : 'text-slate-800'}>
                      {p.Top_Holding_Weight_Pct}%
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <button
                      onClick={() => onSelectPortfolio && onSelectPortfolio(p.Portfolio_ID)}
                      className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-[11px] transition-colors"
                    >
                      Detail
                    </button>
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
