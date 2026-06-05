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
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white ring-1 ring-[var(--border-primary)] ${getColorForUser(user.name)}`}
    >
        {getInitials(user.name)}
    </div>
);


const BellIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
);

export const Header: React.FC<HeaderProps> = ({ theme, notifications, unreadMentions, isNotificationPanelOpen, onToggleNotificationPanel, onMarkNotificationsAsRead, onlineUsers }) => {
  const unreadSystemNotifications = notifications.filter(n => !n.read).length;
  const totalUnread = unreadSystemNotifications + unreadMentions;

  return (
    <header className="bg-[var(--background-primary)] shadow-sm sticky top-0 z-20 h-16 flex items-center px-6 border-b border-[var(--border-primary)]">
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center text-[var(--text-secondary)] text-sm font-medium">
             <span className="opacity-70">Application</span>
             <span className="mx-2">/</span>
             <span className="text-[var(--text-primary)]">Dashboard</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center -space-x-2 border-r border-[var(--border-primary)] pr-6 mr-2">
                {onlineUsers.slice(0, 5).map(user => <UserAvatar key={user.name} user={user} />)}
                {onlineUsers.length > 5 && <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500 font-medium">+{onlineUsers.length - 5}</div>}
            </div>
            
            <div className="relative">
                <button onClick={onToggleNotificationPanel} className="relative p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--background-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)]" aria-label="View notifications">
                    <BellIcon />
                    {totalUnread > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white"></span>
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
    </header>
  );
};