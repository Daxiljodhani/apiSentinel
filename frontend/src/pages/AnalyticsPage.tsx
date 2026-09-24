import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertOctagon, CheckCircle2, Clock, PieChart as PieIcon } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [apis, setApis] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([api.get('/analytics/dashboard'), api.get('/apis')]).then(([sRes, aRes]: any[]) => {
      if (sRes.success) setStats(sRes.data);
      if (aRes.success) setApis(aRes.data);
    });
  }, []);

  const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444'];

  const slowestApis = [...apis].sort((a, b) => (b.avgResponseMs || 0) - (a.avgResponseMs || 0)).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">System Performance & Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Deep observability analytics, status code distributions, latency trends, and slowest endpoints.
        </p>
      </div>

      {/* Row 1: Status Code Distribution & Hourly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#101F33] border border-[#182E4B] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-blue-400" />
              <span>HTTP Status Code Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-mono">Distribution of response HTTP status codes</p>

            <div className="space-y-3">
              {(stats?.statusCodeDistribution || []).map((item: any, i: number) => (
                <div key={item.code} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 font-bold">HTTP {item.code}</span>
                    <span className="text-slate-400">{item.count} checks ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-[#0B1728] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: COLORS[i % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Latency Trend Bar Chart */}
        <div className="lg:col-span-2 bg-[#101F33] border border-[#182E4B] rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 mb-1">Hourly Response Latency</h3>
          <p className="text-xs text-slate-400 mb-6">Average endpoint latency across checks (ms)</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.hourlyTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#182E4B" vertical={false} />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit="ms" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1728', borderColor: '#182E4B', borderRadius: '8px', color: '#F8FAFC' }}
                />
                <Bar dataKey="avgResponseTimeMs" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Slowest Endpoints Table */}
      <div className="bg-[#101F33] border border-[#182E4B] rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <span>Slowest Monitored Endpoints</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">Endpoints ranked by highest average response time</p>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B1728] border-b border-[#182E4B] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Endpoint Name</th>
                <th className="py-3 px-4">URL</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Avg Response Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182E4B] text-xs font-mono">
              {slowestApis.map((apiItem) => (
                <tr key={apiItem.id} className="hover:bg-[#0B1728]/50">
                  <td className="py-3 px-4 font-sans font-bold text-slate-200">{apiItem.name}</td>
                  <td className="py-3 px-4 text-slate-400 truncate max-w-xs">{apiItem.url}</td>
                  <td className="py-3 px-4 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${apiItem.status === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {apiItem.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-amber-400">{apiItem.avgResponseMs || 0} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
