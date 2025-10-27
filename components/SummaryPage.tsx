
import React, { useMemo } from 'react';
import { InventorySummary } from './InventorySummary';
import { SECTOR_THEMES } from '../constants';
import type { DemandEntry, Vehicle, VehicleStatus } from '../types';

const VehicleStatusSummary: React.FC<{ vehicleStock: Vehicle[] }> = ({ vehicleStock }) => {
    const summary = useMemo(() => {
        const counts: Record<VehicleStatus, number> = {
            on_hire: 0,
            available: 0,
            in_workshop: 0,
            stolen: 0,
            with_driver: 0,
        };
        vehicleStock.forEach(vehicle => {
            counts[vehicle.status]++;
        });
        return {
            ...counts,
            total: vehicleStock.length,
        }
    }, [vehicleStock]);

    const summaryCards: { status: VehicleStatus, label: string, color: string, icon: React.ReactNode}[] = [
        { status: 'on_hire', label: 'On Hire', color: 'border-teal-400', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg> },
        { status: 'available', label: 'Available', color: 'border-green-400', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> },
        { status: 'in_workshop', label: 'In Workshop', color: 'border-amber-400', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
        { status: 'with_driver', label: 'With Driver', color: 'border-blue-400', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
        { status: 'stolen', label: 'Stolen', color: 'border-red-400', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> },
    ];
    
    return (
        <div className="bg-[var(--background-primary-translucent)] backdrop-blur-sm border border-[var(--border-primary-translucent)] shadow-2xl rounded-xl p-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Vehicle Fleet Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <div className="bg-[var(--background-secondary-translucent)] p-6 rounded-lg flex items-center justify-between col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-1">
                    <div>
                        <p className="text-[var(--text-secondary)] text-sm font-medium">Total Fleet</p>
                        <p className="text-[var(--text-primary)] text-4xl font-bold">{summary.total}</p>
                    </div>
                </div>
                {summaryCards.map(card => (
                    <div key={card.status} className={`bg-[var(--background-primary)] border-l-4 ${card.color} rounded-r-lg shadow-md p-6 flex items-center justify-between`}>
                        <div>
                            <p className="text-[var(--text-secondary)] font-semibold">{card.label}</p>
                            <p className="text-[var(--text-primary)] text-4xl font-bold">{summary[card.status]}</p>
                        </div>
                        {card.icon}
                    </div>
                ))}
            </div>
        </div>
    )
}

export const SummaryPage: React.FC<{ demandData: DemandEntry[], vehicleStock: Vehicle[] }> = ({ demandData, vehicleStock }) => {
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <VehicleStatusSummary vehicleStock={vehicleStock} />
            <div className="bg-[var(--background-primary-translucent)] backdrop-blur-sm border border-[var(--border-primary-translucent)] shadow-2xl rounded-xl">
                 <InventorySummary data={demandData} theme={SECTOR_THEMES.LOGISTICS} />
            </div>
        </div>
    );
};