import React from 'react';
import { Star, Shield, ArrowRight, DollarSign, Activity } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';

export default function ClientSpotlight({ onSelectClient }) {
  const { setFilters } = useFilters();

  const handleSpotlightClick = () => {
    setFilters(prev => ({ ...prev, client_id: 'CLT-1005' }));
    if (onSelectClient) {
      onSelectClient('CLT-1005');
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-xl p-5 shadow-sm border border-blue-800/60 relative overflow-hidden flex flex-col justify-between">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between pb-3 border-b border-blue-800/80 mb-3">
          <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Client Spotlight</span>
          </div>
          <span className="text-[10px] bg-blue-800/80 text-blue-200 px-2 py-0.5 rounded font-medium">
            Strategic Sovereign Entity
          </span>
        </div>

        <div className="space-y-1">
          <h4 className="text-base font-bold text-white">Atlas Sovereign Fund</h4>
          <p className="text-xs text-blue-200/80">Sovereign Wealth Fund • Middle East (UAE) • Relationship Since 2017</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="bg-blue-950/60 border border-blue-800/60 p-2 rounded-lg">
            <div className="text-[10px] text-blue-300 uppercase font-semibold">Total AUM</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">$12,500M</div>
          </div>
          <div className="bg-blue-950/60 border border-blue-800/60 p-2 rounded-lg">
            <div className="text-[10px] text-blue-300 uppercase font-semibold">Cash Balance</div>
            <div className="text-sm font-bold text-amber-300 font-mono mt-0.5">$1,650M</div>
          </div>
          <div className="bg-blue-950/60 border border-blue-800/60 p-2 rounded-lg">
            <div className="text-[10px] text-blue-300 uppercase font-semibold">Cash Ratio</div>
            <div className="text-sm font-bold text-amber-300 font-mono mt-0.5">13.2%</div>
          </div>
        </div>

        <div className="mt-3 p-2.5 bg-blue-950/40 rounded-lg border border-blue-800/40 text-[11px] text-blue-200 leading-relaxed">
          <strong className="text-white">Analyst Observation:</strong> High uninvested custody cash allocation presents a primary discussion opportunity for automated multi-currency liquidity sweeps and collateral yield optimization.
        </div>
      </div>

      <button
        onClick={handleSpotlightClick}
        className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
      >
        <span>Open Client 360 Profile</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
