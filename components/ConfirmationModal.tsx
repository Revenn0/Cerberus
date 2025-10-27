
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  theme: Record<string, string>;
  confirmText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, theme, confirmText = "Confirm" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[var(--background-primary)] p-8 rounded-lg shadow-2xl w-full max-w-md border border-[var(--border-primary)]" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">{title}</h2>
        <p className="text-[var(--text-secondary)] mb-6">{message}</p>
        <div className="flex justify-end space-x-4 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-[var(--text-primary)] hover:bg-[var(--background-hover)] transition-colors">Cancel</button>
          <button type="button" onClick={onConfirm} className={`px-4 py-2 rounded-md ${theme.bg} text-white font-semibold hover:opacity-90 transition-opacity`}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};