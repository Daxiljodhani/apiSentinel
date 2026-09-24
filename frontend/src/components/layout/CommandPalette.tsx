import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Server, FolderGit2, AlertTriangle, FileText, Settings, ArrowRight } from 'lucide-react';
import api from '../../services/api';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [apis, setApis] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      api.get('/apis').then((res: any) => {
        if (res.success && res.data) setApis(res.data);
      }).catch(() => {});
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const pages = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: Server },
    { name: 'API Management', path: '/apis', icon: Server },
    { name: 'Projects & Environments', path: '/projects', icon: FolderGit2 },
    { name: 'Incidents Center', path: '/incidents', icon: AlertTriangle },
    { name: 'Monitoring Logs', path: '/logs', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const filteredApis = apis.filter(
    (a) => a.name.toLowerCase().includes(query.toLowerCase()) || a.url.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPages = pages.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#101F33] border border-[#182E4B] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#182E4B] bg-[#0B1728]">
          <Search className="w-5 h-5 text-blue-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search APIs, or jump to page..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
            autoFocus
          />
          <span className="text-[10px] text-slate-500 font-mono px-2 py-1 bg-[#07111F] rounded border border-[#182E4B]">
            ESC to close
          </span>
        </div>

        {/* Results list */}
        <div className="p-3 max-h-96 overflow-y-auto custom-scrollbar space-y-4">
          {/* Quick Pages */}
          {filteredPages.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Pages & Navigation
              </p>
              <div className="space-y-1">
                {filteredPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.path}
                      onClick={() => handleSelect(page.path)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-[#182E4B] transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-blue-400" />
                        <span>{page.name}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Monitored APIs */}
          {filteredApis.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Monitored APIs ({filteredApis.length})
              </p>
              <div className="space-y-1">
                {filteredApis.map((api) => (
                  <button
                    key={api.id}
                    onClick={() => handleSelect(`/apis/${api.id}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-[#182E4B] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="text-xs font-mono font-semibold text-blue-400 px-1.5 py-0.5 rounded bg-blue-500/10">
                        {api.method}
                      </span>
                      <div className="truncate">
                        <p className="font-medium text-slate-200 truncate">{api.name}</p>
                        <p className="text-xs text-slate-500 truncate">{api.url}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredPages.length === 0 && filteredApis.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-sm">
              No matching APIs or commands found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
