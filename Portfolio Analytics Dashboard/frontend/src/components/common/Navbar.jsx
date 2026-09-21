import React from 'react';
import { Play, RotateCcw, ShieldCheck, Download, Database, Layers } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { demoMode, runDemoScenario, clearFilters } = useFilters();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold tracking-wider shadow-sm">
            <Layers className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">Portfolio & Client Analytics</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                Institutional Terminal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Citi Services – Summer Analyst, India 2027 (Mumbai) Portfolio Project
            </p>
          </div>
        </div>

        {/* Action Controls & Interactive Demo Button */}
        <div className="flex items-center space-x-2.5">
          {demoMode ? (
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Demo Scenario: Atlas Sovereign Fund</span>
            </div>
          ) : null}

          <button
            onClick={runDemoScenario}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            title="Automatically loads Atlas Sovereign Fund scenario demonstrating cash drag and liquidity optimization"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Demo</span>
          </button>

          <button
            onClick={clearFilters}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            title="Reset all filters to full institutional book view"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          <button
            onClick={() => setActiveTab('reports')}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors"
            title="Generate executive client deck and print/PDF report"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Export Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
