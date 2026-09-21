import React, { useState, useEffect } from 'react';
import { Users, Search, ArrowRight, Building, ShieldCheck } from 'lucide-react';
import { fetchClients } from '../services/api';
import TooltipHelp from '../components/common/TooltipHelp';

export default function ClientsListPage({ onSelectClient }) {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients()
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredClients = clients.filter((c) =>
    c.Client_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.Client_Type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.Country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.Client_ID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Institutional Clients Database</h2>
          <p className="text-xs text-slate-500">25 synthetic institutional relationships across Pension Funds, Sovereigns, and Endowments</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clients by name, type, country..."
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
                <th className="py-3 px-3.5">Client ID</th>
                <th className="py-3 px-3.5">Legal Entity Name</th>
                <th className="py-3 px-3.5">Institutional Type</th>
                <th className="py-3 px-3.5">Jurisdiction</th>
                <th className="py-3 px-3.5 text-right">AUM ($M)</th>
                <th className="py-3 px-3.5 text-right">Cash Balance</th>
                <th className="py-3 px-3.5 text-right">Cash %</th>
                <th className="py-3 px-3.5 text-right">Annual Rev</th>
                <th className="py-3 px-3.5 text-center">Health Score</th>
                <th className="py-3 px-3.5 text-center">Segment</th>
                <th className="py-3 px-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((c) => (
                <tr key={c.Client_ID} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3.5 font-mono font-bold text-blue-700">{c.Client_ID}</td>
                  <td className="py-3 px-3.5 font-semibold text-slate-900">{c.Client_Name}</td>
                  <td className="py-3 px-3.5 text-slate-600">{c.Client_Type}</td>
                  <td className="py-3 px-3.5 text-slate-500">{c.Country} ({c.Region})</td>
                  <td className="py-3 px-3.5 text-right font-mono font-semibold">${c.AUM_USD_M.toLocaleString()}M</td>
                  <td className="py-3 px-3.5 text-right font-mono text-slate-700">${c.Cash_Balance_USD_M.toLocaleString()}M</td>
                  <td className="py-3 px-3.5 text-right font-mono">
                    <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                      c.Cash_Ratio_Pct > 10 ? 'bg-amber-100 text-amber-800' : 'text-slate-700'
                    }`}>
                      {c.Cash_Ratio_Pct}%
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right font-mono font-semibold">${c.Annual_Revenue_USD_M}M</td>
                  <td className="py-3 px-3.5 text-center font-mono font-bold text-blue-700">{c.Health_Score}</td>
                  <td className="py-3 px-3.5 text-center">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold"
                      style={{ backgroundColor: `${c.Segment_Color}15`, color: c.Segment_Color }}
                    >
                      {c.Segment}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <button
                      onClick={() => onSelectClient && onSelectClient(c.Client_ID)}
                      className="px-2.5 py-1 rounded bg-slate-900 text-white hover:bg-slate-800 font-semibold text-[11px] transition-colors"
                    >
                      Client 360
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
