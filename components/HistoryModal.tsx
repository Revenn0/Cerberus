

import React, { useState, useMemo, useEffect } from 'react';
import type { DemandEntry, Sector, User, AuditLog } from '../types';
import { SECTOR_THEMES } from '../constants';

const Calendar: React.FC<{ onDateSelect: (date: string) => void, selectedDate: string, highlightedDates: string[] }> = ({ onDateSelect, selectedDate, highlightedDates }) => {
    const [date, setDate] = useState(new Date());

    const renderHeader = () => (
        <div className="flex justify-between items-center mb-4">
            <button onClick={() => setDate(new Date(date.setMonth(date.getMonth() - 1)))} className="p-2 rounded-full hover:bg-[var(--background-hover)]">&lt;</button>
            <h3 className="text-lg font-semibold">{date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}</h3>
            <button onClick={() => setDate(new Date(date.setMonth(date.getMonth() + 1)))} className="p-2 rounded-full hover:bg-[var(--background-hover)]">&gt;</button>
        </div>
    );

    const renderDays = () => (
        <div className="grid grid-cols-7 text-center text-xs text-[var(--text-secondary)] mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
        </div>
    );

    const renderCells = () => {
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const startDate = new Date(monthStart);
        startDate.setDate(startDate.getDate() - monthStart.getDay());
        const cells = [];
        let day = startDate;

        while (day <= monthEnd || day.getDay() !== 0) {
            const isoDate = day.toISOString().split('T')[0];
            const isCurrentMonth = day.getMonth() === date.getMonth();
            const isSelected = isoDate === selectedDate;
            const isHighlighted = highlightedDates.includes(isoDate);

            cells.push(
                <div key={day.toString()} className="flex justify-center items-center h-10">
                    <button
                        onClick={() => onDateSelect(isoDate)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors
                            ${!isCurrentMonth ? 'text-[var(--text-tertiary)] opacity-50' : 'text-[var(--text-primary)]'}
                            ${isSelected ? 'bg-[var(--brand-bg)] text-white font-bold' : ''}
                            ${!isSelected && isHighlighted ? 'bg-teal-500/20' : ''}
                            ${!isSelected ? 'hover:bg-[var(--background-hover)]' : ''}
                        `}
                    >
                        {day.getDate()}
                    </button>
                </div>
            );
            
            if (day.getDay() === 6 && day > monthEnd) break;
            day = new Date(day.setDate(day.getDate() + 1));
        }
        return <div className="grid grid-cols-7">{cells}</div>;
    };
    
    return <div className="bg-[var(--background-primary)] rounded-lg p-4">{renderHeader()}{renderDays()}{renderCells()}</div>;
};

const ActivityLogView: React.FC<{ logs: AuditLog[]; demands: DemandEntry[] }> = ({ logs, demands }) => {
    if (logs.length === 0) {
        return <div className="text-center py-16 text-[var(--text-secondary)]">No activity recorded for this selection.</div>
    }

    const sortedLogs = logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="space-y-4">
            {sortedLogs.map(log => {
                const demand = demands.find(d => d.id === log.demandId);
                const theme = demand ? SECTOR_THEMES[demand.currentSector] : SECTOR_THEMES.LOGISTICS;
                return (
                    <div key={log.id} className="p-4 bg-[var(--background-secondary)] rounded-lg border-l-4 border-[var(--border-secondary)]">
                        <div className="flex justify-between items-center text-xs text-[var(--text-tertiary)] mb-2">
                           <span className="font-semibold">USER: {log.user}</span>
                           <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className={`font-semibold ${theme.text}`}>
                            {log.action} on Demand #{demand?.proclaim || log.demandProclaim}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">{log.details}</p>
                    </div>
                );
            })}
        </div>
    );
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  allDemands: DemandEntry[];
  currentUser: User;
  auditLog: AuditLog[];
  allUsers: User[];
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, allDemands, currentUser, auditLog, allUsers }) => {
    if (!isOpen) return null;

    const [activeSector, setActiveSector] = useState<Sector>(currentUser.sector);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedUser, setSelectedUser] = useState<string>('ALL');

    const TABS: Sector[] = ['LOGISTICS', 'WORKSHOP', 'HIREFLEET'];

    const usersInSector = useMemo(() => {
        return allUsers.filter(u => u.sector === activeSector);
    }, [allUsers, activeSector]);

    const filteredLogs = useMemo(() => {
        let logs = auditLog;

        const userNamesInSector = usersInSector.map(u => u.name);
        const sectorFilteredLogs = logs.filter(log => {
            const user = allUsers.find(u => u.name === log.user);
            return user && user.sector === activeSector;
        });

        if (selectedUser !== 'ALL') {
            logs = sectorFilteredLogs.filter(log => log.user === selectedUser);
        } else {
            logs = sectorFilteredLogs;
        }

        logs = logs.filter(log => log.timestamp.startsWith(selectedDate));
        
        return logs;
    }, [auditLog, selectedDate, selectedUser, activeSector, allUsers, usersInSector]);
    
    const highlightedDates = useMemo(() => {
        const userNamesInSector = usersInSector.map(u => u.name);
        const logsInSector = auditLog.filter(log => userNamesInSector.includes(log.user));
        return [...new Set(logsInSector.map(d => d.timestamp.split('T')[0]).filter(Boolean) as string[])];
    }, [auditLog, usersInSector]);
    
    useEffect(() => {
        setSelectedUser('ALL');
    }, [activeSector]);

    return (
        <div className="fixed inset-0 bg-[var(--background-backdrop)] flex items-center justify-center z-40 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[var(--background-primary)] rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] border border-[var(--border-primary)] m-4 flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-6 border-b border-[var(--border-primary)] flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Activity Log</h2>
                    <button onClick={onClose} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] text-3xl">&times;</button>
                </header>

                <div className="flex-1 flex flex-col lg:flex-row gap-8 p-6 overflow-hidden">
                    <aside className="w-full lg:w-96 flex-shrink-0">
                        <Calendar onDateSelect={setSelectedDate} selectedDate={selectedDate} highlightedDates={highlightedDates}/>
                    </aside>
                    <main className="flex-1 bg-[var(--background-primary-translucent)] border border-[var(--border-primary-translucent)] shadow-lg rounded-xl overflow-hidden flex flex-col">
                        <div className="px-6 pt-6 flex-shrink-0">
                            <div className="mb-4 border-b border-[var(--border-primary)]">
                                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                    {TABS.map(tab => {
                                        const theme = SECTOR_THEMES[tab];
                                        const isActive = activeSector === tab;
                                        return (
                                        <button key={tab} onClick={() => setActiveSector(tab)} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${isActive ? `${theme.border} ${theme.text}` : `border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)] ${theme.hoverBorder}`}`}>
                                            {tab.charAt(0) + tab.slice(1).toLowerCase()}
                                        </button>
                                        );
                                    })}
                                </nav>
                            </div>
                            <div className="flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Activity on {new Date(selectedDate+'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'})}</h2>
                                    <p className="text-[var(--text-secondary)] text-sm">Showing {filteredLogs.length} actions for the <span className={`font-semibold ${SECTOR_THEMES[activeSector].text}`}>{activeSector.toLowerCase()}</span> sector.</p>
                                </div>
                                <div>
                                    <label htmlFor="user-select" className="sr-only">Filter by user</label>
                                    <select 
                                     id="user-select"
                                     value={selectedUser}
                                     onChange={(e) => setSelectedUser(e.target.value)}
                                     className="bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)]">
                                        <option value="ALL">All Users in Sector</option>
                                        {usersInSector.map(user => (
                                            <option key={user.id} value={user.name}>{user.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto mt-4 px-6 pb-6">
                            <ActivityLogView logs={filteredLogs} demands={allDemands} />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};
