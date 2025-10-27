

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { DemandTable } from './components/DemandTable';
import { MOCK_DEMAND_DATA, SECTOR_THEMES, MOCK_USERS, MOCK_CHAT_MESSAGES, MOCK_VEHICLE_STOCK, MOCK_HOME_PAGE_CONTENT } from './constants';
import type { DemandEntry, Sector, User, CreateDemandFormData, AuditLog, NotificationItem, ChatMessage, Page, ThemeName, Vehicle, VehicleStatus, HomePageContent } from './types';
import { PasswordPromptModal } from './components/PasswordPromptModal';
import { DemandFormModal } from './components/DemandFormModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { AuditHistoryModal } from './components/AuditHistoryModal';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './components/HomePage';
import { SummaryPage } from './components/SummaryPage';
import { StockPage } from './components/StockPage';
import { ChatPanel } from './components/ChatPanel';
import { LoginPage } from './components/LoginPage';
import { ProfilePage } from './components/ProfilePage';
import { HistoryModal } from './components/HistoryModal';
import { UserManagementPage } from './components/UserManagementPage';
import { themes } from './themes';
import { MentionPopup } from './components/MentionPopup';
import { DemandViewModal } from './components/DemandViewModal';


const AppNotification: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 bg-[var(--brand-bg)] text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">
      {message}
    </div>
  );
};

const DEMAND_TABS: Array<Sector> = ['LOGISTICS', 'WORKSHOP', 'HIREFLEET'];

