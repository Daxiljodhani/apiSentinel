import React, { useState, useEffect } from 'react';
import { Bell, Plus, Mail, Globe, Shield, Check, Power } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import api from '../services/api';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [apis, setApis] = useState<any[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiId, setApiId] = useState('');
  const [type, setType] = useState('API_DOWN');
  const [consecutiveThreshold, setConsecutiveThreshold] = useState(3);
  const [cooldownMinutes, setCooldownMinutes] = useState(15);
  const [channelType, setChannelType] = useState('EMAIL');
  const [destination, setDestination] = useState('alerts@sentinel.io');

  const fetchAlerts = async () => {
    try {
      const [aRes, apisRes]: any[] = await Promise.all([
        api.get('/alerts'),
        api.get('/apis'),
      ]);
      if (aRes.success) setAlerts(aRes.data);
      if (apisRes.success) {
        setApis(apisRes.data);
        if (apisRes.data.length > 0) setApiId(apisRes.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/alerts', {
        apiId,
        type,
        consecutiveThreshold: Number(consecutiveThreshold),
        cooldownMinutes: Number(cooldownMinutes),
        channelType,
        destination,
      });
      setIsModalOpen(false);
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await api.post(`/alerts/${id}/toggle`);
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Smart Alert Rules</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure alert rules, consecutive failure thresholds, and notification destinations.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Alert Rule</span>
        </button>
      </div>

      {/* Alert Rules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((rule) => (
          <div
            key={rule.id}
            className={`bg-[#101F33] border rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between ${
              rule.isEnabled ? 'border-[#182E4B]' : 'border-slate-800 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{rule.api?.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{rule.type}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(rule.id)}
                  className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    rule.isEnabled
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                  title={rule.isEnabled ? 'Disable Alert' : 'Enable Alert'}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-[#0B1728] border border-[#182E4B] rounded-xl text-xs space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Threshold:</span>
                  <span className="font-bold">{rule.consecutiveThreshold} consecutive failures</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cooldown:</span>
                  <span className="font-bold">{rule.cooldownMinutes} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Channel & Target:</span>
                  <span className="font-bold font-mono text-blue-400">{rule.channelType}: {rule.destination}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Alert Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Alert Rule"
        subtitle="Specify threshold rules to eliminate alert spam."
      >
        <form onSubmit={handleCreateAlert} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target API</label>
            <select
              value={apiId}
              onChange={(e) => setApiId(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-sm text-slate-100"
            >
              {apis.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Alert Condition</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs text-slate-100"
              >
                <option value="API_DOWN">API Down</option>
                <option value="LATENCY_EXCEEDED">Latency Exceeded</option>
                <option value="SSL_EXPIRING">SSL Certificate Expiring</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Consecutive Failures</label>
              <input
                type="number"
                value={consecutiveThreshold}
                onChange={(e) => setConsecutiveThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs text-slate-100"
                min={1}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Channel Type</label>
              <select
                value={channelType}
                onChange={(e) => setChannelType(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs text-slate-100"
              >
                <option value="EMAIL">Email</option>
                <option value="WEBHOOK">Webhook POST</option>
                <option value="IN_APP">In-App Notification</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Destination Target</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="alerts@domain.com or https://..."
                className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#182E4B]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-[#0B1728] text-slate-300 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
            >
              Save Alert Rule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
