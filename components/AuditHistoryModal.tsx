

import React, { useState, useMemo } from 'react';
import type { AuditLog } from '../types';

interface AuditHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLog[];
  demandProclaim: string;
  theme: Record<string, string>;
}

export const AuditHistoryModal: React.FC<AuditHistoryModalProps> = ({ isOpen, onClose, logs, demandProclaim, theme }) => {
  if (!isOpen) return null;
  
  const [selectedUser, setSelectedUser] = useState<string>('ALL');

  const usersInLog = useMemo(() => ['ALL', ...Array.from(new Set(logs.map(l => l.user)))], [logs]);
  
  const filteredLogs = useMemo(() => {
    if (selectedUser === 'ALL') return logs;
    return logs.filter(log => log.user === selectedUser);
  }, [logs, selectedUser]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[var(--background-primary)] p-8 rounded-xl shadow-2xl w-full max-w-2xl border border-[var(--border-primary)] m-4 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className='flex justify-between items-start'>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Audit History for #{demandProclaim}</h2>
            <button onClick={onClose} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">&times;</button>
        </div>
        
        <div className="mb-4">
            <label htmlFor="user-filter" className="text-sm font-medium text-[var(--text-secondary)] mr-2">Filter by User:</label>
            <select
                id="user-filter"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md px-3 py-1 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)]"
            >
                {usersInLog.map(user => (
                    <option key={user} value={user}>{user}</option>
                ))}
            </select>
        </div>


        <div className="flex-grow overflow-y-auto max-h-[60vh] pr-4 -mr-4 custom-scrollbar">
          {filteredLogs.length > 0 ? (
            <div className="border-l-2 border-[var(--border-secondary)] ml-2">
                {filteredLogs.map((log, index) => (
                    <div key={log.id} className="relative mb-6 pl-8">
                        <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full ${index === 0 ? theme.bg : 'bg-[var(--background-tertiary)]'}`}></div>
                        <div className="p-4 bg-[var(--background-primary-translucent)] rounded-lg border border-[var(--border-primary-translucent)]">
                            <div className="flex justify-between items-center mb-2">
                                <span className={`font-semibold ${theme.text}`}>{log.action}</span>
                                <span className="text-xs text-[var(--text-tertiary)]">{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-[var(--text-primary)]"><span className="font-medium text-[var(--text-secondary)]">User:</span> {log.user}</p>
                            <p className="text-sm text-[var(--text-primary)] mt-1"><span className="font-medium text-[var(--text-secondary)]">Details:</span> {log.details}</p>
                        </div>
                    </div>
                ))}
            </div>
          ) : (
            <p className="text-[var(--text-secondary)] text-center py-8">No history found for this user.</p>
          )}
        </div>
        <div className="flex justify-end mt-8">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-md text-[var(--text-primary)] bg-[var(--background-secondary-translucent)] hover:bg-[var(--background-hover)] transition-colors font-semibold">Close</button>
        </div>
      </div>
    </div>
  );
};
