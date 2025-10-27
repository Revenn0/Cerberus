
import React from 'react';
import type { NotificationItem } from '../types';

interface NotificationPanelProps {
  notifications: NotificationItem[];
  onClose: () => void; // Will mark as read and close
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClose }) => {
  return (
    <div className="absolute top-full right-0 mt-3 w-80 bg-[var(--background-primary)] border border-[var(--border-primary)] rounded-lg shadow-2xl z-30">
      <div className="p-4 border-b border-[var(--border-primary)] flex justify-between items-center">
        <h3 className="font-semibold text-[var(--text-primary)]">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <p className="text-[var(--text-secondary)] text-center py-8 px-4">You have no new notifications.</p>
        ) : (
          <ul>
            {notifications.map(notification => (
              <li key={notification.id} className={`border-b border-[var(--border-primary-translucent)] px-4 py-3 ${!notification.read ? 'bg-blue-900/20' : ''}`}>
                <p className="text-sm text-[var(--text-primary)]">{notification.message}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">{notification.timestamp}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      {notifications.some(n => !n.read) && (
        <div className="p-2 bg-black/20 border-t border-[var(--border-primary)]">
            <button onClick={onClose} className="w-full text-center text-sm font-medium text-[var(--brand-text)] hover:opacity-80 py-1.5 rounded transition-colors">
            Mark all as read
            </button>
        </div>
      )}
    </div>
  );
};