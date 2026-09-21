import React, { useState, useEffect } from 'react';
import { Printer, Download, FileText, CheckCircle, Building, Award, ShieldAlert, Droplets } from 'lucide-react';
import { fetchClients, fetchClientDetail } from '../services/api';

export default function ReportGeneratorPage({ selectedClientId }) {
  const [clients, setClients] = useState([]);
  const [currentId, setCurrentId] = useState(selectedClientId || 'CLT-1005');
  const [reportData, setReportData] = useState(null);
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
        setReportData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !reportData) {
    return <div className="h-96 flex items-center justify-center text-xs text-slate-400">Compiling executive report deck...</div>;
  }

  const { client_info, portfolios, performance, concentration, liquidity, health, opportunities, service_matrix } = reportData;

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden in Print) */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Executive Institutional Client Report Deck</h2>
          <p className="text-xs text-slate-500">Comprehensive analytical memo formatted for institutional review and printable PDF export</p>
        </div>

        <div className="flex items-center space-x-3 self-stretch sm:self-auto">
          <select
            value={currentId}
            onChange={(e) => setCurrentId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            {clients.map((c) => (
              <option key={c.Client_ID} value={c.Client_ID}>
                {c.Client_Name} ({c.Client_ID})
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-2 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-8 max-w-4xl mx-auto text-slate-900">
        {/* Document Header */}
        <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900">
          <div>
            <div className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">
              INSTITUTIONAL CLIENT PERFORMANCE & LIQUIDITY MEMO
            </div>
            <h1 className="text-2xl font-black tracking-tight">{client_info.Client_Name}</h1>
            <p className="text-xs text-slate-500 mt-1">
              Entity: {client_info.Client_ID} • {client_info.Client_Type} • Jurisdiction: {client_info.Country} ({client_info.Region})
            </p>
          </div>
          <div className="text-right text-xs text-slate-500 font-mono">
            <div>Report Date: 2026-02-28</div>
            <div>Prepared by: Portfolio Analyst</div>
            <div>Status: CONFIDENTIAL / INTERNAL</div>
          </div>
        </div>

        {/* Section 1: Relationship Overview & Core KPIs */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
            1. Executive Relationship Summary
          </h3>
          <div className="grid grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total AUM</span>
              <span className="text-base font-bold font-mono text-slate-900">${client_info.AUM_USD_M.toLocaleString()}M</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Uninvested Cash</span>
              <span className="text-base font-bold font-mono text-amber-700">${client_info.Cash_Balance_USD_M.toLocaleString()}M</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Annual Fee Rev</span>
              <span className="text-base font-bold font-mono text-slate-900">${client_info.Annual_Revenue_USD_M}M</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Health Rating</span>
              <span className="text-base font-bold font-mono text-blue-700">{health.health_score}/100</span>
            </div>
          </div>
        </div>

        {/* Section 2: Portfolio Performance & Risk Attribution */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
            2. Performance & Risk Attribution
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-700">
                <span>Annualized Return (TWR):</span>
                <span className="font-bold text-emerald-600">+{performance.annualized_return_pct}%</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Annualized Volatility:</span>
                <span className="font-bold">{performance.annualized_volatility_pct}%</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Sharpe Ratio (Rf=4.5%):</span>
                <span className="font-bold">{performance.sharpe_ratio}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-700">
                <span>Maximum Historical Drawdown:</span>
                <span className="font-bold text-rose-600">{performance.max_drawdown_pct}%</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Tracking Error (Annualized):</span>
                <span className="font-bold">{performance.tracking_error_pct}%</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Information Ratio:</span>
                <span className="font-bold">{performance.information_ratio}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Strategic Service Observations & Opportunities */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
            3. Business Development & Liquidity Observations
          </h3>
          <div className="space-y-2 text-xs">
            {opportunities.map((opp, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>{opp.trigger_type}</span>
                  <span className="text-emerald-700 font-mono">+${opp.estimated_rev_impact_usd_k}k Est. Headroom</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1 italic">"{opp.observation}"</p>
                <p className="text-blue-900 font-semibold text-[11px] mt-1 bg-white p-2 rounded border border-slate-200">
                  Recommendation: {opp.potential_opportunity}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sign-off Box */}
        <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400">
          <div>Analyst Sign-Off: _____________________</div>
          <div>Relationship Manager: {client_info.Relationship_Manager}</div>
        </div>
      </div>
    </div>
  );
}
