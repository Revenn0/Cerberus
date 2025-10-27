
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { ChatMessage, User, Sector, DemandEntry } from '../types';
import { getInitials, getColorForUser } from '../utils';
import { SECTOR_THEMES } from '../constants';

const UserAvatar: React.FC<{ user: User, size?: string }> = ({ user, size = 'w-8 h-8' }) => (
    <div
        title={user.name}
        className={`${size} rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-gray-800/80 ${getColorForUser(user.name)} flex-shrink-0`}
    >
        {getInitials(user.name)}
    </div>
);

interface ChatPanelProps {
    sector: Sector;
    theme: Record<string, string>;
    currentUser: User;
    allUsers: User[];
    allChatMessages: Record<Sector | 'ALL', ChatMessage[]>;
    onSendMessage: (message: string, channel: Sector | 'ALL', demandId?: number) => void;
    onDemandHighlight: (demandId: number) => void;
    width: number;
    onResize: (width: number) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = (props) => {
    const { sector, theme, currentUser, allUsers, allChatMessages, onSendMessage, onDemandHighlight, width, onResize } = props;
    const [newMessage, setNewMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatPanelRef = useRef<HTMLElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const [activeChannel, setActiveChannel] = useState<Sector | 'ALL'>(sector);
    const [mentionSuggestions, setMentionSuggestions] = useState<User[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestionIndex, setSuggestionIndex] = useState(-1);
    
    const [linkedDemandId, setLinkedDemandId] = useState<number | null>(null);

    useEffect(() => {
        setActiveChannel(sector);
    }, [sector]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [allChatMessages, activeChannel]);
    
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim(), activeChannel, linkedDemandId);
            setNewMessage('');
            setLinkedDemandId(null);
            setShowSuggestions(false);
        }
    };
    
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => { setIsDragging(false); };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); 
        setIsDragging(false);
        try {
            const demandData = JSON.parse(e.dataTransfer.getData("application/json")) as DemandEntry;
            if (demandData && demandData.id) {
                setNewMessage(`RE: Demand #${demandData.proclaim} for ${demandData.clientName} `);
                setLinkedDemandId(demandData.id);
                inputRef.current?.focus();
            }
        } catch (error) { 
            console.error("Failed to parse dropped data", error); 
        }
    };
    
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsResizing(true);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isResizing && chatPanelRef.current) {
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 320 && newWidth < 800) { // Min and max width
                onResize(newWidth);
            }
        }
    }, [isResizing, onResize]);

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
    }, []);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, handleMouseMove, handleMouseUp]);

    const onlineUsersForSuggestions = useMemo(() => {
        if (activeChannel === 'ALL') {
            return allUsers.filter(user => user.id !== currentUser.id);
        }
        return allUsers.filter(user => 
            (user.role === 'admin' || user.role === 'supervisor' || user.sector === activeChannel) && user.id !== currentUser.id
        );
    }, [activeChannel, allUsers, currentUser.id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewMessage(value);

        const lastWord = value.split(' ').pop();
        if (lastWord && lastWord.startsWith('@')) {
            const query = lastWord.substring(1).toLowerCase();
            const suggestions = onlineUsersForSuggestions.filter(user => 
                user.name.toLowerCase().includes(query)
            );
            setMentionSuggestions(suggestions);
            setShowSuggestions(suggestions.length > 0);
            setSuggestionIndex(0);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleMentionSelect = (user: User) => {
        const mentionUsername = user.name.split(' ')[0];
        const words = newMessage.split(' ');
        words.pop(); // remove partial @mention
        words.push(`@${mentionUsername} `);
        setNewMessage(words.join(' '));
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (showSuggestions && mentionSuggestions.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSuggestionIndex(prev => (prev + 1) % mentionSuggestions.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSuggestionIndex(prev => (prev - 1 + mentionSuggestions.length) % mentionSuggestions.length);
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                handleMentionSelect(mentionSuggestions[suggestionIndex]);
            } else if (e.key === 'Escape') {
                setShowSuggestions(false);
            }
        }
    };

    const renderMessage = (message: string) => {
        return message.split(' ').map((part, index) => {
            if (part.startsWith('@')) {
                const username = part.substring(1).toLowerCase();
                const userExists = allUsers.some(u => u.name.toLowerCase().split(' ')[0] === username);
                 if(userExists) {
                    return <strong key={index} className="text-blue-400 font-semibold">{part} </strong>;
                }
            }
            return part + ' ';
        });
    };
    
    const visibleChannels = useMemo(() => {
        if (currentUser.role === 'admin' || currentUser.role === 'supervisor') {
            return ['ALL', 'LOGISTICS', 'WORKSHOP', 'HIREFLEET'] as const;
        }
        return ['ALL', currentUser.sector] as const;
    }, [currentUser]);

    const onlineUsers = useMemo(() => {
        if (activeChannel === 'ALL') {
            return allUsers;
        }
        return allUsers.filter(u => u.role === 'admin' || u.role === 'supervisor' || u.sector === activeChannel);
    }, [activeChannel, allUsers]);

    const messages = allChatMessages[activeChannel] || [];

    return (
        <aside 
            ref={chatPanelRef}
            style={{ width: `${width}px` }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-[var(--background-primary)] border-l border-[var(--border-primary-translucent)] flex flex-col flex-shrink-0 relative transition-all duration-300 ${isDragging ? `ring-2 ring-[var(--brand-ring)] ring-offset-2 ring-offset-gray-900` : ''}`}
        >
            <div onMouseDown={handleMouseDown} className="absolute left-0 top-0 h-full w-2 cursor-col-resize z-20 group">
              <div className="w-0.5 h-full bg-transparent group-hover:bg-[var(--brand-ring)] transition-colors duration-200"></div>
            </div>
            
            <header className="p-4 border-b border-[var(--border-primary-translucent)] flex-shrink-0">
                <div className="border-b border-[var(--border-primary)] -mx-4 mb-4">
                    <nav className="-mb-px flex space-x-4 px-4" aria-label="Tabs">
                        {visibleChannels.map(channel => {
                            const isActive = activeChannel === channel;
                            const channelTheme = channel === 'ALL' ? theme : SECTOR_THEMES[channel as Sector];
                            return (
                                <button
                                    key={channel}
                                    onClick={() => setActiveChannel(channel)}
                                    className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                        isActive ? `${channelTheme.border} ${channelTheme.text}` : `border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)] ${channelTheme.hoverBorder}`
                                    }`}
                                >
                                    {channel === 'ALL' ? 'General' : channel.charAt(0) + channel.slice(1).toLowerCase()}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                <div className="flex items-center -space-x-2">
                    {onlineUsers.map(user => <UserAvatar key={user.name} user={user} size="w-7 h-7" />)}
                    <div className="pl-3 text-xs text-[var(--text-tertiary)]">
                        {onlineUsers.length} user(s) online
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isDragging && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                        <p className={`text-lg font-semibold ${theme.text}`}>Drop demand here to link</p>
                    </div>
                )}
                {messages.length > 0 ? messages.map(msg => {
                    const isCurrentUser = msg.user.id === currentUser.id;
                    const isMentioned = msg.mentions?.includes(currentUser.id);
                    return (
                        <div key={msg.id} className={`flex items-start gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            {!isCurrentUser && <UserAvatar user={msg.user} />}
                            <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                                <div 
                                    onDoubleClick={msg.demandId ? () => onDemandHighlight(msg.demandId!) : undefined}
                                    className={`px-4 py-2 rounded-xl max-w-xs ${isCurrentUser ? `${theme.bg} text-white` : `bg-[var(--background-secondary)] text-[var(--text-primary)]`} ${msg.demandId ? 'cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-offset-gray-800 ' + theme.ring : ''} ${isMentioned ? 'ring-2 ring-yellow-400' : ''}`}
                                >
                                    <p className="text-sm">{renderMessage(msg.message)}</p>
                                </div>
                                <div className="text-xs text-[var(--text-tertiary)] mt-1 px-1">
                                    {!isCurrentUser && <span className="font-semibold">{msg.user.name.split(' ')[0]}</span>}
                                    {isCurrentUser && 'You'}
                                    , {msg.timestamp}
                                </div>
                            </div>
                            {isCurrentUser && <UserAvatar user={msg.user} />}
                        </div>
                    );
                }) : (
                    <div className="text-center text-sm text-[var(--text-tertiary)] pt-16">No messages in this channel yet.</div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <footer className="relative p-4 border-t border-[var(--border-primary-translucent)] flex-shrink-0 bg-black/20">
                {showSuggestions && (
                    <div className="absolute bottom-full left-4 right-4 bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-lg shadow-lg mb-2 z-10 max-h-48 overflow-y-auto">
                        <ul>
                            {mentionSuggestions.map((user, index) => (
                                <li key={user.id}>
                                    <button 
                                        onClick={() => handleMentionSelect(user)}
                                        className={`w-full text-left flex items-center gap-3 p-3 hover:bg-[var(--background-hover)] ${index === suggestionIndex ? 'bg-[var(--background-hover)]' : ''}`}
                                    >
                                        <UserAvatar user={user} size="w-7 h-7" />
                                        <span className="font-semibold text-[var(--text-primary)]">{user.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <form onSubmit={handleSendMessage}>
                    <div className="flex items-center gap-2">
                        <input ref={inputRef} type="text" value={newMessage} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Type a message or @mention" className={`w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)]`} />
                        <button type="submit" className={`p-2 rounded-lg text-white ${theme.bg} hover:opacity-90 transition-opacity disabled:opacity-50`} disabled={!newMessage.trim()}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.949a.75.75 0 0 0 .95.41l2.472-1.02a.75.75 0 0 1 .952 1.294l-2.888 1.192a.75.75 0 0 0-.41.95l4.949 1.414a.75.75 0 0 0 .95-.826L10.05 3.105a.75.75 0 0 0-1.294-.952L7.56 4.623a.75.75 0 0 0-.41.95l1.02 2.472a.75.75 0 0 1-1.294.952l-1.192-2.888a.75.75 0 0 0-.95-.41Z" /></svg>
                        </button>
                    </div>
                </form>
            </footer>
        </aside>
    );
};