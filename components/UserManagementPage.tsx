
import React, { useState } from 'react';
import type { User, Sector } from '../types';
import { getDisplayRole } from '../utils';

interface UserManagementPageProps {
    users: User[];
    onCreateUser: (user: Omit<User, 'password'|'id'|'theme'>, password: string) => boolean;
}

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className="bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md w-full px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)]" />
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, ...props }) => (
  <select {...props} className="bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md w-full px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)]">{children}</select>
);

export const UserManagementPage: React.FC<UserManagementPageProps> = ({ users, onCreateUser }) => {
    const [formState, setFormState] = useState({
        name: '', email: '', password: '', 
        role: 'user' as User['role'], 
        sector: 'LOGISTICS' as Sector, 
        phone: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { password, ...newUser } = formState;
        const success = onCreateUser(newUser, password);
        if (success) {
            setFormState({ name: '', email: '', password: '', role: 'user', sector: 'LOGISTICS', phone: '' });
        }
    };
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 text-[var(--text-primary)] flex-1">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">User Management</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <div className="bg-[var(--background-primary-translucent)] backdrop-blur-sm border border-[var(--border-primary-translucent)] shadow-2xl rounded-xl overflow-hidden">
                        <h2 className="text-xl font-bold text-[var(--brand-text)] p-6 border-b border-[var(--border-primary)]">All Users</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-black/20">
                                    <tr>
                                        {['Name', 'Email', 'Role', 'Sector'].map(h => 
                                            <th key={h} className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">{h}</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-primary-translucent)] bg-[var(--background-primary-translucent)]">
                                    {users.map(user => (
                                        <tr key={user.email}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-[var(--text-primary)]">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[var(--text-secondary)]">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[var(--text-secondary)]">{getDisplayRole(user)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[var(--text-secondary)] capitalize">{user.sector.toLowerCase()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="bg-[var(--background-primary-translucent)] backdrop-blur-sm border border-[var(--border-primary-translucent)] shadow-2xl rounded-xl p-6">
                    <h2 className="text-xl font-bold text-teal-300 mb-6">Create New User</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Full Name</label>
                            <FormInput name="name" value={formState.name} onChange={handleInputChange} required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email</label>
                            <FormInput type="email" name="email" value={formState.email} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Password</label>
                            <FormInput type="password" name="password" value={formState.password} onChange={handleInputChange} required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Role</label>
                            <FormSelect name="role" value={formState.role} onChange={handleInputChange}>
                                <option value="user">User</option>
                                <option value="supervisor">Supervisor</option>
                                <option value="admin">Admin</option>
                            </FormSelect>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Sector</label>
                            <FormSelect name="sector" value={formState.sector} onChange={handleInputChange}>
                                <option value="LOGISTICS">Logistics</option>
                                <option value="WORKSHOP">Workshop</option>
                                <option value="HIREFLEET">Hirefleet</option>
                            </FormSelect>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Phone (Optional)</label>
                            <FormInput name="phone" value={formState.phone} onChange={handleInputChange} />
                        </div>
                        <button type="submit" className="w-full mt-2 px-5 py-2.5 rounded-md bg-teal-600 text-white font-semibold hover:opacity-90 transition-opacity">
                            Create User
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
