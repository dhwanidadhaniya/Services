import React, { useState, useEffect } from 'react';
import { HelpCircle, Search, Sparkles, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { fetchAskDataQuestions, fetchAskDataAnswer } from '../../services/api';

export default function AskTheData() {
  const [questions, setQuestions] = useState([]);
  const [selectedKey, setSelectedKey] = useState('highest_cash_ratio');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAskDataQuestions()
      .then((data) => {
        setQuestions(data);
        if (data.length > 0) {
          loadAnswer(data[0].query_key);
        }
      })
      .catch(() => {});
  }, []);

  const loadAnswer = (queryKey) => {
    setSelectedKey(queryKey);
    setLoading(true);
    fetchAskDataAnswer(queryKey)
      .then((data) => {
        setAnswer(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
            <Search className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Ask The Data (Deterministic Assistant)</h3>
            <p className="text-[11px] text-slate-400">Pre-computed rule-based answers to key institutional analyst queries</p>
          </div>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">
          Deterministic
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3">
        {/* Question Selector List */}
        <div className="lg:col-span-5 space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Select Analyst Query
          </label>
          {questions.map((q) => (
            <button
              key={q.id}
              onClick={() => loadAnswer(q.query_key)}
              className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between ${
                selectedKey === q.query_key
                  ? 'bg-blue-50/80 border border-blue-200 text-blue-900 font-semibold shadow-2xs'
                  : 'bg-slate-50/70 border border-slate-100 text-slate-600 hover:bg-slate-100/80'
              }`}
            >
              <span className="line-clamp-2 pr-2 leading-tight">{q.question}</span>
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${selectedKey === q.query_key ? 'text-blue-600' : 'text-slate-400'}`} />
            </button>
          ))}
        </div>

        {/* Answer Display Card */}
        <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
          {loading ? (
            <div className="h-40 flex items-center justify-center text-xs text-slate-400 animate-pulse">
              Resolving institutional dataset query...
            </div>
          ) : answer ? (
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-100/60 px-2 py-0.5 rounded">
                  Analyst Resolution
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1.5">{answer.title}</h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/80 font-medium">
                  {answer.headline}
                </p>
              </div>

              {answer.details && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Supporting Data Points
                  </span>
                  <div className="space-y-1">
                    {answer.details.map((d, idx) => (
                      <div key={idx} className="text-[11px] text-slate-600 flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
            <span>Traceable to raw portfolio & transaction tables</span>
            <span className="font-mono">Exact Match</span>
          </div>
        </div>
      </div>
    </div>
  );
}
