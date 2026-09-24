import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, CheckCircle2, AlertTriangle, XCircle, Clock, Activity } from 'lucide-react';
import api from '../services/api';

export const PublicStatusPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      api
        .get(`/status-pages/public/${slug}`)
        .then((res: any) => {
          if (res.success) setData(res.data);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [slug]);

  if (isLoading) {
    return <div className="min-h-screen bg-[#07111F] text-slate-400 p-12 text-center">Loading Status Page...</div>;
  }

  if (!data) {
    return <div className="min-h-screen bg-[#07111F] text-rose-400 p-12 text-center">Status Page Not Found</div>;
  }

  const isOperational = data.overallStatus === 'OPERATIONAL';

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F8FAFC] p-6 sm:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Branding */}
        <div className="flex items-center justify-between border-b border-[#182E4B] pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{data.name}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{data.description || 'Real-time operational status'}</p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">Live Telemetry</span>
        </div>

        {/* Global Operational Banner */}
        <div
          className={`p-6 rounded-2xl border flex items-center justify-between shadow-2xl ${
            isOperational
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-4">
            {isOperational ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
            )}
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">
                {isOperational ? 'All Systems Operational' : 'Partial Service Disruption'}
              </h2>
              <p className="text-xs opacity-90 mt-0.5">
                {isOperational ? 'All monitored API services are responding normally.' : 'One or more services are experiencing downtime.'}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-black/30 border border-current">
            Updated just now
          </span>
        </div>

        {/* Service Status Grid */}
        <div className="bg-[#101F33] border border-[#182E4B] rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Services Status</h3>
          <div className="divide-y divide-[#182E4B]">
            {data.services?.map((svc: any) => {
              const isHealthy = svc.api?.status === 'HEALTHY';
              return (
                <div key={svc.id} className="py-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-200 text-sm block">{svc.displayName || svc.api?.name}</span>
                    <span className="text-xs font-mono text-slate-500">{svc.api?.url}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${isHealthy ? 'bg-emerald-500 glow-healthy' : 'bg-rose-500 glow-down'}`} />
                    <span className={`text-xs font-bold ${isHealthy ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {svc.api?.status || 'HEALTHY'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Incidents */}
        {data.activeIncidents?.length > 0 && (
          <div className="bg-[#101F33] border border-rose-500/30 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Active System Incidents</span>
            </h3>
            <div className="space-y-3">
              {data.activeIncidents.map((inc: any) => (
                <div key={inc.id} className="p-4 bg-[#0B1728] border border-[#182E4B] rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-200 text-sm">{inc.title}</h4>
                  <p className="text-xs text-slate-400">{inc.rootCause}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
