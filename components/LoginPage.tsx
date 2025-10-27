
import React, { useState } from 'react';
import type { User } from '../types';

interface LoginPageProps {
    onLogin: (user: User) => void;
    users: User[];
}

const FourthDimensionIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <rect x="2" y="2" width="8" height="8" rx="1" />
        <rect x="14" y="14" width="8" height="8" rx="1" />
        <line x1="2" y1="2" x2="14" y2="14" />
        <line x1="10" y1="2" x2="22" y2="14" />
        <line x1="2" y1="10" x2="14" y2="22" />
        <line x1="10" y1="10" x2="22" y2="22" />
    </svg>
);


export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, users }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (user && user.password === password) {
            onLogin(user);
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-[var(--background-primary)] rounded-2xl shadow-2xl border border-[var(--border-primary)]">
            <div className="text-center">
                 <div className="flex items-center justify-center space-x-3 mb-4">
                    <FourthDimensionIcon className={`h-10 w-10 text-[var(--brand-text)]`} />
                    <div className="text-3xl font-bold text-[var(--text-primary)] tracking-wider">
                         <span>Cerberus</span>
                         <span className="text-[var(--brand-text)] ml-2">4th Dimension</span>
                    </div>
                </div>
                <p className="mt-2 text-[var(--text-secondary)]">Sign in to access the demand planner</p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-3 border border-[var(--border-secondary)] bg-[var(--background-tertiary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-[var(--brand-ring)] focus:border-[var(--brand-text)] focus:z-10 sm:text-sm rounded-t-md"
                            placeholder="Email address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password"className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-3 border border-[var(--border-secondary)] bg-[var(--background-tertiary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-[var(--brand-ring)] focus:border-[var(--brand-text)] focus:z-10 sm:text-sm rounded-b-md"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <div>
                    <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--brand-bg)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500">
                        Sign in
                    </button>
                </div>
            </form>
        </div>
    );
};