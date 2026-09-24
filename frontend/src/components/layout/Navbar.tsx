import React, { useState } from 'react';
import { Search, Bell, LogOut, Shield, Wifi, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const { user, logout } = useAuth();
  const { isConnected } = useSocket();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-[#0B1728]/90 backdrop-blur border-b border-[#182E4B] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Palette Button */}
      <button
        onClick={onOpenCommandPalette}
        className="flex items-center gap-3 px-4 py-2 bg-[#101F33] hover:bg-[#182E4B] border border-[#182E4B] rounded-xl text-slate-400 hover:text-slate-200 transition-all text-xs w-72 justify-between group"
      >
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
          <span>Search APIs, logs, incidents...</span>
        </div>
        <kbd className="px-2 py-0.5 bg-[#07111F] text-[10px] text-slate-400 rounded border border-[#182E4B] font-mono">
          Ctrl K
        </kbd>
      </button>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-4">
        {/* Real-time WebSocket connection indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#101F33] border border-[#182E4B] text-xs">
          <Wifi className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          <span className="text-slate-300 hidden sm:inline">{isConnected ? 'Real-Time Sync' : 'Polling'}</span>
        </div>

        {/* Public Status Page Shortcut */}
        <a
          href="/status/sentinel-status"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 glow-healthy" />
          <span>Status Page</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* Notifications Dropdown Toggle */}
        <button
          onClick={() => navigate('/notifications')}
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-[#101F33] rounded-lg transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
