
import React from 'react';
import { ChatMessage } from '../types';
import { getInitials, getColorForUser } from '../utils';

interface MentionPopupProps {
  message: ChatMessage;
  onClose: () => void;
}

export const MentionPopup: React.FC<MentionPopupProps> = ({ message, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const channelName = message.channel === 'ALL' ? 'General' : message.channel.toLowerCase();

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[var(--background-primary)] text-[var(--text-primary)] px-4 py-3 rounded-lg shadow-2xl z-50 animate-fade-in-out border border-[var(--border-primary)] flex items-center gap-4 w-full max-w-md">
       <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${getColorForUser(message.user.name)}`}>
           {getInitials(message.user.name)}
       </div>
       <div>
            <p className="font-bold">{message.user.name} mentioned you in <span className="capitalize text-[var(--brand-text)]">{channelName}</span></p>
            <p className="text-sm text-[var(--text-secondary)] truncate">"{message.message}"</p>
       </div>
       <button onClick={onClose} className="absolute top-2 right-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">&times;</button>
    </div>
  );
};