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
  onAssignUser: (demandId: number, userId: number | null) => void;
}

const tableHeaders = [
  { title: 'Client', id: 'clientName', className: 'w-48' },
  { title: 'Proclaim ID', id: 'proclaim', className: 'w-32' },
  { title: 'Postcode', id: 'postcode', className: 'w-24' },
  { title: 'Model', id: 'model', className: 'w-40' },
  { title: 'Category', id: 'category', className: 'w-24' },
  { title: 'Contract', id: 'contract', className: 'w-24' },
  { title: 'Status', id: 'status', className: 'w-32 text-center' },
  { title: 'Helmet', id: 'helmet', className: 'w-24' },
  { title: 'Licence', id: 'licenceType', className: 'w-24' },
  { title: 'Routed', id: 'routedDate', className: 'w-24' },
  { title: 'Confirmed', id: 'confirmedDate', className: 'w-24' },
  { title: 'Swap', id: 'swap', className: 'w-20' },
  { title: 'Tags', id: 'tags', className: 'w-48' },
  { title: 'Vehicle Info', id: 'vehicleInfo', className: 'w-48' },
  { title: 'Reg', id: 'registration', className: 'w-32' },
  { title: 'Cyrus', id: 'cyrusConfirmation', className: 'w-24 text-center' },
  { title: 'Modified', id: 'lastModifiedAt', className: 'w-32' },
  { title: 'Workshop', id: 'workshopStatus', className: 'w-32 text-center' },
  { title: 'Actions', id: 'actions', className: 'w-24 text-center' },
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
const ChevronDownIcon = ({ className = 'w-4 h-4' }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>;
const LockClosedIcon = ({ className = 'w-4 h-4' }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" /></svg>;
const ArrowRightIcon = ({ className = 'w-4 h-4' }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M2 10a.75.75 0 0 1 .75-.75h12.59l-2.1-1.95a.75.75 0 1 1 1.02-1.1l3.5 3.25a.75.75 0 0 1 0 1.1l-3.5 3.25a.75.75 0 1 1-1.02-1.1l2.1-1.95H2.75A.75.75 0 0 1 2 10Z" clipRule="evenodd" /></svg>;
const ClockIcon = ({ className = 'w-4 h-4' }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const CheckCircleIcon = ({ className = 'w-4 h-4' }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>;

const CopyButton: React.FC<{ text: string; onCopy: (msg: string) => void; title: string; themeColor: string }> = ({ text, onCopy, title, themeColor }) => {
    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text).then(() => onCopy(`Copied: ${title}`)).catch(err => console.error("Copy failed", err));
    };
    return <button onClick={handleCopy} className={`ml-2 text-[var(--text-tertiary)] hover:text-[var(--brand-text)] transition-colors opacity-0 group-hover:opacity-100`} title={`Copy ${title}`}><ClipboardIcon /></button>;
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
    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-colors text-xs font-medium border border-transparent hover:bg-gray-50 ${className}`}
  >
    {icon}
    <span>{label}</span>
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

  const handleDragStart = (e: React.DragEvent, item: DemandEntry) => {
    // Set transparent image for cleaner drag UI
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
    
    onRowDragStart(e, item);
  };

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="min-w-full divide-y divide-[var(--border-primary)] text-sm border-collapse">
        <thead className="bg-[var(--background-secondary)] sticky top-0 z-[1]">
          <tr>
            {tableHeaders.map(header => <th key={header.id} scope="col" className={`px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ${header.className || ''}`}>{header.title}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-primary)] bg-[var(--background-primary)]">
          {data.length === 0 ? (
            <tr><td colSpan={tableHeaders.length} className="text-center py-16 text-[var(--text-tertiary)] bg-[var(--background-secondary)]">No active demands in this sector.</td></tr>
          ) : data.map(item => {
            const showGroup = item.group && item.group !== lastGroup;
            if (item.group) lastGroup = item.group;
            const isCollapsed = item.group ? collapsedGroups[item.group] : false;

            return (
              <React.Fragment key={item.id}>
                {showGroup && (
                  <tr className="bg-[var(--background-tertiary)] border-y border-[var(--border-primary)] cursor-pointer hover:bg-slate-300 transition-colors" onClick={() => onToggleGroup(item.group!)}>
                    <td colSpan={tableHeaders.length} className="px-4 py-2 text-sm font-bold text-[var(--text-primary)]">
                       <div className="flex items-center gap-2">
                          <ChevronDownIcon className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />
                          <span>{item.group}</span>
                       </div>
                    </td>
                  </tr>
                )}
                {!isCollapsed && (
                  <tr 
                    draggable="true" 
                    onDragStart={(e) => handleDragStart(e, item)} 
                    data-demand-id={item.id} 
                    className={`group transition-colors duration-150 ease-in-out ${item.lockedBy ? 'bg-amber-50' : 'hover:bg-[var(--background-hover)]'} ${highlightedDemandId === item.id ? 'bg-yellow-100' : ''}`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-[var(--text-primary)]"><EditableCell item={item} field="clientName" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('clientName')} /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--text-secondary)] font-mono text-xs"><div className="flex items-center"><EditableCell item={item} field="proclaim" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('proclaim')} /><CopyButton text={item.proclaim} onCopy={onCopy} title="Proclaim ID" themeColor={theme.text} /></div></td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--text-secondary)]"><EditableCell item={item} field="postcode" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('postcode')} transform='uppercase' /></td>
                    <td className="px-4 py-3 text-[var(--text-primary)]"><EditableCell item={item} field="model" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={false} /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--text-secondary)]"><EditableCell item={item} field="category" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('category')} /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--text-secondary)]"><EditableCell item={item} field="contract" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('contract')} /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-center"><StatusPill status={item.status} /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--text-secondary)]"><EditableCell item={item} field="helmet" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('helmet')} placeholder="—" /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--text-secondary)]">{item.licenceType}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--status-warning-text)]"><EditableCell item={item} field="routedDate" type="date" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('routedDate')} placeholder="—" /></td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-[var(--status-success-text)]"><EditableCell item={item} field="confirmedDate" type="date" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('confirmedDate')} placeholder="—" /></td>
                    <td className={`whitespace-nowrap px-4 py-3 font-bold text-xs ${item.swap === 'YES' ? 'text-amber-600' : 'text-slate-400'}`}><EditableCell item={item} field="swap" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('swap')} /></td>
                    <td className="px-4 py-3"><div className="flex flex-wrap gap-1.5">{item.tags?.map(tag => { const tagTheme = TAG_TYPE_THEMES[tag.type]; return (<span key={tag.text} className={`whitespace-nowrap ${tagTheme.bg} ${tagTheme.text} border ${tagTheme.border} text-[10px] font-semibold px-2 py-0.5 rounded`}>{tag.text}</span>) })}</div></td>
                    <td className="px-4 py-3 text-[var(--text-primary)] text-xs"><EditableCell item={item} field="vehicleInfo" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('vehicleInfo')} /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--text-primary)] font-mono text-xs"><div className="flex items-center"><EditableCell item={item} field="registration" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={false} /><CopyButton text={item.registration} onCopy={onCopy} title="Registration" themeColor={theme.text} /></div></td>
                    <td className="whitespace-nowrap px-4 py-3 text-center">
                        {item.cyrusConfirmation === 'NO' ? (
                            <div className="relative group inline-block font-bold text-red-600">
                            <EditableCell item={item} field="cyrusConfirmation" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('cyrusConfirmation')} />
                            <button 
                                onClick={(e) => { e.stopPropagation(); window.open('https://www.google.com', '_blank', 'noopener,noreferrer'); }}
                                className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 flex items-center gap-1 px-2 py-1 rounded shadow-md text-xs font-semibold text-white bg-red-600 hover:bg-red-700 z-10 whitespace-nowrap"
                                title="Go to Cyrus to confirm"
                            >
                                Open Cyrus
                            </button>
                            </div>
                        ) : (
                            <div className="font-bold text-green-600">
                            <EditableCell item={item} field="cyrusConfirmation" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('cyrusConfirmation')} />
                            </div>
                        )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--text-tertiary)] text-xs">
                        <div className="font-medium text-[var(--text-secondary)] truncate w-20">{item.lastModifiedBy}</div>
                        <div>{new Date(item.lastModifiedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className={`whitespace-nowrap px-4 py-3 font-bold text-center text-xs ${item.workshopStatus === 'RESERVED' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <EditableCell item={item} field="workshopStatus" onSave={onUpdateCell} editingCell={editingCell} setEditingCell={setEditingCell} isEditable={isCellEditable('workshopStatus')} placeholder="-" />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {item.lockedBy ? (
                          <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200" title={`Locked by ${item.lockedBy}`}>
                            <LockClosedIcon className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{item.lockedBy === currentUser.name ? 'You' : item.lockedBy.split(' ')[0]}</span>
                          </div>
                        ) : (
                          <>
                            {activeSector === 'HIREFLEET' ? (
                                item.workshopStatus === 'RESERVED' ? (
                                    <ActionButton
                                        onClick={() => onComplete(item)}
                                        title="Complete Demand"
                                        icon={<CheckCircleIcon className="w-4 h-4" />}
                                        label="Done"
                                        className="text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200"
                                    />
                                ) : (
                                    <span className="text-[10px] text-slate-400 italic">Wait</span>
                                )
                            ) : (
                              SECTOR_FLOW[activeSector] && (
                                <ActionButton
                                  onClick={() => onHandover(item)}
                                  title={`Handover to ${SECTOR_FLOW[activeSector]}`}
                                  icon={<ArrowRightIcon className="w-4 h-4" />}
                                  label="Send"
                                  className="text-[var(--brand-text)] hover:bg-blue-50 hover:border-blue-200"
                                />
                              )
                            )}
                             <button onClick={() => onEdit(item.id)} className="p-1.5 text-slate-400 hover:text-[var(--brand-text)] rounded hover:bg-slate-100" title="Edit"><PencilIcon /></button>
                             <button onClick={() => onViewHistory(item.id)} className="p-1.5 text-slate-400 hover:text-purple-600 rounded hover:bg-slate-100" title="History"><ClockIcon /></button>
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