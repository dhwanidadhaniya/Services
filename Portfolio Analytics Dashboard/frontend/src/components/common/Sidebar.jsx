import React from 'react';
import {
  LayoutDashboard,
  Users,
  PieChart,
  Activity,
  Droplets,
  ArrowLeftRight,
  Sparkles,
  ShieldCheck,
  FileText,
  BookOpen,
  Home
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'landing', label: 'Overview / Intro', icon: Home },
  { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Client Master & Segments', icon: Users },
  { id: 'client-360', label: 'Client 360 Deep-Dive', icon: PieChart },
  { id: 'portfolios', label: 'Portfolios & Holdings', icon: Activity },
  { id: 'risk-liquidity', label: 'Risk & Cash Liquidity', icon: Droplets },
  { id: 'transactions', label: 'Transactions & Exceptions', icon: ArrowLeftRight },
  { id: 'opportunities', label: 'Opportunity Engine', icon: Sparkles, badge: 'Cross-Sell' },
  { id: 'data-quality', label: 'Data Quality & Ops', icon: ShieldCheck },
  { id: 'reports', label: 'Client Report Generator', icon: FileText },
  { id: 'methodology', label: 'Methodology & Glossary', icon: BookOpen }
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 min-h-screen">
      {/* Platform Version Tag */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="text-xs">
          <div className="font-semibold text-white tracking-wide">ANALYST WORKSPACE</div>
          <div className="text-[10px] text-slate-400">Institutional Portfolio Analytics</div>
        </div>
        <span className="text-[10px] bg-slate-800 text-blue-400 px-2 py-0.5 rounded font-mono font-medium">
          v1.0
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Analytics Modules
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-amber-300'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Student Context */}
      <div className="p-4 border-t border-slate-800 text-[11px] bg-slate-950/40">
        <div className="text-slate-400 font-semibold mb-1">Citi Services Context</div>
        <p className="text-slate-400 leading-snug text-[10px]">
          Cash Management • Custody • Trade Finance • Fund Admin • Collateral • Performance Analytics
        </p>
        <div className="mt-2 text-[9px] text-slate-400 flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          <span>Synthetic Institutional Data Engine</span>
        </div>
      </div>
    </aside>
  );
}
