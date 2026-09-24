import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Server,
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  Trash2,
  Edit,
  ExternalLink,
  Shield,
  Activity,
} from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ApiFormModal } from '../components/api/ApiFormModal';
import { ApiTestModal } from '../components/api/ApiTestModal';
import api from '../services/api';

export const ApisPage: React.FC = () => {
  const [apis, setApis] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editApiTarget, setEditApiTarget] = useState<any>(null);
  const [testApiTarget, setTestApiTarget] = useState<any>(null);

  const fetchApis = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);

      const [resApis, resProjects]: any[] = await Promise.all([
        api.get(`/apis?${params.toString()}`),
        api.get('/projects'),
      ]);

      if (resApis.success) setApis(resApis.data);
      if (resProjects.success) setProjects(resProjects.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApis();
  }, [search, statusFilter]);

  const handlePauseToggle = async (id: string, isPaused: boolean) => {
    try {
      if (isPaused) {
        await api.post(`/apis/${id}/resume`);
      } else {
        await api.post(`/apis/${id}/pause`);
      }
      fetchApis();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.delete(`/apis/${id}`);
      fetchApis();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">API Monitors</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage endpoints, HTTP request methods, check frequencies, and live test executions.
          </p>
        </div>
        <button
          onClick={() => {
            setEditApiTarget(null);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add API Monitor</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#101F33] p-4 rounded-xl border border-[#182E4B]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search API name or URL..."
            className="w-full pl-9 pr-4 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="HEALTHY">Healthy</option>
            <option value="DEGRADED">Degraded</option>
            <option value="DOWN">Down</option>
            <option value="PAUSED">Paused</option>
          </select>
        </div>
      </div>

      {/* API Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apis.map((apiItem) => (
          <div
            key={apiItem.id}
            className="bg-[#101F33] border border-[#182E4B] hover:border-blue-500/40 rounded-2xl p-5 shadow-xl transition-all duration-200 space-y-4 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  to={`/apis/${apiItem.id}`}
                  className="text-base font-bold text-slate-100 hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <span>{apiItem.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
                </Link>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {apiItem.description || 'No description provided.'}
                </p>
              </div>
              <StatusBadge status={apiItem.status} />
            </div>

            {/* Endpoint Method & URL */}
            <div className="flex items-center gap-2 p-2.5 bg-[#0B1728] rounded-xl border border-[#182E4B]">
              <span className="px-2 py-0.5 text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                {apiItem.method}
              </span>
              <span className="font-mono text-xs text-slate-300 truncate">{apiItem.url}</span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#182E4B] text-center text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Frequency</span>
                <span className="font-mono font-semibold text-slate-300">{apiItem.intervalSeconds}s</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Avg Latency</span>
                <span className="font-mono font-semibold text-blue-400">
                  {apiItem.avgResponseMs ? `${apiItem.avgResponseMs}ms` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">24h Uptime</span>
                <span className="font-mono font-semibold text-emerald-400">
                  {apiItem.uptimePercent ? `${apiItem.uptimePercent}%` : '100%'}
                </span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-[#182E4B]">
              <button
                onClick={() => setTestApiTarget(apiItem)}
                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-emerald-400" />
                <span>Test Probe</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePauseToggle(apiItem.id, apiItem.isPaused)}
                  className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-[#0B1728] rounded-lg transition-colors"
                  title={apiItem.isPaused ? 'Resume Monitoring' : 'Pause Monitoring'}
                >
                  {apiItem.isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setEditApiTarget(apiItem);
                    setIsAddModalOpen(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-[#0B1728] rounded-lg transition-colors"
                  title="Edit API"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(apiItem.id, apiItem.name)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete API"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <ApiFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditApiTarget(null);
        }}
        onSuccess={fetchApis}
        initialData={editApiTarget}
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
