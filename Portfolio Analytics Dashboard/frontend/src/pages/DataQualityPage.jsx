import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, Activity, Cpu, Wrench } from 'lucide-react';
import { fetchDataQuality } from '../services/api';

export default function DataQualityPage() {
  const [dataQuality, setDataQuality] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataQuality()
      .then((data) => {
        setDataQuality(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !dataQuality) {
    return <div className="h-96 flex items-center justify-center text-xs text-slate-400">Auditing institutional dataset...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">Institutional Data Quality & Process Optimization</h2>
        <p className="text-xs text-slate-500">Automated data integrity reconciliation and operational efficiency audit</p>
      </div>

      {/* Top Audit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Student-Defined Data Quality Score</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">{dataQuality.data_quality_score}%</div>
          <div className="text-xs text-slate-500 mt-0.5">High Institutional Accuracy</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Records Audited</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{dataQuality.total_records_audited.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-0.5">Clients, Portfolios & Txns</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Settlement Success Rate</div>
          <div className="text-2xl font-bold font-mono text-blue-700 mt-1">{dataQuality.settlement_success_rate_pct}%</div>
          <div className="text-xs text-slate-500 mt-0.5">T+1/T+2 Affirmations</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Failed Trade Breaks</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">{dataQuality.failed_settlements_count}</div>
          <div className="text-xs text-slate-500 mt-0.5">Reconciliation Watchlist</div>
        </div>
      </div>

      {/* Process Optimization & Operational Insights Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
          <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
            <Wrench className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Operational Process Improvement Opportunities</h3>
            <p className="text-[11px] text-slate-400">Institutional workflow optimizations based on transaction anomaly patterns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-slate-900 font-bold">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Concentrated Settlement Exceptions</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Observation:</strong> 42% of failed trade reconciliations originate from international cross-currency executions without automated pre-settlement matching.
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-medium text-blue-900">
              <strong>Optimization Recommendation:</strong> Deploy Straight-Through Processing (STP) trade affirmation protocol with European custodians to reduce failed settlement friction by an estimated 75%.
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-slate-900 font-bold">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Custody Cash Reconciliation Automation</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Observation:</strong> 3 institutional clients maintain recurring uninvested balances exceeding $500M during quarterly dividend distribution cycles.
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-medium text-indigo-900">
              <strong>Optimization Recommendation:</strong> Implement automated dividend auto-sweep rules into designated institutional money market funds to eliminate uncompensated cash drag.
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Detailed Dataset Audit Logs</h3>
        <div className="space-y-2">
          {dataQuality.issues_list.map((issue, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  issue.severity === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {issue.severity}
                </span>
                <span className="font-semibold text-slate-800">Table: {issue.table}</span>
                <span className="text-slate-600">{issue.description}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Verified Synthetic Check</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
