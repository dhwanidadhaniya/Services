import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, AlertTriangle, ShieldAlert, CheckCircle2, Filter, Search } from 'lucide-react';
import { fetchTransactions, fetchExceptions } from '../services/api';

export default function TransactionAnalyticsPage() {
  const [txnsData, setTxnsData] = useState(null);
  const [exceptions, setExceptions] = useState([]);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchTransactions({ txn_type: typeFilter, settlement_status: statusFilter, limit: 60 }),
      fetchExceptions()
    ])
      .then(([tRes, eRes]) => {
        setTxnsData(tRes);
        setExceptions(eRes?.exceptions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [typeFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">Institutional Transaction Journal & Trade Surveillance</h2>
        <p className="text-xs text-slate-500">5,200+ executed trade records with custody settlement matching and anomaly alerts</p>
      </div>

      {/* Exception Surveillance Panel (WHAT / WHY / WHAT DATA TRIGGERED) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Operational & Risk Exception Alerts</h3>
              <p className="text-[11px] text-slate-400">Rule-based anomaly detection explaining exact triggers and context</p>
            </div>
          </div>
          <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded border border-rose-200/60">
            {exceptions.length} Active Alerts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {exceptions.slice(0, 4).map((exc, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/30 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-800 text-[11px]">{exc.title}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold">
                  {exc.severity}
                </span>
              </div>
              <div className="text-slate-700 font-medium">
                <strong>WHAT:</strong> {exc.what}
              </div>
              <div className="text-slate-600 text-[11px]">
                <strong>WHY:</strong> {exc.why}
              </div>
              <div className="p-2 bg-white rounded border border-slate-200 text-[10px] font-mono text-slate-600">
                <strong>TRIGGER DATA:</strong> {exc.data_trigger}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Journal Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Executed Transaction Records</h3>

          {/* Quick Filters */}
          <div className="flex items-center space-x-2 text-xs">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="ALL">All Types</option>
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
              <option value="DIVIDEND">DIVIDEND</option>
              <option value="INTEREST">INTEREST</option>
              <option value="FEE">FEE</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="ALL">All Settlement States</option>
              <option value="SETTLED">SETTLED</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400">Loading transactions...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] uppercase text-slate-500 font-bold">
                  <th className="py-2.5 px-3">Txn ID</th>
                  <th className="py-2.5 px-3">Trade Date</th>
                  <th className="py-2.5 px-3">Settlement Date</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Security</th>
                  <th className="py-2.5 px-3 text-right">Gross ($M)</th>
                  <th className="py-2.5 px-3 text-right">Fees ($M)</th>
                  <th className="py-2.5 px-3 text-right">Net ($M)</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(txnsData?.records || []).map((t) => (
                  <tr key={t.Transaction_ID} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-blue-700">{t.Transaction_ID}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono">{t.Date}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono">{t.Settlement_Date}</td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">{t.Client_ID}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">{t.Transaction_Type}</td>
                    <td className="py-2.5 px-3 text-slate-900">{t.Security_Name}</td>
                    <td className="py-2.5 px-3 text-right font-mono">${t.Gross_Value_USD_M.toFixed(4)}M</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-500">${t.Fees_USD_M.toFixed(6)}M</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">${t.Net_Value_USD_M.toFixed(4)}M</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.Settlement_Status === 'SETTLED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : t.Settlement_Status === 'PENDING'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {t.Settlement_Status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
