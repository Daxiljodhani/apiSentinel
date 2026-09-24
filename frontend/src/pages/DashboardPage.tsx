import React, { useState, useEffect } from 'react';
import {
  Server,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Activity,
  Shield,
  Plus,
  Play,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ApiFormModal } from '../components/api/ApiFormModal';
import { ApiTestModal } from '../components/api/ApiTestModal';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [apis, setApis] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [testApiTarget, setTestApiTarget] = useState<any>(null);

  const { lastEvent } = useSocket();

  const fetchDashboardData = async () => {
    try {
      const [statsRes, apisRes, incRes, projRes]: any[] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/apis'),
        api.get('/incidents?status=ACTIVE'),
        api.get('/projects'),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (apisRes.success) setApis(apisRes.data);
      if (incRes.success) setIncidents(incRes.data);
      if (projRes.success) setProjects(projRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle WebSocket Live Refresh
  useEffect(() => {
    if (lastEvent && (lastEvent.type === 'MONITOR_CHECK_COMPLETED' || lastEvent.type === 'INCIDENT_CREATED')) {
      fetchDashboardData();
    }
  }, [lastEvent]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span>System Overview & Observability</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status of all active API endpoints, latency metrics, and open incidents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 bg-[#101F33] hover:bg-[#182E4B] border border-[#182E4B] text-slate-300 rounded-xl transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add API Monitor</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total APIs"
          value={stats?.totalApis ?? '--'}
          subtitle="Monitored endpoints"
          icon={Server}
          iconColor="text-blue-400 bg-blue-500/10 border-blue-500/20"
        />
        <StatCard
          title="Healthy"
          value={stats?.healthyApis ?? '--'}
          subtitle="100% operational"
          icon={CheckCircle2}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <StatCard
          title="Degraded"
          value={stats?.degradedApis ?? '--'}
          subtitle="High latency > 1000ms"
          icon={AlertTriangle}
          iconColor="text-amber-400 bg-amber-500/10 border-amber-500/20"
        />
        <StatCard
          title="Down"
          value={stats?.downApis ?? '--'}
          subtitle="Failed probe response"
          icon={XCircle}
          iconColor="text-rose-400 bg-rose-500/10 border-rose-500/20"
        />
        <StatCard
          title="Avg Latency"
          value={stats?.avgResponseTimeMs ? `${stats.avgResponseTimeMs} ms` : '--'}
          subtitle="Global response time"
          icon={Clock}
          iconColor="text-sky-400 bg-sky-500/10 border-sky-500/20"
        />
        <StatCard
          title="System Uptime"
          value={stats?.globalUptime ? `${stats.globalUptime}%` : '99.9%'}
          subtitle="Last 24 hours"
          icon={Activity}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
      </div>

      {/* Latency & Uptime Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latency Trend Area Chart */}
        <div className="lg:col-span-2 bg-[#101F33] border border-[#182E4B] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-100">Response Time Latency Trend</h3>
              <p className="text-xs text-slate-400">Average response time across all API health checks (ms)</p>
            </div>
            <div className="flex bg-[#0B1728] p-1 rounded-lg border border-[#182E4B]">
              <button
                onClick={() => setTimeRange('24h')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  timeRange === '24h' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                24h
              </button>
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  timeRange === '7d' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                7d
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.hourlyTrend || []}>
                <defs>
                  <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#182E4B" vertical={false} />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit="ms" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1728', borderColor: '#182E4B', borderRadius: '8px', color: '#F8FAFC' }}
                  itemStyle={{ color: '#3B82F6' }}
                />
                <Area type="monotone" dataKey="avgResponseTimeMs" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#latencyGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency Percentiles & Status Distribution */}
        <div className="bg-[#101F33] border border-[#182E4B] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Latency Percentiles</h3>
            <p className="text-xs text-slate-400 mb-6">P50, P95, and P99 metric breakdown</p>

            <div className="space-y-4">
              <div className="p-3.5 bg-[#0B1728] border border-[#182E4B] rounded-xl flex justify-between items-center">
                <span className="text-xs text-slate-400 font-semibold">P50 (Median)</span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {stats?.percentiles?.p50 ?? 0} ms
                </span>
              </div>
              <div className="p-3.5 bg-[#0B1728] border border-[#182E4B] rounded-xl flex justify-between items-center">
                <span className="text-xs text-slate-400 font-semibold">P95 (95th percentile)</span>
                <span className="text-sm font-bold font-mono text-amber-400">
                  {stats?.percentiles?.p95 ?? 0} ms
                </span>
              </div>
              <div className="p-3.5 bg-[#0B1728] border border-[#182E4B] rounded-xl flex justify-between items-center">
                <span className="text-xs text-slate-400 font-semibold">P99 (Tail Latency)</span>
                <span className="text-sm font-bold font-mono text-rose-400">
                  {stats?.percentiles?.p99 ?? 0} ms
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#182E4B] flex justify-between text-xs text-slate-400">
            <span>Active Incidents: <strong className="text-rose-400">{incidents.length}</strong></span>
            <span>Total Checks Today: <strong className="text-slate-200">{stats?.totalChecks ?? 0}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Monitored APIs Table */}
      <div className="bg-[#101F33] border border-[#182E4B] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-[#182E4B] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">API Health Status</h3>
            <p className="text-xs text-slate-400">Overview of all active monitored endpoints</p>
          </div>
          <Link
            to="/apis"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>View All APIs</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B1728] border-b border-[#182E4B] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">API Name</th>
                <th className="py-3.5 px-6">Method & Endpoint</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Response Time</th>
                <th className="py-3.5 px-6">Uptime (24h)</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182E4B] text-sm">
              {apis.slice(0, 6).map((apiItem) => (
                <tr key={apiItem.id} className="hover:bg-[#0B1728]/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-100">
                    <Link to={`/apis/${apiItem.id}`} className="hover:text-blue-400 transition-colors">
                      {apiItem.name}
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                        {apiItem.method}
                      </span>
                      <span className="font-mono text-xs text-slate-400 max-w-xs truncate">{apiItem.url}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={apiItem.status} />
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-200">
                    {apiItem.avgResponseMs ? `${apiItem.avgResponseMs} ms` : 'N/A'}
                  </td>
                  <td className="py-4 px-6 font-mono text-xs font-semibold text-emerald-400">
                    {apiItem.uptimePercent ? `${apiItem.uptimePercent}%` : '100.00%'}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setTestApiTarget(apiItem)}
                      className="px-3 py-1.5 bg-[#0B1728] hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-emerald-400" />
                      <span>Test Probe</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Components */}
      <ApiFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchDashboardData}
        projects={projects}
      />

      <ApiTestModal
        isOpen={!!testApiTarget}
        onClose={() => setTestApiTarget(null)}
        api={testApiTarget}
      />
    </div>
  );
};
