import React, { useState, useEffect } from 'react';
import { Filter, X, Calendar, Globe, Building2, ShieldAlert } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';
import { fetchClients, fetchPortfolios } from '../../services/api';

export default function FilterBar() {
  const { filters, updateFilter, clearFilters, demoMode } = useFilters();
  const [clientsList, setClientsList] = useState([]);
  const [portfoliosList, setPortfoliosList] = useState([]);

  useEffect(() => {
    fetchClients().then(setClientsList).catch(() => {});
    fetchPortfolios().then(setPortfoliosList).catch(() => {});
  }, []);

  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1 text-slate-500 font-semibold uppercase tracking-wider text-[11px] mr-1">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filters:</span>
          </div>

          {/* Client Filter */}
          <select
            value={filters.client_id}
            onChange={(e) => updateFilter('client_id', e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-100/70 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
          >
            <option value="ALL">All Clients (25 Entities)</option>
            {clientsList.map((c) => (
              <option key={c.Client_ID} value={c.Client_ID}>
                {c.Client_Name} ({c.Client_Type})
              </option>
            ))}
          </select>

          {/* Region Filter */}
          <select
            value={filters.region}
            onChange={(e) => updateFilter('region', e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-100/70 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
          >
            <option value="ALL">All Regions</option>
            <option value="North America">North America (US)</option>
            <option value="Europe">Europe (UK/EUR/CHF)</option>
            <option value="Asia-Pacific">Asia-Pacific (India/SG/JP)</option>
            <option value="Middle East">Middle East (UAE/KSA)</option>
          </select>

          {/* Risk Profile Filter */}
          <select
            value={filters.risk_profile}
            onChange={(e) => updateFilter('risk_profile', e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-100/70 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
          >
            <option value="ALL">All Risk Profiles</option>
            <option value="Conservative">Conservative</option>
            <option value="Moderate">Moderate</option>
            <option value="Growth">Growth</option>
            <option value="Aggressive">Aggressive</option>
          </select>

          {/* Benchmark Filter */}
          <select
            value={filters.benchmark}
            onChange={(e) => updateFilter('benchmark', e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-100/70 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
          >
            <option value="ALL">All Benchmarks</option>
            <option value="NIFTY 50">NIFTY 50 (India Eq)</option>
            <option value="S&P 500">S&P 500 (US Eq)</option>
            <option value="MSCI World">MSCI World (Global Eq)</option>
            <option value="Bloomberg Global Aggregate">Bloomberg Global Agg (Bonds)</option>
            <option value="Crisil Liquid / MMF">Crisil Liquid / MMF (Cash)</option>
          </select>

          {/* Date Range Selector */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>2021-01 to 2026-02</span>
          </div>
        </div>

        {/* Right: Active Filter Indicators & Reset */}
        <div className="flex items-center space-x-2">
          {filters.client_id !== 'ALL' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800">
              Client: {filters.client_id}
              <button onClick={() => updateFilter('client_id', 'ALL')} className="ml-1 hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={clearFilters}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium underline transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
