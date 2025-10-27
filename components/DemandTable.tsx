

import React from 'react';
import type { DemandEntry, Sector, User } from '../types';
import { StatusPill } from './StatusPill';
import { TAG_TYPE_THEMES } from '../constants';
import { EditableCell } from './EditableCell';

interface DemandTableProps {
  data: DemandEntry[];
  onCopy: (message: string) => void;
  onEdit: (id: number) => void;
  onHandover: (entry: DemandEntry) => void;
  onComplete: (entry: DemandEntry) => void;
  onViewHistory: (id: number) => void;
  activeSector: Sector;
  collapsedGroups: Record<string, boolean>;
  onToggleGroup: (groupName: string) => void;
  theme: Record<string, string>;
  currentUser: User;
  onUpdateCell: (demandId: number, field: keyof DemandEntry, value: any) => void;
  onRowDragStart: (e: React.DragEvent, demand: DemandEntry) => void;
  highlightedDemandId: number | null;
  editingCell: string | null;
  setEditingCell: (cell: string | null) => void;
}

const tableHeaders = [
  { title: 'CLIENT', id: 'clientName', className: 'w-1/12' },
  { title: 'PROCLAIM', id: 'proclaim', className: 'w-1/12' },
  { title: 'POSTCODE', id: 'postcode', className: 'w-1/12' },
  { title: 'MODEL OF BIKE', id: 'model', className: 'w-2/12' },
  { title: 'CAT', id: 'category', className: 'w-auto' },
  { title: 'CONTRACT', id: 'contract', className: 'w-auto' },
  { title: 'STATUS', id: 'status', className: 'w-auto text-center' },
  { title: 'HELMET', id: 'helmet', className: 'w-1/12' },
  { title: 'LICENCE', id: 'licenceType', className: 'w-auto' },
  { title: 'ROUTED', id: 'routedDate', className: 'w-auto' },
  { title: 'CONFIRMED', id: 'confirmedDate', className: 'w-auto' },
  { title: 'SWAP', id: 'swap', className: 'w-auto' },
  { title: 'TAGS', id: 'tags', className: 'w-2/12' },
  { title: 'VEHICLE INFO', id: 'vehicleInfo', className: 'w-2/12' },
  { title: 'REG', id: 'registration', className: 'w-1/12' },
  { title: 'CYRUS', id: 'cyrusConfirmation', className: 'w-auto text-center' },
  { title: 'LAST MODIFIED', id: 'lastModifiedAt', className: 'w-1/12' },
  { title: 'WORKSHOP WORKING', id: 'workshopStatus', className: 'w-1/12 text-center' },
  { title: 'ACTIONS', id: 'actions', className: 'w-auto text-center' },
];

const editableFields: (keyof DemandEntry)[] = [
    'clientName', 'proclaim', 'postcode', 'category', 'contract', 'helmet', 
    'routedDate', 'confirmedDate', 'vehicleInfo', 'swap', 'cyrusConfirmation'
];

const editableFieldsBySector: Record<Sector, (keyof DemandEntry)[]> = {
    LOGISTICS: ['clientName', 'proclaim', 'postcode', 'category', 'contract', 'helmet', 'licenceType', 'routedDate', 'confirmedDate', 'swap'],
    WORKSHOP: ['vehicleInfo', 'workshopStatus'],
    HIREFLEET: ['cyrusConfirmation'],
};

