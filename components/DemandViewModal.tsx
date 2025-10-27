
import React from 'react';
import type { DemandEntry } from '../types';
import { SECTOR_THEMES, TAG_TYPE_THEMES } from '../constants';
import { StatusPill } from './StatusPill';

interface DemandViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  demand?: DemandEntry;
}

const DetailItem: React.FC<{ label: string; value?: string | React.ReactNode; fullWidth?: boolean }> = ({ label, value, fullWidth = false }) => (
    <div className={fullWidth ? 'col-span-2' : ''}>
        <h4 className="text-sm font-semibold text-[var(--text-tertiary)]">{label}</h4>
        <p className="text-[var(--text-primary)] mt-1">{value || '—'}</p>
    </div>
);

export const DemandViewModal: React.FC<DemandViewModalProps> = ({ isOpen, onClose, demand }) => {
    if (!isOpen || !demand) return null;
    
    const theme = SECTOR_THEMES[demand.currentSector];

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[var(--background-primary)] p-8 rounded-xl shadow-2xl w-full max-w-3xl border border-[var(--border-primary)] m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className={`text-2xl font-bold ${theme.text}`}>Demand Details: #{demand.proclaim}</h2>
                        <p className="text-[var(--text-secondary)]">Read-only view for {demand.clientName}</p>
                    </div>
                    <button onClick={onClose} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] text-3xl leading-none">&times;</button>
                </div>
                <div className="mt-6 border-t border-[var(--border-primary)] pt-6 max-h-[60vh] overflow-y-auto pr-4 -mr-4">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <DetailItem label="Client" value={demand.clientName} />
                        <DetailItem label="Proclaim ID" value={demand.proclaim} />
                        <DetailItem label="Postcode" value={demand.postcode} />
                        <DetailItem label="Model" value={demand.model} />
                        <DetailItem label="Registration" value={demand.registration} />
                        <DetailItem label="Contract" value={demand.contract} />
                        <DetailItem label="Licence" value={demand.licenceType} />
                        <DetailItem label="Swap" value={demand.swap} />
                        <DetailItem label="Routed Date" value={demand.routedDate} />
                        <DetailItem label="Confirmed Date" value={demand.confirmedDate} />
                        <DetailItem label="Status" value={<StatusPill status={demand.status} />} />
                        <DetailItem label="Sector" value={<span className={`font-bold ${theme.text}`}>{demand.currentSector}</span>} />
                        <DetailItem label="Vehicle Info" value={demand.vehicleInfo} fullWidth={true} />
                        {demand.tags && demand.tags.length > 0 && (
                             <DetailItem label="Tags" fullWidth={true} value={
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {demand.tags.map(tag => {
                                        const tagTheme = TAG_TYPE_THEMES[tag.type];
                                        return (<span key={tag.text} className={`whitespace-nowrap ${tagTheme.bg} ${tagTheme.text} ${tagTheme.border} text-xs font-medium px-2.5 py-1 rounded-full border`}>{tag.text}</span>)
                                    })}
                                </div>
                             } />
                        )}
                    </div>
                </div>
                 <div className="flex justify-end mt-8">
                    <button type="button" onClick={onClose} className={`px-5 py-2.5 rounded-md ${theme.bg} text-white font-semibold hover:opacity-90 transition-opacity`}>Close</button>
                </div>
            </div>
        </div>
    );
};
