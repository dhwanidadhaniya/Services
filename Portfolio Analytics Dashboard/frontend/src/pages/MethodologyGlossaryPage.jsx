import React, { useState } from 'react';
import { BookOpen, Search, HelpCircle, FileText, Code2, AlertTriangle } from 'lucide-react';
import { FINANCIAL_GLOSSARY } from '../components/common/TooltipHelp';

export default function MethodologyGlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const entries = Object.entries(FINANCIAL_GLOSSARY).filter(([k, v]) =>
    v.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Institutional Methodology & Financial Formula Glossary</h2>
          <p className="text-xs text-slate-500">Mathematical derivations, plain-English definitions, business context, and analytical limitations</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search financial terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Grid of Glossary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map(([key, item]) => (
          <div key={key} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-bold text-slate-900">{item.term}</h3>
                <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {key}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {item.definition}
              </p>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Mathematical Formula</span>
                <div className="font-mono text-[11px] font-semibold text-slate-900 bg-blue-50/70 p-2 rounded-lg border border-blue-100">
                  {item.formula}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <strong className="text-slate-700 block text-[10px] uppercase">How to Interpret:</strong>
                  <span className="text-slate-600">{item.interpretation}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <strong className="text-slate-700 block text-[10px] uppercase">Institutional Context:</strong>
                  <span className="text-slate-600">{item.whyItMatters}</span>
                </div>
              </div>

              <div className="text-[11px] bg-rose-50/60 p-2 rounded border border-rose-100/80 text-rose-900">
                <strong className="block text-[10px] uppercase text-rose-800 font-bold mb-0.5">Known Limitations:</strong>
                {item.limitation}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 italic">
              Example: {item.example}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
