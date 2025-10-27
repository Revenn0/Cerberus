import React from 'react';
import type { DemandStatus } from '../types';

interface StatusPillProps {
  status: DemandStatus;
}

const statusColorMap: Record<DemandStatus, string> = {
  PIZZA: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  LOCK: 'bg-red-500/20 text-red-300 border border-red-500/30',
  COMPLETED: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  '': 'bg-[var(--background-tertiary)] text-[var(--text-secondary)] border border-[var(--border-secondary)]',
};

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  if (!status) {
    return <span className="text-[var(--text-tertiary)]">—</span>;
  }
  
  const colorClasses = statusColorMap[status] || 'bg-gray-500/20 text-gray-300';
  
  return (
    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full capitalize ${colorClasses}`}>
      {status}
    </span>
  );
};