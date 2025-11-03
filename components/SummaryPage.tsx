
import React, { useMemo } from 'react';
import { InventorySummary } from './InventorySummary';
import { SECTOR_THEMES } from '../constants';
import type { DemandEntry, Vehicle, VehicleStatus } from '../types';

const ArrowTrendingUpIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>;
const CheckBadgeIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.4-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.4-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.4 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.4.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>;
const WrenchScrewdriverIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.495-2.495a1.125 1.125 0 0 1 1.591 0l3.001 3.001a1.125 1.125 0 0 1 0 1.591l-2.495 2.495M11.42 15.17 8.613 12.363m2.807 2.807L8.614 12.363m2.807 2.807L15.17 11.42M8.614 12.363 6.364 10.113a1.125 1.125 0 0 1 0-1.591l3.001-3.001a1.125 1.125 0 0 1 1.591 0l2.25 2.25 M8.614 12.363 11.42 9.557" /></svg>;
const UserIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const ShieldExclamationIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>;

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
        { status: 'on_hire', label: 'On Hire', color: 'text-teal-400', icon: <ArrowTrendingUpIcon className="h-6 w-6" /> },
        { status: 'available', label: 'Available', color: 'text-green-400', icon: <CheckBadgeIcon className="h-6 w-6" /> },
        { status: 'in_workshop', label: 'In Workshop', color: 'text-amber-400', icon: <WrenchScrewdriverIcon className="h-6 w-6" /> },
        { status: 'with_driver', label: 'With Driver', color: 'text-blue-400', icon: <UserIcon className="h-6 w-6" /> },
        { status: 'stolen', label: 'Stolen', color: 'text-red-400', icon: <ShieldExclamationIcon className="h-6 w-6" /> },
    ];
    
    return (
        <div className="bg-[var(--background-primary-translucent)] backdrop-blur-sm border border-[var(--border-primary-translucent)] shadow-2xl rounded-xl p-6">
             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Vehicle Fleet Status</h2>
                    <p className="text-[var(--text-secondary)] mt-1">An overview of all {summary.total} vehicles in the fleet.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {summaryCards.map(card => (
                    <div key={card.status} className={`p-6 rounded-xl bg-[var(--background-primary)] border border-[var(--border-secondary)]`}>
                        <div className="flex items-center justify-between">
                            <h3 className={`font-semibold ${card.color}`}>{card.label}</h3>
                            <div className={card.color}>{card.icon}</div>
                        </div>
                        <p className="text-3xl font-bold text-[var(--text-primary)] mt-4">{summary[card.status]}</p>
                    </div>
                ))}
            </div>

            <div className="bg-[var(--background-primary)] p-6 rounded-xl border border-[var(--border-secondary)]">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Fleet Distribution Chart</h3>
                <div className="space-y-4">
                    {summaryCards.map(card => {
                        const percentage = summary.total > 0 ? (summary[card.status] / summary.total) * 100 : 0;
                        const colorMap: Record<string, string> = {
                            'text-teal-400': 'bg-teal-500',
                            'text-green-400': 'bg-green-500',
                            'text-amber-400': 'bg-amber-500',
                            'text-blue-400': 'bg-blue-500',
                            'text-red-400': 'bg-red-500',
                        };

                        return (
                            <div key={card.status}>
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className={`font-medium ${card.color}`}>{card.label}</span>
                                    <span className="text-[var(--text-secondary)] font-mono">{summary[card.status]} / {summary.total}</span>
                                </div>
                                <div className="w-full bg-[var(--background-tertiary)] rounded-full h-2.5">
                                    <div className={`${colorMap[card.color]} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
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
