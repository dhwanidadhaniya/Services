import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { Users, Layers, Award } from 'lucide-react';
import TooltipHelp from '../common/TooltipHelp';

export default function ClientInsightsSection({ clients, onSelectClient }) {
  const sortedClients = [...(clients || [])].sort((a, b) => b.AUM_USD_M - a.AUM_USD_M).slice(0, 8);

  const segmentColors = {
    "Strategic": "#1E3A8A",
    "Core": "#0D9488",
    "Growth": "#10B981",
    "Emerging": "#6366F1",
    "Needs Attention": "#F59E0B"
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Client Insights & Institutional Segmentation</h2>
            <TooltipHelp metricKey="CLIENT_HEALTH_SCORE" label="Client Analytics" />
          </div>
          <p className="text-xs text-slate-500">Scale distribution and 2D Institutional Client Grid</p>
        </div>

        {/* Legend for Segments */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-600">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-[#1E3A8A]" />
            <span>Strategic</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
            <span>Core</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>Growth</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span>Attention</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Bar Chart: Top Clients by AUM */}
        <div className="lg:col-span-6">
          <div className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">
            Top Institutional Relationships by AUM ($M)
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedClients} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748B' }} unit="M" />
                <YAxis dataKey="Client_Name" type="category" width={110} tick={{ fontSize: 9, fill: '#1E293B' }} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#FFF', fontSize: '11px' }}
                  formatter={(val) => [`$${val.toLocaleString()}M`, 'Institutional AUM']}
                />
                <Bar dataKey="AUM_USD_M" radius={[0, 4, 4, 0]}>
                  {sortedClients.map((entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={segmentColors[entry.Segment] || '#1E3A8A'}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => onSelectClient && onSelectClient(entry.Client_ID)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2D Client Segmentation Grid */}
        <div className="lg:col-span-6">
          <div className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">
            2D Segmentation: Client Value vs Growth Potential
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  type="number"
                  dataKey="Client_Value_Score"
                  name="Client Scale / Value"
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#64748B' }}
                />
                <YAxis
                  type="number"
                  dataKey="Growth_Potential_Score"
                  name="Expansion Potential"
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#64748B' }}
                />
                <ZAxis type="number" dataKey="AUM_USD_M" range={[30, 220]} name="AUM ($M)" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-xl border border-slate-800">
                          <div className="font-bold text-blue-300">{data.Client_Name}</div>
                          <div className="text-[10px] text-slate-300">{data.Client_Type} • {data.Country}</div>
                          <div className="mt-1 pt-1 border-t border-slate-800 space-y-0.5 font-mono text-[10px]">
                            <div>Segment: <span className="font-semibold text-amber-300">{data.Segment}</span></div>
                            <div>AUM: ${data.AUM_USD_M}M</div>
                            <div>Revenue: ${data.Annual_Revenue_USD_M}M</div>
                            <div>Health Score: {data.Health_Score}</div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter
                  name="Clients"
                  data={clients}
                  fill="#1E3A8A"
                  onClick={(node) => onSelectClient && onSelectClient(node.Client_ID)}
                  className="cursor-pointer"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
