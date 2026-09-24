import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Server,
  FolderGit2,
  Layers,
  BarChart3,
  FileText,
  AlertTriangle,
  Bell,
  Radio,
  Users,
  Settings,
  History,
  Activity,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const sections = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'MONITORING',
      items: [
        { label: 'APIs', path: '/apis', icon: Server },
        { label: 'Projects', path: '/projects', icon: FolderGit2 },
        { label: 'Environments', path: '/environments', icon: Layers },
      ],
    },
    {
      title: 'OBSERVABILITY',
      items: [
        { label: 'Analytics', path: '/analytics', icon: BarChart3 },
        { label: 'Logs', path: '/logs', icon: FileText },
        { label: 'Incidents', path: '/incidents', icon: AlertTriangle },
        { label: 'Reports', path: '/reports', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'ALERTING',
      items: [
        { label: 'Alert Rules', path: '/alerts', icon: Bell },
        { label: 'Notifications', path: '/notifications', icon: Activity },
        { label: 'Status Pages', path: '/status-pages', icon: Radio },
      ],
    },
    {
      title: 'ORGANIZATION',
      items: [
        { label: 'Team Members', path: '/team', icon: Users },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Settings', path: '/settings', icon: Settings },
        { label: 'Audit Logs', path: '/audit-logs', icon: History },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#0B1728] border-r border-[#182E4B] flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#182E4B] flex items-center gap-3 bg-[#07111F]">
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-slate-100 tracking-wide text-base flex items-center gap-1.5">
            API Sentinel
          </h1>
          <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            PRO PLATFORM
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
        {sections.map((sec, idx) => (
          <div key={idx}>
            <h3 className="px-3 text-[11px] font-semibold text-slate-500 tracking-wider uppercase mb-2">
              {sec.title}
            </h3>
            <div className="space-y-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#101F33]'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-[#182E4B] bg-[#07111F] flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt="Avatar"
            className="w-9 h-9 rounded-full border border-blue-500/40 object-cover shrink-0"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Alex Rivera'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@sentinel.io'}</p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-semibold uppercase">
          {user?.role || 'OWNER'}
        </span>
      </div>
    </aside>
  );
};
