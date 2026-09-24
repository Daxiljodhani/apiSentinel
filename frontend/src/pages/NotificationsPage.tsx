import React, { useState, useEffect } from 'react';
import { Bell, Check, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    try {
      const res: any = await api.get('/alerts/notifications');
      if (res.success) setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.post('/alerts/notifications/read');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Notification Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            System notifications for failures, recoveries, and SSL certificate expiration warnings.
          </p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 bg-[#101F33] hover:bg-[#182E4B] border border-[#182E4B] text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 w-fit"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
              n.isRead ? 'bg-[#101F33]/50 border-[#182E4B]' : 'bg-[#101F33] border-blue-500/40 shadow-lg shadow-blue-500/5'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-100 text-sm">{n.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5">{n.message}</p>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />}
          </div>
        ))}
      </div>
    </div>
  );
};
