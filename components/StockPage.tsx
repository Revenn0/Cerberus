import React, { useMemo, useState } from 'react';
import type { Vehicle, VehicleStatus, User } from '../types';

const statusStyles: Record<VehicleStatus, string> = {
    available: 'bg-green-500 text-white',
    on_hire: 'bg-teal-500 text-white',
    in_workshop: 'bg-amber-500 text-white',
    stolen: 'bg-red-500 text-white',
    with_driver: 'bg-blue-500 text-white',
};

const ALL_STATUSES: VehicleStatus[] = ['available', 'on_hire', 'in_workshop', 'stolen', 'with_driver'];

const StatusSelect: React.FC<{ status: VehicleStatus, onChange: (newStatus: VehicleStatus) => void }> = ({ status, onChange }) => {
    return (
        <div className="relative w-full">
            <select
                value={status}
                onChange={(e) => onChange(e.target.value as VehicleStatus)}
                className={`w-full appearance-none rounded-full px-3 py-1.5 text-sm font-bold text-center capitalize focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background-primary)] focus:ring-white/50 ${statusStyles[status]}`}
            >
                {ALL_STATUSES.map(s => (
                    <option key={s} value={s} className="bg-[var(--background-primary)] text-[var(--text-primary)] capitalize font-medium">
                        {s.replace(/_/g, ' ')}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 6.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    );
};

interface StockPageProps {
    vehicleStock: Vehicle[];
    onAddVehicle: (newVehicle: Omit<Vehicle, 'id' | 'status'>) => void;
    onRemoveVehicle: (vehicleId: number) => void;
    onUpdateStatus: (vehicleId: number, status: VehicleStatus) => void;
    currentUser: User;
}

export const StockPage: React.FC<StockPageProps> = ({ vehicleStock, onAddVehicle, onRemoveVehicle, onUpdateStatus, currentUser }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [newVehicle, setNewVehicle] = useState({ model: '', registration: '' });

    const modelSummary = useMemo(() => {
        const counts: Record<string, number> = {};
        vehicleStock.forEach(vehicle => {
            counts[vehicle.model] = (counts[vehicle.model] || 0) + 1;
        });
        return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
    }, [vehicleStock]);
    
    const filteredVehicles = useMemo(() => {
        if (!searchQuery.trim()) return vehicleStock;
        const lowercasedQuery = searchQuery.toLowerCase();
        return vehicleStock.filter(vehicle => 
            vehicle.model.toLowerCase().includes(lowercasedQuery) ||
            vehicle.registration.toLowerCase().includes(lowercasedQuery)
        );
    }, [searchQuery, vehicleStock]);

    const handleAddVehicleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newVehicle.model && newVehicle.registration) {
            onAddVehicle(newVehicle);
            setNewVehicle({ model: '', registration: '' });
        }
    };
    
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Vehicle Stock</h1>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="w-5 h-5 text-[var(--text-secondary)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.358 3.358a1 1 0 0 1-1.414 1.414l-3.358-3.358A7 7 0 0 1 2 9Z" clipRule="evenodd" /></svg>
                    </span>
                    <input type="text" placeholder="Search by model or reg..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-64 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md py-2 pl-10 pr-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)]" />
                </div>
            </div>
            
            <div className="mb-8 bg-[var(--background-primary-translucent)] backdrop-blur-sm border border-[var(--border-primary-translucent)] shadow-2xl rounded-xl p-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Stock by Model</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {modelSummary.map(([model, count]) => (
                        <div key={model} className="bg-[var(--background-secondary-translucent)] p-4 rounded-lg text-center">
                            <p className="text-2xl font-bold text-[var(--text-primary)]">{count}</p>
                            <p className="text-sm text-[var(--text-secondary)] truncate">{model}</p>
                        </div>
                    ))}
                </div>
            </div>

            {currentUser.role === 'admin' && (
                <div className="mb-8 bg-[var(--background-primary-translucent)] backdrop-blur-sm border border-[var(--border-primary-translucent)] shadow-2xl rounded-xl p-6">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Add New Vehicle</h2>
                    <form onSubmit={handleAddVehicleSubmit} className="flex flex-wrap items-end gap-4">
                        <div className="flex-grow"><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Model</label><input type="text" value={newVehicle.model} onChange={e => setNewVehicle(p => ({...p, model: e.target.value}))} placeholder="e.g. PCX 125" className="w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md py-2 px-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)]" required /></div>
                        <div className="flex-grow"><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Registration</label><input type="text" value={newVehicle.registration} onChange={e => setNewVehicle(p => ({...p, registration: e.target.value.toUpperCase()}))} placeholder="e.g. AB12 CDE" className="w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md py-2 px-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)]" required /></div>
                        <button type="submit" className="px-5 py-2 rounded-lg font-semibold text-white bg-[var(--brand-bg)] hover:opacity-90 transition-all">Add Vehicle</button>
                    </form>
                </div>
            )}

            <div className="bg-[var(--background-primary-translucent)] backdrop-blur-sm border border-[var(--border-primary-translucent)] shadow-2xl rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[var(--border-primary)] text-sm">
                        <thead className="bg-black/20">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Registration</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Model</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider w-48">Status</th>
                                {currentUser.role === 'admin' && <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-primary-translucent)] bg-[var(--background-primary-translucent)]">
                            {filteredVehicles.length > 0 ? (
                                filteredVehicles.map(vehicle => (
                                    <tr key={vehicle.id} className="hover:bg-[var(--background-hover)]">
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-[var(--text-primary)]">{vehicle.registration}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[var(--text-primary)]">{vehicle.model}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusSelect status={vehicle.status} onChange={(newStatus) => onUpdateStatus(vehicle.id, newStatus)} />
                                        </td>
                                        {currentUser.role === 'admin' && (
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button onClick={() => onRemoveVehicle(vehicle.id)} className="text-red-400 hover:text-red-300 font-semibold">Remove</button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={currentUser.role === 'admin' ? 4 : 3} className="text-center py-16 text-[var(--text-secondary)]">No vehicles found for "{searchQuery}".</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};