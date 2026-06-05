import React from 'react';
import type { DemandStatus } from '../types';

interface StatusPillProps {
  status: DemandStatus;
}

const statusColorMap: Record<DemandStatus, string> = {
  PIZZA: 'bg-[var(--status-warning-bg)] text-[var(--status-warning-text)] border-yellow-200',
  LOCK: 'bg-[var(--status-error-bg)] text-[var(--status-error-text)] border-red-200',
  COMPLETED: 'bg-[var(--status-success-bg)] text-[var(--status-success-text)] border-green-200',
  '': 'bg-slate-100 text-slate-500 border-slate-200',
};

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  if (!status) {
    return <span className="text-slate-400">—</span>;
  }
  
  const colorClasses = statusColorMap[status] || 'bg-slate-100 text-slate-600';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${colorClasses}`}>
      {status}
    </span>
  );
};