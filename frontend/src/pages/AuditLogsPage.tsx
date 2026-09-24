import React, { useState, useEffect } from 'react';
import { History, Shield, User } from 'lucide-react';
import api from '../services/api';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    api.get('/audit-logs').then((res: any) => {
      if (res.success) setLogs(res.data);
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">System Audit Log</h1>
        <p className="text-xs text-slate-400 mt-1">
          Compliance log tracking user administrative actions, API creation, environment modifications, and security events.
        </p>
      </div>

      <div className="bg-[#101F33] border border-[#182E4B] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B1728] border-b border-[#182E4B] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-6">Action</th>
                <th className="py-3.5 px-6">Target Resource</th>
                <th className="py-3.5 px-6">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182E4B] text-xs font-mono">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-[#0B1728]/50">
                  <td className="py-3.5 px-6 text-slate-400">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="py-3.5 px-6 font-sans font-bold text-slate-200">
                    {l.user?.name || 'System Admin'}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {l.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-sans font-semibold text-slate-300">{l.resource}</td>
                  <td className="py-3.5 px-6 text-slate-400 truncate max-w-xs">{l.details || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
