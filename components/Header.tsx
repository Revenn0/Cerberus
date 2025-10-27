
import React from 'react';
import type { NotificationItem, User } from '../types';
import { NotificationPanel } from './NotificationPanel';
import { getInitials, getColorForUser } from '../utils';


interface HeaderProps {
    theme: Record<string, string>;
    notifications: NotificationItem[];
    unreadMentions: number;
    isNotificationPanelOpen: boolean;
    onToggleNotificationPanel: () => void;
    onMarkNotificationsAsRead: () => void;
    onlineUsers: User[];
}

const UserAvatar: React.FC<{ user: User }> = ({ user }) => (
    <div
        title={user.name}
        className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-[var(--background-primary-translucent)] ${getColorForUser(user.name)}`}
    >
        {getInitials(user.name)}
    </div>
);


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

const BellIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
);

export const Header: React.FC<HeaderProps> = ({ theme, notifications, unreadMentions, isNotificationPanelOpen, onToggleNotificationPanel, onMarkNotificationsAsRead, onlineUsers }) => {
  const unreadSystemNotifications = notifications.filter(n => !n.read).length;
  const totalUnread = unreadSystemNotifications + unreadMentions;

  return (
    <header className="bg-[var(--background-primary-translucent)] backdrop-blur-sm shadow-lg sticky top-0 z-20 border-b border-[var(--border-primary-translucent)]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <FourthDimensionIcon className={`h-8 w-8 text-[var(--brand-text)]`} />
            <div className="text-2xl font-bold text-[var(--text-primary)] tracking-wider">
                <span>Cerberus</span>
                <span className="text-[var(--brand-text)] ml-2">4th Dimension</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center -space-x-3">
                {onlineUsers.map(user => <UserAvatar key={user.name} user={user} />)}
            </div>
            
            <div className="relative">
                <button onClick={onToggleNotificationPanel} className="relative text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" aria-label="View notifications">
                    <BellIcon />
                    {totalUnread > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-[var(--background-body)]">
                            {totalUnread}
                        </span>
                    )}
                </button>
                {isNotificationPanelOpen && (
                    <NotificationPanel
                        notifications={notifications}
                        onClose={onMarkNotificationsAsRead} 
                    />
                )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};