const ClipboardIcon = ({ className = 'w-4 h-4' }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.045M15.666 3.888c.338.227.626.508.857.828a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25-2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-7.5a2.25 2.25 0 0 1 2.25-2.25h3.834" /></svg>;
const PencilIcon = ({ className = 'w-4 h-4' }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const ChevronDownIcon = ({ className = 'w-5 h-5' }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>;
const LockClosedIcon = ({ className = 'w-4 h-4' }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" /></svg>;
const ArrowRightIcon = ({ className = 'w-4 h-4' }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M2 10a.75.75 0 0 1 .75-.75h12.59l-2.1-1.95a.75.75 0 1 1 1.02-1.1l3.5 3.25a.75.75 0 0 1 0 1.1l-3.5 3.25a.75.75 0 1 1-1.02-1.1l2.1-1.95H2.75A.75.75 0 0 1 2 10Z" clipRule="evenodd" /></svg>;
const ClockIcon = ({ className = 'w-4 h-4' }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const CheckCircleIcon = ({ className = 'w-4 h-4' }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>;

const CopyButton: React.FC<{ text: string; onCopy: (msg: string) => void; title: string; themeColor: string }> = ({ text, onCopy, title, themeColor }) => {
    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text).then(() => onCopy(`Copied: ${title}`)).catch(err => console.error("Copy failed", err));
    };
    return <button onClick={handleCopy} className={`text-[var(--text-tertiary)] hover:${themeColor} transition-colors`} title={`Copy ${title}`}><ClipboardIcon /></button>;
};

const ActionButton: React.FC<{
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
  label: string;
  className: string;
}> = ({ onClick, title, icon, label, className }) => (
  <button
    onClick={onClick}
    title={title}
    className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors w-24 h-20 ${className}`}
  >
    {icon}
    <span className="text-xs font-semibold uppercase">{label}</span>
  </button>
);

export const DemandTable: React.FC<DemandTableProps> = (props) => {
  const { data, onCopy, onEdit, onHandover, onComplete, onViewHistory, activeSector, collapsedGroups, onToggleGroup, theme, currentUser, onUpdateCell, onRowDragStart, highlightedDemandId, editingCell, setEditingCell } = props;
  
  let lastGroup: string | undefined = undefined;

  const SECTOR_FLOW: Record<Sector, Sector | null> = { LOGISTICS: 'WORKSHOP', WORKSHOP: 'HIREFLEET', HIREFLEET: null };
  
  const isCellEditable = (field: keyof DemandEntry) => {
    if (!editableFields.includes(field) && field !== 'workshopStatus') return false;
    if (currentUser.role === 'admin') return true;
    
    const sectorEditableFields = editableFieldsBySector[activeSector];
    
    if (currentUser.role === 'user' && currentUser.sector !== activeSector) return false;
    
    return sectorEditableFields?.includes(field) ?? false;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[var(--border-primary)] text-sm">
        <thead className="bg-black/20 sticky top-0 z-[1]">
          <tr>
            {tableHeaders.map(header => <th key={header.id} scope="col" className={`px-4 py-3.5 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider ${header.className || ''}`}>{header.title}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-primary-translucent)] bg-[var(--background-primary-translucent)]">
          {data.length === 0 ? (
            <tr><td colSpan={tableHeaders.length} className="text-center py-16 text-[var(--text-secondary)]">No active demands in this sector.</td></tr>
          ) : data.map(item => {
            const showGroup = item.group && item.group !== lastGroup;
            if (item.group) lastGroup = item.group;
            const isCollapsed = item.group ? collapsedGroups[item.group] : false;

            return (
              <React.Fragment key={item.id}>
                {showGroup && (
                  <tr className="bg-[var(--background-secondary-translucent)] border-y border-[var(--border-primary-translucent)] cursor-pointer hover:bg-[var(--background-hover)]" onClick={() => onToggleGroup(item.group!)}>
                    <td colSpan={tableHeaders.length} className="px-4 py-2 text-sm font-bold text-[var(--text-primary)] tracking-wide">
                       <div className="flex items-center justify-between">
                          <span>{item.group}</span>
                          <ChevronDownIcon className={`w-6 h-6 text-[var(--text-secondary)] transition-transform duration-300 ${isCollapsed ? '-rotate-90' : ''}`} />
                       </div>
                    </td>
                  </tr>
                )}
                {!isCollapsed && (
                  <tr draggable="true" onDragStart={(e) => onRowDragStart(e, item)} data-demand-id={item.id} className={`transition-colors duration-150 ease-in-out cursor-grab ${item.lockedBy ? 'bg-amber-900/20' : 'hover:bg-[var(--background-hover)]'} ${highlightedDemandId === item.id ? 'yellow-flash' : ''}`}>
                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-[var(--text-primary)]"><EditableCell item={item} field="clientName" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('clientName')} /></td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--text-primary)]"><div className="flex items-center justify-between gap-2"><EditableCell item={item} field="proclaim" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('proclaim')} /><CopyButton text={item.proclaim} onCopy={onCopy} title="Proclaim ID" themeColor={theme.text} /></div></td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--text-secondary)]"><EditableCell item={item} field="postcode" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('postcode')} transform='uppercase' /></td>
                    <td className="px-4 py-4 text-[var(--text-primary)]"><EditableCell item={item} field="model" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={false} /></td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--text-secondary)]"><EditableCell item={item} field="category" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('category')} /></td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--text-secondary)]"><EditableCell item={item} field="contract" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('contract')} /></td>
                    <td className="whitespace-nowrap px-4 py-4 text-center"><StatusPill status={item.status} /></td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--text-primary)]"><EditableCell item={item} field="helmet" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('helmet')} placeholder="—" /></td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--text-secondary)]">{item.licenceType}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-yellow-400"><EditableCell item={item} field="routedDate" type="date" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('routedDate')} placeholder="—" /></td>
                    <td className="whitespace-nowrap px-4 py-4 font-bold text-green-400"><EditableCell item={item} field="confirmedDate" type="date" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('confirmedDate')} placeholder="—" /></td>
                    <td className={`whitespace-nowrap px-4 py-4 font-bold ${item.swap === 'YES' ? 'text-yellow-300' : 'text-gray-500'}`}><EditableCell item={item} field="swap" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('swap')} /></td>
                    <td className="px-4 py-4"><div className="flex flex-wrap gap-1.5">{item.tags?.map(tag => { const tagTheme = TAG_TYPE_THEMES[tag.type]; return (<span key={tag.text} className={`whitespace-nowrap ${tagTheme.bg} ${tagTheme.text} ${tagTheme.border} text-xs font-medium px-2.5 py-1 rounded-full border`}>{tag.text}</span>) })}</div></td>
                    <td className="px-4 py-4 text-[var(--text-primary)]"><EditableCell item={item} field="vehicleInfo" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('vehicleInfo')} /></td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--text-secondary)] font-mono"><div className="flex items-center justify-between gap-2"><EditableCell item={item} field="registration" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={false} /><CopyButton text={item.registration} onCopy={onCopy} title="Registration" themeColor={theme.text} /></div></td>
                    <td className="whitespace-nowrap px-4 py-4 text-center">
                        {item.cyrusConfirmation === 'NO' ? (
                            <div className="relative group inline-block font-bold text-red-400">
                            <EditableCell item={item} field="cyrusConfirmation" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('cyrusConfirmation')} />
                            <button 
                                onClick={(e) => { e.stopPropagation(); window.open('https://www.google.com', '_blank', 'noopener,noreferrer'); }}
                                className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-lg z-10 whitespace-nowrap"
                                title="Go to Cyrus to confirm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                                Go to Cyrus
                            </button>
                            </div>
                        ) : (
                            <div className="font-bold text-green-400">
                            <EditableCell item={item} field="cyrusConfirmation" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('cyrusConfirmation')} />
                            </div>
                        )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--text-tertiary)]"><div>{item.lastModifiedBy}</div><div className="text-xs">{new Date(item.lastModifiedAt).toLocaleString()}</div></td>
                    <td className={`whitespace-nowrap px-4 py-4 font-bold text-center ${item.workshopStatus === 'RESERVED' ? 'text-green-400' : 'text-[var(--text-tertiary)]'}`}>
                      <EditableCell item={item} field="workshopStatus" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('workshopStatus')} placeholder="-" />
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-center justify-center space-x-4">
                        {item.lockedBy ? (
                          <div className="flex items-center gap-2 text-amber-400 h-20" title={`Locked by ${item.lockedBy}`}>
                            <LockClosedIcon className="w-5 h-5" />
                            <span className="text-xs font-semibold">{item.lockedBy === currentUser.name ? 'You' : item.lockedBy.split(' ')[0]}</span>
                          </div>
                        ) : (
                          <>
                            {activeSector === 'HIREFLEET' ? (
                                item.workshopStatus === 'RESERVED' ? (
                                    <ActionButton
                                        onClick={() => onComplete(item)}
                                        title="Complete Demand"
                                        icon={<CheckCircleIcon className="w-8 h-8" />}
                                        label="Complete"
                                        className="text-cyan-300 hover:bg-cyan-500/10"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-24 h-20 text-center text-xs text-[var(--text-tertiary)] p-2">
                                        Awaiting Workshop
                                    </div>
                                )
                            ) : (
                              SECTOR_FLOW[activeSector] && (
                                <ActionButton
                                  onClick={() => onHandover(item)}
                                  title={`Handover to ${SECTOR_FLOW[activeSector]}`}
                                  icon={<ArrowRightIcon className="w-8 h-8" />}
                                  label={SECTOR_FLOW[activeSector]!}
                                  className="text-green-300 hover:bg-green-500/10"
                                />
                              )
                            )}
                            <div className="flex flex-col space-y-3">
                               <button onClick={() => onViewHistory(item.id)} className="text-[var(--text-secondary)] hover:text-purple-400 transition-colors" title="View edit history"><ClockIcon className="w-5 h-5"/></button>
                               <button onClick={() => onEdit(item.id)} className="text-[var(--text-secondary)] hover:text-blue-400 transition-colors" title="Work in this (Lock & Edit)"><PencilIcon className="w-5 h-5"/></button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};