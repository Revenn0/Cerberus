import React, { useState } from 'react';
import type { User } from '../types';
import { getDisplayRole } from '../utils';

interface ProfilePageProps {
    user: User;
    onUpdate: (message: string) => void;
}

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className="bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md w-full px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)] disabled:opacity-50 disabled:cursor-not-allowed" />
);

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{label}</label>
        {children}
    </div>
);

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate }) => {
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleEmailChange = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(`Email change request for ${newEmail} submitted.`);
        setNewEmail('');
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            onUpdate('New passwords do not match.');
            return;
        }
        onUpdate('Password has been changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 text-[var(--text-primary)] flex-1">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">My Profile</h1>
                
                <div className="bg-[var(--background-primary-translucent)] backdrop-blur-sm border border-[var(--border-primary-translucent)] shadow-2xl rounded-xl p-8 mb-8">
                    <h2 className="text-xl font-bold text-[var(--brand-text)] mb-6">Account Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <FormField label="Full Name">
                            <p className="text-lg text-[var(--text-primary)]">{user.name}</p>
                        </FormField>
                        <FormField label="Role">
                            <p className="text-lg text-[var(--text-primary)]">{getDisplayRole(user)}</p>
                        </FormField>
                         <FormField label="Primary Sector">
                            <p className="text-lg text-[var(--text-primary)] capitalize">{user.sector.toLowerCase()}</p>
                        </FormField>
                        <FormField label="Email Address">
                            <p className="text-lg text-[var(--text-primary)]">{user.email}</p>
                        </FormField>
                        <FormField label="Phone Number">
                            <p className="text-lg text-[var(--text-primary)]">{user.phone || 'Not provided'}</p>
                        </FormField>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-[var(--background-primary-translucent)] backdrop-blur-sm border border-[var(--border-primary-translucent)] shadow-2xl rounded-xl p-8">
                        <h2 className="text-xl font-bold text-amber-300 mb-6">Change Email</h2>
                        <form onSubmit={handleEmailChange} className="space-y-4">
                            <FormField label="New Email Address">
                                <FormInput type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required placeholder="Enter new email" />
                            </FormField>
                            <div>
                                <button type="submit" className="w-full mt-2 px-5 py-2.5 rounded-md bg-amber-600 text-white font-semibold hover:opacity-90 transition-opacity">
                                    Update Email
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="bg-[var(--background-primary-translucent)] backdrop-blur-sm border border-[var(--border-primary-translucent)] shadow-2xl rounded-xl p-8">
                        <h2 className="text-xl font-bold text-teal-300 mb-6">Change Password</h2>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                             <FormField label="Current Password">
                                <FormInput type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required placeholder="Enter current password" />
                            </FormField>
                            <FormField label="New Password">
                                <FormInput type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Enter new password" />
                            </FormField>
                             <FormField label="Confirm New Password">
                                <FormInput type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Confirm new password" />
                            </FormField>
                            <div>
                                <button type="submit" className="w-full mt-2 px-5 py-2.5 rounded-md bg-teal-600 text-white font-semibold hover:opacity-90 transition-opacity">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};