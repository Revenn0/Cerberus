import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
    <div className="fixed top-5 right-5 bg-[var(--brand-bg)] text-white px-4 py-3 rounded-md shadow-lg z-50 animate-fade-in flex items-center gap-3">
      <div className="w-2 h-2 bg-white rounded-full"></div>
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

const DEMAND_TABS: Array<Sector> = ['LOGISTICS', 'WORKSHOP', 'HIREFLEET'];

const SECTOR_FLOW: Record<Sector, Sector | null> = {
  LOGISTICS: 'WORKSHOP',
  WORKSHOP: 'HIREFLEET',
  HIREFLEET: null,
};

// Helper for persistence
const useStickyState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (err) {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.error("Could not save state to local storage", err);
    }
  }, [key, state]);

  return [state, setState];
};


function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  
  // Persistent State
  const [users, setUsers] = useStickyState<User[]>('cerberus_users', MOCK_USERS);
  const [demandData, setDemandData] = useStickyState<DemandEntry[]>('cerberus_demand', MOCK_DEMAND_DATA);
  const [vehicleStock, setVehicleStock] = useStickyState<Vehicle[]>('cerberus_stock', MOCK_VEHICLE_STOCK);
  const [chatMessages, setChatMessages] = useStickyState<Record<Sector | 'ALL', ChatMessage[]>>('cerberus_chat', MOCK_CHAT_MESSAGES);
  const [homePageContent, setHomePageContent] = useStickyState<HomePageContent>('cerberus_home', MOCK_HOME_PAGE_CONTENT);

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

  const [auditLog, setAuditLog] = useStickyState<AuditLog[]>('cerberus_audit', []);
  const [systemNotifications, setSystemNotifications] = useState<NotificationItem[]>([]);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  
  const [isChatPanelVisible, setIsChatPanelVisible] = useState(true);
  const [chatPanelWidth, setChatPanelWidth] = useState(350); 

  const [highlightedDemandId, setHighlightedDemandId] = useState<number | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const [currentTheme, setCurrentTheme] = useState<ThemeName>('light');
  
  const [unreadMentions, setUnreadMentions] = useState(0);
  const [mentionNotification, setMentionNotification] = useState<ChatMessage | null>(null);
  
  const currentUser = authenticatedUser;

  useEffect(() => {
    if(currentUser) {
        // Enforce light theme as default professional view
        setCurrentTheme('light'); 
        setActiveTab(currentUser.sector);
        setCurrentPage('HOME');
    } else {
        setCurrentPage('LOGIN');
        setCurrentTheme('light');
    }
  }, [currentUser]);

  useEffect(() => {
    const theme = themes[currentTheme] || themes.light;
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
    showAppNotification(`Signed in as ${user.name}`);
  };

  const handleLogout = () => {
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
      const userWithPassword: User = { ...newUser, password, id: Date.now(), theme: 'light' };
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
      <button onClick={() => setIsChatPanelVisible(p => !p)} className="fixed top-24 right-0 z-30 bg-[var(--background-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2 rounded-l-lg shadow-md border-y border-l border-[var(--border-primary)] transition-all flex items-center gap-2" style={{ right: isChatPanelVisible ? `${chatPanelWidth}px` : '0px' }}>
          {isChatPanelVisible ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" /></svg>
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
                    <main className="flex-1 p-6 overflow-y-auto bg-[var(--background-body)]">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Demand Board</h1>
                                <p className="text-[var(--text-secondary)] text-sm mt-1">Real-time fleet tracking and schedule management.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg className="w-4 h-4 text-[var(--text-tertiary)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.358 3.358a1 1 0 0 1-1.414 1.414l-3.358-3.358A7 7 0 0 1 2 9Z" clipRule="evenodd" /></svg>
                                    </span>
                                    <input type="text" placeholder="Search..." value={demandSearchQuery} onChange={e => setDemandSearchQuery(e.target.value)} className="w-64 bg-white border border-[var(--border-secondary)] rounded-md py-2 pl-9 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-ring)] focus:border-[var(--brand-ring)] transition-all shadow-sm" />
                                </div>
                                
                                <button onClick={() => setHistoryModalOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm text-[var(--text-secondary)] bg-white border border-[var(--border-secondary)] hover:bg-[var(--background-hover)] transition-colors shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" /></svg>
                                    History
                                </button>
                                
                                {(currentUser.sector === 'LOGISTICS' || currentUser.sector === 'WORKSHOP' || currentUser.sector === 'HIREFLEET') && activeTab === currentUser.sector && (
                                <button onClick={() => setFormModal({ isOpen: true, mode: 'create' })} className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm text-white bg-[var(--brand-bg)] hover:bg-[var(--brand-hover)] transition-all shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>
                                    New Demand
                                </button>
                                )}
                            </div>
                        </div>
                        <div className="mb-4">
                            <nav className="flex space-x-1 p-1 bg-[var(--background-tertiary)] rounded-lg w-fit" aria-label="Tabs">
                            {DEMAND_TABS.map(tab => {
                                const isVisible = currentUser.role === 'supervisor' || currentUser.role === 'admin' || tab === currentUser.sector;
                                if (!isVisible) return null;
                                const isActive = activeTab === tab;
                                return (
                                <button 
                                    key={tab} 
                                    onClick={() => handleTabClick(tab)} 
                                    className={`
                                        px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                                        ${isActive 
                                            ? 'bg-[var(--background-primary)] text-[var(--text-primary)] shadow-sm' 
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}
                                    `}
                                >
                                    {tab.charAt(0) + tab.slice(1).toLowerCase()}
                                </button>
                                );
                            })}
                            </nav>
                        </div>
                        <div className="bg-[var(--background-primary)] border border-[var(--border-primary)] shadow-sm rounded-lg overflow-hidden">
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
      <div className="flex-1 overflow-y-auto bg-[var(--background-body)]">
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