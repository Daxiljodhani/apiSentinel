import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Eye } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import api from '../services/api';

export const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status !== 'ALL') params.append('status', status);

      const res: any = await api.get(`/analytics/logs?${params.toString()}`);
      if (res.success && res.data) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search, status]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Centralized Monitoring Logs</h1>
        <p className="text-xs text-slate-400 mt-1">
          Time-series log stream of every HTTP health check execution, timing breakdown, and error trace.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#101F33] p-4 rounded-xl border border-[#182E4B]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search API name or error message..."
            className="w-full pl-9 pr-4 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Execution Results</option>
            <option value="SUCCESS">Successful Checks</option>
            <option value="FAILURE">Failed Probes</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#101F33] border border-[#182E4B] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B1728] border-b border-[#182E4B] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">API Name</th>
                <th className="py-3.5 px-6">Method & Endpoint</th>
                <th className="py-3.5 px-6">Status Code</th>
                <th className="py-3.5 px-6">Latency</th>
                <th className="py-3.5 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182E4B] text-xs font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#0B1728]/50 transition-colors">
                  <td className="py-3.5 px-6 text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6 font-sans font-bold text-slate-200">
                    {log.api?.name || 'Unknown API'}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded mr-2">
                      {log.api?.method || 'GET'}
                    </span>
                    <span className="text-slate-400 truncate max-w-xs">{log.api?.url}</span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.isSuccess
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {log.statusCode ? `HTTP ${log.statusCode}` : 'FAILED'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-200">
                    {log.responseTimeMs} ms
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-[#0B1728] rounded-lg transition-colors"
                      title="Inspect Log Payload"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Modal */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Check Execution Log Details"
        subtitle={`ID: ${selectedLog?.id}`}
      >
        {selectedLog && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-3 bg-[#0B1728] border border-[#182E4B] rounded-xl flex justify-between">
              <span className="text-slate-400">Timestamp:</span>
              <span className="text-slate-200">{new Date(selectedLog.timestamp).toISOString()}</span>
            </div>

            {selectedLog.errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
                <span className="font-bold block mb-1">Error Trace:</span>
                {selectedLog.errorMessage}
              </div>
            )}

            <div>
              <span className="text-slate-400 block mb-1">Response Body Snippet:</span>
              <pre className="p-3 bg-[#07111F] border border-[#182E4B] rounded-xl text-slate-300 overflow-x-auto max-h-48 custom-scrollbar">
                {selectedLog.responseBodySnippet || 'No response body snippet stored.'}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
