import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Play, CheckCircle2, XCircle, Clock, Zap, Server, Shield, FileText } from 'lucide-react';
import apiService from '../../services/api';

interface ApiTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  api: any;
}

export const ApiTestModal: React.FC<ApiTestModalProps> = ({ isOpen, onClose, api }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleRunTest = async () => {
    if (!api?.id) return;
    setIsRunning(true);
    setError('');
    setResult(null);

    try {
      const res: any = await apiService.post(`/apis/${api.id}/test`);
      if (res.success) {
        setResult(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  if (!isOpen || !api) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Live Test Probe — ${api.name}`}
      subtitle={`Target: ${api.method} ${api.url}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Run Test Button Header */}
        <div className="flex items-center justify-between p-4 bg-[#0B1728] border border-[#182E4B] rounded-xl">
          <div>
            <span className="text-xs text-slate-400">Endpoint Method & URL</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2 py-0.5 text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded">
                {api.method}
              </span>
              <span className="text-sm font-mono text-slate-200 truncate max-w-md">{api.url}</span>
            </div>
          </div>
          <button
            onClick={handleRunTest}
            disabled={isRunning}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 shrink-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isRunning ? 'Probing...' : 'Execute Probe Test'}</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Live Test Results */}
        {result && (
          <div className="space-y-5 animate-fade-in">
            {/* Status Header */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                result.isSuccess
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              <div className="flex items-center gap-3">
                {result.isSuccess ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400" />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {result.isSuccess ? 'Health Check Passed' : 'Health Check Failed'}
                  </h4>
                  <p className="text-xs opacity-90">
                    {result.errorMessage || `Returned HTTP ${result.statusCode || 'N/A'}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-slate-100">{result.responseTimeMs} ms</span>
                <p className="text-[10px] text-slate-400">Total Latency</p>
              </div>
            </div>

            {/* Latency Breakdown Grid */}
            <div>
              <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Latency Phase Decomposition
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div className="p-2.5 bg-[#0B1728] border border-[#182E4B] rounded-lg text-center">
                  <span className="text-[10px] text-slate-400 block">DNS Lookup</span>
                  <span className="text-xs font-bold font-mono text-blue-400">{result.dnsLookupTimeMs} ms</span>
                </div>
                <div className="p-2.5 bg-[#0B1728] border border-[#182E4B] rounded-lg text-center">
                  <span className="text-[10px] text-slate-400 block">TCP Connect</span>
                  <span className="text-xs font-bold font-mono text-blue-400">{result.tcpConnectTimeMs} ms</span>
                </div>
                <div className="p-2.5 bg-[#0B1728] border border-[#182E4B] rounded-lg text-center">
                  <span className="text-[10px] text-slate-400 block">TLS Handshake</span>
                  <span className="text-xs font-bold font-mono text-blue-400">{result.tlsHandshakeTimeMs} ms</span>
                </div>
                <div className="p-2.5 bg-[#0B1728] border border-[#182E4B] rounded-lg text-center">
                  <span className="text-[10px] text-slate-400 block">Server TTFB</span>
                  <span className="text-xs font-bold font-mono text-blue-400">{result.serverProcessTimeMs} ms</span>
                </div>
                <div className="p-2.5 bg-[#0B1728] border border-[#182E4B] rounded-lg text-center">
                  <span className="text-[10px] text-slate-400 block">Download</span>
                  <span className="text-xs font-bold font-mono text-blue-400">{result.downloadTimeMs} ms</span>
                </div>
              </div>
            </div>

            {/* Response Payload Snippet */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Response Body Payload
                </h5>
                <span className="text-[10px] text-slate-500 font-mono">
                  {result.responseSizeByte} bytes
                </span>
              </div>
              <pre className="p-4 bg-[#07111F] border border-[#182E4B] rounded-xl text-xs font-mono text-slate-300 overflow-x-auto max-h-48 custom-scrollbar">
                {result.responseBodySnippet
                  ? (() => {
                      try {
                        return JSON.stringify(JSON.parse(result.responseBodySnippet), null, 2);
                      } catch {
                        return result.responseBodySnippet;
                      }
                    })()
                  : 'No response body payload returned.'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
