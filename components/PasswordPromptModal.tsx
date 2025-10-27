
import React, { useState } from 'react';

interface PasswordPromptModalProps {
  onSuccess: () => void;
  onClose: () => void;
  theme: Record<string, string>;
}

export const PasswordPromptModal: React.FC<PasswordPromptModalProps> = ({ onSuccess, onClose, theme }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[var(--background-primary)] p-8 rounded-lg shadow-2xl w-full max-w-sm border border-[var(--border-primary)]" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Supervisor Access Required</h2>
        <p className="text-[var(--text-secondary)] mb-6">Enter the supervisor password to view this sector.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)]`}
            placeholder="Password"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-[var(--text-primary)] hover:bg-[var(--background-hover)] transition-colors">Cancel</button>
            <button type="submit" className={`px-4 py-2 rounded-md ${theme.bg} text-white font-semibold hover:opacity-90 transition-opacity`}>Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
};