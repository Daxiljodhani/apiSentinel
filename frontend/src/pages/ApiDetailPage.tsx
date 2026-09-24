import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Server,
  Play,
  Pause,
  Shield,
  Clock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  Layers,
} from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Tabs } from '../components/ui/Tabs';
import { ApiTestModal } from '../components/api/ApiTestModal';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import api from '../services/api';

export const ApiDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [apiData, setApiData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApiDetails = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res: any = await api.get(`/apis/${id}`);
      if (res.success) setApiData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiDetails();
  }, [id]);

  if (isLoading || !apiData) {
    return (
      <div className="py-20 text-center text-slate-400">Loading API Monitor Details...</div>
    );
  }

  const tabList = [
    { id: 'overview', label: 'Overview' },
    { id: 'monitoring', label: 'Latency Breakdown' },
    { id: 'ssl', label: 'SSL Certificate' },
    { id: 'incidents', label: 'Incidents', count: apiData.incidents?.length || 0 },
    { id: 'logs', label: 'Check History', count: apiData.recentChecks?.length || 0 },
  ];

  const chartData = (apiData.recentChecks || []).slice().reverse().map((c: any) => ({
    time: new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    responseTimeMs: c.responseTimeMs,
    statusCode: c.statusCode,
  }));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Back Link */}
      <Link to="/apis" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to APIs</span>
      </Link>

      {/* Header Info Banner */}
      <div className="bg-[#101F33] border border-[#182E4B] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-100">{apiData.name}</h1>
            <StatusBadge status={apiData.status} size="lg" />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="px-2.5 py-0.5 font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
              {apiData.method}
            </span>
            <span>{apiData.url}</span>
            <span>• Project: {apiData.project?.name || 'Default'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsTestModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Test Probe Now</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <Tabs tabs={tabList} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#101F33] p-5 rounded-xl border border-[#182E4B]">
              <span className="text-xs text-slate-400 font-semibold uppercase">24h Uptime</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{apiData.uptime24h}%</p>
            </div>
            <div className="bg-[#101F33] p-5 rounded-xl border border-[#182E4B]">
              <span className="text-xs text-slate-400 font-semibold uppercase">Avg Response Time</span>
              <p className="text-2xl font-bold text-blue-400 mt-1">{apiData.avgResponse24h} ms</p>
            </div>
            <div className="bg-[#101F33] p-5 rounded-xl border border-[#182E4B]">
              <span className="text-xs text-slate-400 font-semibold uppercase">Check Frequency</span>
              <p className="text-2xl font-bold text-slate-100 mt-1">Every {apiData.intervalSeconds}s</p>
            </div>
            <div className="bg-[#101F33] p-5 rounded-xl border border-[#182E4B]">
              <span className="text-xs text-slate-400 font-semibold uppercase">Consecutive Failures</span>
              <p className={`text-2xl font-bold mt-1 ${apiData.consecutiveFailures > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {apiData.consecutiveFailures}
              </p>
            </div>
          </div>

          {/* Response Latency Graph */}
          <div className="bg-[#101F33] border border-[#182E4B] rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-slate-100 mb-4">Response Time Execution History</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="apiDetailGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#182E4B" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit="ms" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B1728', borderColor: '#182E4B', borderRadius: '8px', color: '#F8FAFC' }}
                  />
                  <Area type="monotone" dataKey="responseTimeMs" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#apiDetailGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'monitoring' && (
        <div className="bg-[#101F33] border border-[#182E4B] rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-sm font-bold text-slate-100">Detailed Latency Phase Breakdown</h3>
          <p className="text-xs text-slate-400">Probing phases timing estimate breakdown for {apiData.url}</p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-[#0B1728] border border-[#182E4B] rounded-xl text-center">
              <span className="text-xs text-slate-400">DNS Lookup</span>
              <p className="text-lg font-bold font-mono text-blue-400 mt-1">12 ms</p>
            </div>
            <div className="p-4 bg-[#0B1728] border border-[#182E4B] rounded-xl text-center">
              <span className="text-xs text-slate-400">TCP Handshake</span>
              <p className="text-lg font-bold font-mono text-blue-400 mt-1">18 ms</p>
            </div>
            <div className="p-4 bg-[#0B1728] border border-[#182E4B] rounded-xl text-center">
              <span className="text-xs text-slate-400">TLS Negotiation</span>
              <p className="text-lg font-bold font-mono text-blue-400 mt-1">25 ms</p>
            </div>
            <div className="p-4 bg-[#0B1728] border border-[#182E4B] rounded-xl text-center">
              <span className="text-xs text-slate-400">Server TTFB</span>
              <p className="text-lg font-bold font-mono text-blue-400 mt-1">55 ms</p>
            </div>
            <div className="p-4 bg-[#0B1728] border border-[#182E4B] rounded-xl text-center">
              <span className="text-xs text-slate-400">Data Transfer</span>
              <p className="text-lg font-bold font-mono text-blue-400 mt-1">14 ms</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ssl' && (
        <div className="bg-[#101F33] border border-[#182E4B] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">SSL / TLS Certificate Status</h3>
              <p className="text-xs text-slate-400">HTTPS Certificate expiration monitoring</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-[#0B1728] border border-[#182E4B] rounded-xl">
              <span className="text-xs text-slate-400">Issuer Authority</span>
              <p className="text-sm font-bold text-slate-200 mt-1">{apiData.sslCertificate?.issuer || 'Let\'s Encrypt'}</p>
            </div>
            <div className="p-4 bg-[#0B1728] border border-[#182E4B] rounded-xl">
              <span className="text-xs text-slate-400">Days Remaining</span>
              <p className="text-sm font-bold text-emerald-400 mt-1">{apiData.sslCertificate?.daysRemaining ?? 60} Days</p>
            </div>
            <div className="p-4 bg-[#0B1728] border border-[#182E4B] rounded-xl">
              <span className="text-xs text-slate-400">Status</span>
              <div className="mt-1">
                <StatusBadge status={apiData.sslCertificate?.status || 'HEALTHY'} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-[#101F33] border border-[#182E4B] rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-slate-100 mb-4">Recent Probe Execution Logs</h3>
          <div className="space-y-2">
            {(apiData.recentChecks || []).map((check: any) => (
              <div key={check.id} className="p-3 bg-[#0B1728] border border-[#182E4B] rounded-xl flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${check.isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="text-slate-400">{new Date(check.timestamp).toLocaleString()}</span>
                  <span className={`font-bold ${check.isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                    HTTP {check.statusCode || 'ERR'}
                  </span>
                </div>
                <span className="text-slate-300 font-bold">{check.responseTimeMs} ms</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Test Modal */}
      <ApiTestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        api={apiData}
      />
    </div>
  );
};
