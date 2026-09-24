import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Check, RefreshCw } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import api from '../services/api';

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [resolveRootCause, setResolveRootCause] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.get(`/incidents?status=${filter}`);
      if (res.success) setIncidents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [filter]);

  const handleResolve = async () => {
    if (!selectedIncident) return;
    try {
      await api.post(`/incidents/${selectedIncident.id}/resolve`, {
        rootCause: resolveRootCause,
      });
      setSelectedIncident(null);
      setResolveRootCause('');
      fetchIncidents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Incident Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated downtime detection, timeline event tracking, and incident resolution center.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-[#101F33] border border-[#182E4B] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Incidents</option>
            <option value="ACTIVE">Active Incidents</option>
            <option value="RESOLVED">Resolved Incidents</option>
          </select>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {incidents.map((inc) => {
          const isResolved = inc.status === 'RESOLVED';
          return (
            <div
              key={inc.id}
              className={`bg-[#101F33] border rounded-2xl p-6 shadow-xl space-y-4 ${
                isResolved ? 'border-[#182E4B]' : 'border-rose-500/40 bg-rose-500/5'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {isResolved ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 animate-bounce" />
                  )}
                  <div>
                    <h3 className="font-bold text-slate-100 text-base">{inc.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      API Target: <strong className="text-slate-200">{inc.api?.name}</strong> ({inc.api?.url})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isResolved
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 glow-down'
                    }`}
                  >
                    {inc.status}
                  </span>

                  {!isResolved && (
                    <button
                      onClick={() => setSelectedIncident(inc)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Resolve Incident</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Diagnostic Root Cause */}
              <div className="p-3 bg-[#0B1728] border border-[#182E4B] rounded-xl text-xs text-slate-300 font-mono">
                <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold mb-1">
                  Root Cause Diagnostic Trace:
                </span>
                {inc.rootCause || 'Upstream server error or response validation failure.'}
              </div>

              {/* Event Timeline */}
              {inc.events?.length > 0 && (
                <div className="pt-3 border-t border-[#182E4B] space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Incident Timeline Events
                  </span>
                  <div className="space-y-1.5">
                    {inc.events.map((evt: any) => (
                      <div key={evt.id} className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        <span className="font-mono text-[10px] text-slate-500">
                          {new Date(evt.createdAt).toLocaleTimeString()}
                        </span>
                        <span className="text-slate-300">{evt.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Manual Resolve Modal */}
      <Modal
        isOpen={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        title="Resolve Incident"
        subtitle={`Resolving ${selectedIncident?.title}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Resolution Notes & Root Cause Summary
            </label>
            <textarea
              value={resolveRootCause}
              onChange={(e) => setResolveRootCause(e.target.value)}
              placeholder="Describe the fix applied (e.g. Cleared database deadlock and restarted pod)..."
              className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500 h-24"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-[#182E4B]">
            <button
              onClick={() => setSelectedIncident(null)}
              className="px-4 py-2 bg-[#0B1728] text-slate-300 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleResolve}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-500/20"
            >
              Confirm Resolution
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
