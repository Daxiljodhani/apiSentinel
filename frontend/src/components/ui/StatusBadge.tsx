import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, XCircle, PauseCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'PAUSED' | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  let badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let dotStyle = 'bg-emerald-500 glow-healthy';
  let Icon = CheckCircle2;
  let label = 'Healthy';

  switch (status) {
    case 'HEALTHY':
    case 'OPERATIONAL':
      badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      dotStyle = 'bg-emerald-500 glow-healthy';
      Icon = CheckCircle2;
      label = 'Healthy';
      break;
    case 'DEGRADED':
      badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      dotStyle = 'bg-amber-500';
      Icon = AlertTriangle;
      label = 'Degraded';
      break;
    case 'DOWN':
    case 'OUTAGE':
      badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      dotStyle = 'bg-rose-500 glow-down';
      Icon = XCircle;
      label = 'Down';
      break;
    case 'PAUSED':
      badgeStyle = 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      dotStyle = 'bg-slate-500';
      Icon = PauseCircle;
      label = 'Paused';
      break;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1.5 text-sm font-semibold' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${badgeStyle} ${padding} transition-all duration-200`}>
      <span className={`h-2 w-2 rounded-full ${dotStyle}`} />
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </span>
  );
};