const SECTOR_FLOW: Record<Sector, Sector | null> = {
  LOGISTICS: 'WORKSHOP',
  WORKSHOP: 'HIREFLEET',
  HIREFLEET: null,
};

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [demandData, setDemandData] = useState<DemandEntry[]>(MOCK_DEMAND_DATA);
  const [vehicleStock, setVehicleStock] = useState<Vehicle[]>(MOCK_VEHICLE_STOCK);
  const [appNotification, setAppNotification] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Sector>('LOGISTICS');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [passwordPrompt, setPasswordPrompt] = useState<{ visible: boolean; targetTab: Sector | null }>({ visible: false, targetTab: null });

  const [formModal, setFormModal] = useState<{ isOpen: boolean; mode: 'create' | 'edit'; demand?: DemandEntry }>({ isOpen: false, mode: 'create' });
  const [handoverModal, setHandoverModal] = useState<{ isOpen: boolean; demand?: DemandEntry; targetSector?: Sector }>({ isOpen: false });
  const [completionModal, setCompletionModal] = useState<{ isOpen: boolean; demand?: DemandEntry }>({ isOpen: false });
  const [auditModal, setAuditModal] = useState<{ isOpen: boolean; demandId?: number }>({ isOpen: false });
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [demandViewModal, setDemandViewModal] = useState<{ isOpen: boolean; demand?: DemandEntry }>({ isOpen: false });
  const [currentPage, setCurrentPage] = useState<Page>('LOGIN');
  const [demandSearchQuery, setDemandSearchQuery] = useState('');

  const [auditLog, setAuditLog] = useState<AuditLog[]>([]);
  const [systemNotifications, setSystemNotifications] = useState<NotificationItem[]>([]);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<Record<Sector | 'ALL', ChatMessage[]>>(MOCK_CHAT_MESSAGES);
  const [isChatPanelVisible, setIsChatPanelVisible] = useState(true);
  const [chatPanelWidth, setChatPanelWidth] = useState(384); // 96 * 4

  const [highlightedDemandId, setHighlightedDemandId] = useState<number | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const [currentTheme, setCurrentTheme] = useState<ThemeName>('dark');
  
  const [unreadMentions, setUnreadMentions] = useState(0);
  const [mentionNotification, setMentionNotification] = useState<ChatMessage | null>(null);
  
  const [homePageContent, setHomePageContent] = useState<HomePageContent>(MOCK_HOME_PAGE_CONTENT);


  const currentUser = authenticatedUser;

  useEffect(() => {
    if(currentUser) {
        const userTheme = currentUser.sector.toLowerCase() as ThemeName;
        setActiveTab(currentUser.sector);
        setCurrentPage('HOME');
        setCurrentTheme(userTheme);
    } else {
        setCurrentPage('LOGIN');
        setCurrentTheme('dark');
    }
  }, [currentUser]);

  useEffect(() => {
    const theme = themes[currentTheme] || themes.dark;
    for (const key in theme) {
      document.documentElement.style.setProperty(key, theme[key]);
    }
  }, [currentTheme]);

  const activeThemeStyle = useMemo(() => SECTOR_THEMES[activeTab] || SECTOR_THEMES.LOGISTICS, [activeTab]);
  const themeForHeader = currentPage === 'DEMAND' ? activeThemeStyle : SECTOR_THEMES.LOGISTICS;

  const showAppNotification = useCallback((message: string) => { 
    setAppNotification(message); 
    setSystemNotifications(prev => [
        { id: Date.now(), message, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false },
        ...prev
    ].slice(0, 20));
  }, []);
  
  const addAuditLog = (demand: DemandEntry | CreateDemandFormData, action: string, details: string) => {
    if (!('id' in demand) || !currentUser) return;
    const newLog: AuditLog = {
        id: Date.now(),
        demandId: demand.id,
        demandProclaim: demand.proclaim,
        user: currentUser.name,
        action,
        timestamp: new Date().toISOString(),
        details,
    };
    setAuditLog(prev => [newLog, ...prev]);
  };

  const handleToggleGroup = useCallback((groupName: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  }, []);

  const updateDemandEntry = (updatedEntry: DemandEntry) => {
    setDemandData(prevData => prevData.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry));
  };
  
  const handleLockAndEdit = useCallback((demandId: number) => {
    const entry = demandData.find(d => d.id === demandId);
    if (!entry || entry.lockedBy || !currentUser) return;
    
    const lockedEntry = { ...entry, lockedBy: currentUser.name };
    updateDemandEntry(lockedEntry);
    setFormModal({ isOpen: true, mode: 'edit', demand: lockedEntry });
  }, [demandData, currentUser]);

  const handleSaveDemand = (formData: Partial<DemandEntry>) => {
    if (!currentUser) return;
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (formModal.mode === 'create') {
        const newEntry: DemandEntry = {
            id: Date.now(),
            ...(formData as CreateDemandFormData),
            referenceId: formData.proclaim || '',
            lastModifiedBy: currentUser.name,
            lastModifiedAt: formattedDate,
            currentSector: activeTab,
            workshopStatus: '',
            group: new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: '2-digit'}),
        };
        setDemandData(prev => [newEntry, ...prev]);
        showAppNotification('New demand created successfully.');
        addAuditLog(newEntry, 'Create', `New demand #${newEntry.proclaim} created.`);
    } else if (formModal.mode === 'edit' && formModal.demand) {
        const updatedEntry = {
            ...formModal.demand,
            ...formData,
            lastModifiedBy: currentUser.name,
            lastModifiedAt: formattedDate,
            lockedBy: undefined, 
        };
        updateDemandEntry(updatedEntry);
        showAppNotification(`Demand #${updatedEntry.proclaim} updated.`);
        addAuditLog(updatedEntry, 'Update', `Demand #${updatedEntry.proclaim} was updated.`);
    }
    setFormModal({ isOpen: false, mode: 'create' });
  };
  
  const handleCloseForm = () => {
    if (formModal.mode === 'edit' && formModal.demand && currentUser) {
      const entry = demandData.find(d => d.id === formModal.demand!.id);
      if (entry && entry.lockedBy === currentUser.name) {
        updateDemandEntry({ ...entry, lockedBy: undefined });
      }
    }
    setFormModal({ isOpen: false, mode: 'create' });
  };

  const handleInitiateHandover = useCallback((demand: DemandEntry) => {
    const targetSector = SECTOR_FLOW[demand.currentSector];
    if (targetSector) {
      setHandoverModal({ isOpen: true, demand, targetSector });
    }
  }, []);

  const handleConfirmHandover = () => {
    const { demand, targetSector } = handoverModal;
    if (demand && targetSector && currentUser) {
      const handedOverEntry = {
        ...demand,
        currentSector: targetSector,
        lastModifiedBy: currentUser.name,
        lastModifiedAt: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      };
      updateDemandEntry(handedOverEntry);
      showAppNotification(`Demand #${demand.proclaim} handed over to ${targetSector}.`);
      addAuditLog(handedOverEntry, 'Handover', `Demand passed from ${demand.currentSector} to ${targetSector}.`);
    }
    setHandoverModal({ isOpen: false });
  };

  const handleInitiateCompletion = (demand: DemandEntry) => {
      setCompletionModal({ isOpen: true, demand });
  };

  const handleConfirmCompletion = () => {
      const { demand } = completionModal;
      if (demand && currentUser) {
          const completedEntry = {
              ...demand,
              status: 'COMPLETED' as const,
              isArchived: true,
              completedAt: new Date().toISOString().split('T')[0],
              lastModifiedBy: currentUser.name,
              lastModifiedAt: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          };
          updateDemandEntry(completedEntry);
          
          const vehicleInDemand = vehicleStock.find(v => v.registration === demand.registration);
          if (vehicleInDemand) {
            handleUpdateVehicleStatus(vehicleInDemand.id, 'on_hire');
          }

          showAppNotification(`Demand #${demand.proclaim} completed and moved to history.`);
          addAuditLog(completedEntry, 'Complete', `Demand completed and archived.`);
      }
      setCompletionModal({ isOpen: false });
  };

  const handleTabClick = (tab: Sector) => {
    if (tab === activeTab || !currentUser) return;
    if (currentUser.role === 'admin' || currentUser.role === 'supervisor') {
      if (currentUser.role !== 'admin' && tab !== currentUser.sector) {
         setPasswordPrompt({ visible: true, targetTab: tab });
      } else {
         setActiveTab(tab);
      }
    } else if (tab === currentUser.sector) {
      setActiveTab(tab);
    }
  };

  const handlePasswordSuccess = () => {
    if (passwordPrompt.targetTab) setActiveTab(passwordPrompt.targetTab);
    setPasswordPrompt({ visible: false, targetTab: null });
  };

  const filteredData = useMemo(() => {
    let data = demandData.filter(d => d.currentSector === activeTab && !d.isArchived);
     if (demandSearchQuery.trim() !== '') {
        const lowercasedQuery = demandSearchQuery.toLowerCase();
        data = data.filter(d => 
            d.clientName.toLowerCase().includes(lowercasedQuery) ||
            d.proclaim.toLowerCase().includes(lowercasedQuery) ||
            d.postcode.toLowerCase().includes(lowercasedQuery) ||
            d.model.toLowerCase().includes(lowercasedQuery) ||
            d.registration.toLowerCase().includes(lowercasedQuery) ||
            d.vehicleInfo.toLowerCase().includes(lowercasedQuery) ||
            (d.tags && d.tags.some(tag => tag.text.toLowerCase().includes(lowercasedQuery)))
        );
    }
    return data;
  }, [demandData, activeTab, demandSearchQuery]);

  const handleOpenAuditHistory = useCallback((demandId: number) => {
    setAuditModal({ isOpen: true, demandId });
  }, []);

  const toggleNotificationPanel = () => {
      setIsNotificationPanelOpen(prev => !prev);
      if(!isNotificationPanelOpen) {
        setSystemNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadMentions(0);
      }
  };

  const markSystemNotificationsAsRead = () => {
      setSystemNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setIsNotificationPanelOpen(false);
  };
  
  const handleSendMessage = (message: string, channel: Sector | 'ALL', demandId?: number) => {
    if (!currentUser) return;

    const mentions: number[] = [];
    const usersForMentions = (channel === 'ALL')
      ? users
      : users.filter(u => u.role === 'admin' || u.role === 'supervisor' || u.sector === channel);

    const messageParts = message.split(' ');
    for (const part of messageParts) {
        if (part.startsWith('@')) {
            const username = part.substring(1).toLowerCase();
            const mentionedUser = usersForMentions.find(u => u.name.toLowerCase().split(' ')[0] === username);
             if (mentionedUser) {
                mentions.push(mentionedUser.id);
            }
        }
    }

    const newMessage: ChatMessage = {
        id: Date.now(),
        user: currentUser,
        message: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: channel,
        demandId: demandId,
        mentions: mentions
    };
    
    mentions.forEach(mentionedUserId => {
        if (mentionedUserId === currentUser.id) return;

        const mentionedUser = users.find(u => u.id === mentionedUserId);
        if (mentionedUser) {
           setMentionNotification(newMessage);
           setUnreadMentions(prev => prev + 1);
        }
    });
    
    setChatMessages(prev => {
        const newChannelMessages = [...(prev[channel] || []), newMessage];
        return { ...prev, [channel]: newChannelMessages };
    });
  };

  const handleLogin = (user: User) => {
    setAuthenticatedUser(user);
    showAppNotification(`Welcome back, ${user.name.split(' ')[0]}!`);
  };

  const handleLogout = () => {
      showAppNotification(`You have been logged out.`);
      setAuthenticatedUser(null);
  };

  const handleUpdateDemandCell = (demandId: number, field: keyof DemandEntry, value: any) => {
    setDemandData(prevData => prevData.map(entry => 
      entry.id === demandId ? { ...entry, [field]: value, lastModifiedBy: currentUser!.name, lastModifiedAt: new Date().toLocaleString() } : entry
    ));
    setEditingCell(null);
    addAuditLog(demandData.find(d=>d.id === demandId)!, 'Quick Edit', `Field '${field}' changed to '${value}'.`);
  };

  const handleHighlightDemand = (demandId: number) => {
    const demand = demandData.find(d => d.id === demandId);
    if (!demand || !currentUser) return;
    
    if (demand.currentSector !== activeTab) {
        setDemandViewModal({ isOpen: true, demand: demand });
    } else {
        if (currentPage !== 'DEMAND') {
            setCurrentPage('DEMAND');
        }
        setHighlightedDemandId(demandId);
        setTimeout(() => {
            document.querySelector(`[data-demand-id='${demandId}']`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => setHighlightedDemandId(null), 1000);
        }, 100);
    }
  };

  const handleCreateUser = (newUser: Omit<User, 'password'|'id'|'theme'>, password: string): boolean => {
      if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
          showAppNotification(`Error: User with email ${newUser.email} already exists.`);
          return false;
      }
      const userWithPassword: User = { ...newUser, password, id: Date.now(), theme: 'dark' };
      setUsers(prev => [userWithPassword, ...prev]);
      showAppNotification(`User ${newUser.name} created successfully.`);
      return true;
  };

  const handleSetTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
  };

  const handleUpdateHomePageContent = (newContent: HomePageContent) => {
    setHomePageContent(newContent);
    showAppNotification('Home page content has been updated.');
  };

  const handleAddVehicle = (newVehicle: Omit<Vehicle, 'id' | 'status'>) => {
    setVehicleStock(prev => [...prev, { ...newVehicle, id: Date.now(), status: 'available' }]);
    showAppNotification(`Vehicle ${newVehicle.registration} added to stock.`);
  };

  const handleRemoveVehicle = (vehicleId: number) => {
    setVehicleStock(prev => prev.filter(v => v.id !== vehicleId));
    showAppNotification(`Vehicle removed from stock.`);
  };

  const handleUpdateVehicleStatus = (vehicleId: number, status: VehicleStatus) => {
    setVehicleStock(prev => prev.map(v => v.id === vehicleId ? { ...v, status } : v));
    showAppNotification(`Vehicle status updated.`);
  };

  const handleAssignUser = useCallback((demandId: number, userId: number | null) => {
    if (!currentUser) return;
    const demand = demandData.find(d => d.id === demandId);
    if (!demand) return;

    const updatedEntry: DemandEntry = { ...demand, assignedTo: userId ?? undefined, lastModifiedBy: currentUser.name, lastModifiedAt: new Date().toISOString() };
    updateDemandEntry(updatedEntry);

    const assignedUser = users.find(u => u.id === userId);
    const actionDetails = userId
        ? `Assigned to ${assignedUser?.name || 'Unknown User'}.`
        : 'Unassigned from user.';
    
    addAuditLog(updatedEntry, 'Assignment', actionDetails);
    showAppNotification(`Demand #${demand.proclaim} ${userId ? `assigned to ${assignedUser?.name.split(' ')[0]}` : 'unassigned'}.`);

  }, [demandData, currentUser, users, showAppNotification]);
  
  const ChatToggleButton = () => (
      <button onClick={() => setIsChatPanelVisible(p => !p)} className="fixed top-1/2 right-0 z-30 transform -translate-y-1/2 bg-[var(--background-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2 rounded-l-lg shadow-lg border-y border-l border-[var(--border-primary)] transition-all" style={{ right: isChatPanelVisible ? `${chatPanelWidth}px` : '0px' }}>
          {isChatPanelVisible ? (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          )}
      </button>
  );

  const renderPage = () => {
    if (!currentUser) return <LoginPage onLogin={handleLogin} users={users} />;
    
    switch (currentPage) {
        case 'HOME': return <HomePage user={currentUser} content={homePageContent} onUpdateContent={handleUpdateHomePageContent} />;
        case 'PROFILE': return <ProfilePage user={currentUser} onUpdate={(msg) => showAppNotification(msg)} />;
        case 'SUMMARY': return <SummaryPage demandData={demandData} vehicleStock={vehicleStock} />;
        case 'STOCK': return <StockPage vehicleStock={vehicleStock} onAddVehicle={handleAddVehicle} onRemoveVehicle={handleRemoveVehicle} onUpdateStatus={handleUpdateVehicleStatus} currentUser={currentUser} />;
        case 'USERS':
            if (currentUser.role !== 'admin') return <HomePage user={currentUser} content={homePageContent} onUpdateContent={handleUpdateHomePageContent} />;
            return <UserManagementPage users={users} onCreateUser={handleCreateUser} />;
        case 'DEMAND':
            return (
                <div className="flex-1 flex overflow-hidden">
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                            <div>
                            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Current Demand</h1>
                            <p className="text-[var(--text-secondary)] mt-1">Live view of all scheduled vehicle movements.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg className="w-5 h-5 text-[var(--text-secondary)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.358 3.358a1 1 0 0 1-1.414 1.414l-3.358-3.358A7 7 0 0 1 2 9Z" clipRule="evenodd" /></svg>
                                    </span>
                                    <input type="text" placeholder="Search demand..." value={demandSearchQuery} onChange={e => setDemandSearchQuery(e.target.value)} className={`w-64 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md py-2 pl-10 pr-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)]`} />
                                </div>
                                
                                <button onClick={() => setHistoryModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-[var(--text-primary)] bg-[var(--background-secondary)] hover:bg-[var(--background-hover)] transition-colors shadow">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                                    History
                                </button>
                                {(currentUser.sector === 'LOGISTICS' || currentUser.sector === 'WORKSHOP' || currentUser.sector === 'HIREFLEET') && activeTab === currentUser.sector && (
                                <button onClick={() => setFormModal({ isOpen: true, mode: 'create' })} className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-white transition-all bg-[var(--brand-bg)] hover:opacity-90 shadow-lg`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>
                                    Create Demand
                                </button>
                                )}
                            </div>
                        </div>
                        <div className="mb-4 border-b border-[var(--border-primary)]">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            {DEMAND_TABS.map(tab => {
                                const isVisible = currentUser.role === 'supervisor' || currentUser.role === 'admin' || tab === currentUser.sector;
                                if (!isVisible) return null;
                                const theme = SECTOR_THEMES[tab];
                                const isActive = activeTab === tab;
                                return (
                                <button key={tab} onClick={() => handleTabClick(tab)} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${isActive ? `${theme.border} ${theme.text}` : `border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)] ${theme.hoverBorder}`}`}>{tab.charAt(0) + tab.slice(1).toLowerCase()}</button>
                                );
                            })}
                            </nav>
                        </div>
                        <div className="bg-[var(--background-primary-translucent)] backdrop-blur-sm border border-[var(--border-primary-translucent)] shadow-2xl rounded-xl overflow-hidden">
                            <DemandTable data={filteredData} onCopy={showAppNotification} onEdit={handleLockAndEdit} onHandover={handleInitiateHandover} onComplete={handleInitiateCompletion} onViewHistory={handleOpenAuditHistory} activeSector={activeTab} collapsedGroups={collapsedGroups} onToggleGroup={handleToggleGroup} theme={activeThemeStyle} currentUser={currentUser} allUsers={users} onUpdateCell={handleUpdateDemandCell} onAssignUser={handleAssignUser} onRowDragStart={(e, demand) => e.dataTransfer.setData("application/json", JSON.stringify(demand))} highlightedDemandId={highlightedDemandId} editingCell={editingCell} setEditingCell={setEditingCell} />
                        </div>
                    </main>
                    {isChatPanelVisible && (
                        <ChatPanel sector={activeTab} theme={activeThemeStyle} currentUser={currentUser} allUsers={users} allChatMessages={chatMessages} onSendMessage={handleSendMessage} onDemandHighlight={handleHighlightDemand} onResize={setChatPanelWidth} width={chatPanelWidth} />
                    )}
                    <ChatToggleButton />
                </div>
            );
        default: return <HomePage user={currentUser} content={homePageContent} onUpdateContent={handleUpdateHomePageContent} />;
    }
  };

  const renderContent = () => {
    if (currentPage === 'DEMAND' && currentUser) {
      return renderPage();
    }
    return (
      <div className="flex-1 overflow-y-auto">
        {renderPage()}
      </div>
    );
  };


  if (!currentUser) {
    return (
        <div className="flex h-screen bg-[var(--background-body)] text-[var(--text-primary)] font-sans items-center justify-center">
            <LoginPage onLogin={handleLogin} users={users} />
             {appNotification && <AppNotification message={appNotification} onClose={() => setAppNotification(null)} />}
        </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--background-body)] text-[var(--text-secondary)] font-sans">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} user={currentUser} onLogout={handleLogout} currentTheme={currentTheme} onSetTheme={handleSetTheme} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header theme={themeForHeader} notifications={systemNotifications} unreadMentions={unreadMentions} isNotificationPanelOpen={isNotificationPanelOpen} onToggleNotificationPanel={toggleNotificationPanel} onMarkNotificationsAsRead={markSystemNotificationsAsRead} onlineUsers={users} />
        {renderContent()}
      </div>
      
      {appNotification && <AppNotification message={appNotification} onClose={() => setAppNotification(null)} />}
      {mentionNotification && <MentionPopup message={mentionNotification} onClose={() => setMentionNotification(null)} />}
      {passwordPrompt.visible && <PasswordPromptModal theme={activeThemeStyle} onSuccess={handlePasswordSuccess} onClose={() => setPasswordPrompt({ visible: false, targetTab: null })} />}
      {formModal.isOpen && <DemandFormModal mode={formModal.mode} isOpen={formModal.isOpen} initialData={formModal.demand} onSave={handleSaveDemand} onClose={handleCloseForm} activeSector={activeTab as Sector} theme={activeThemeStyle} vehicleStock={vehicleStock} />}
      {handoverModal.isOpen && <ConfirmationModal isOpen={handoverModal.isOpen} onClose={() => setHandoverModal({ isOpen: false })} onConfirm={handleConfirmHandover} title="Confirm Handover" message={`Are you sure you want to pass demand #${handoverModal.demand?.proclaim} to the ${handoverModal.targetSector} sector?`} theme={activeThemeStyle} />}
      {completionModal.isOpen && <ConfirmationModal isOpen={completionModal.isOpen} onClose={() => setCompletionModal({ isOpen: false })} onConfirm={handleConfirmCompletion} title="Confirm Completion" message={`This will complete demand #${completionModal.demand?.proclaim} and move the entry to history. Proceed?`} theme={SECTOR_THEMES.HIREFLEET} confirmText="Complete" />}
      {auditModal.isOpen && <AuditHistoryModal isOpen={auditModal.isOpen} onClose={() => setAuditModal({isOpen: false})} theme={activeThemeStyle} logs={auditLog.filter(l => l.demandId === auditModal.demandId)} demandProclaim={demandData.find(d => d.id === auditModal.demandId)?.proclaim || ''} />}
      {historyModalOpen && <HistoryModal isOpen={historyModalOpen} onClose={() => setHistoryModalOpen(false)} allDemands={demandData} currentUser={currentUser} auditLog={auditLog} allUsers={users} />}
      {demandViewModal.isOpen && <DemandViewModal isOpen={demandViewModal.isOpen} demand={demandViewModal.demand} onClose={() => setDemandViewModal({ isOpen: false })} />}
    </div>
  );
}

export default App;