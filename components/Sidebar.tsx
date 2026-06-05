import React from 'react';
import type { User, Page, ThemeName } from '../types';
import { getInitials, getColorForUser, getDisplayRole } from '../utils';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  user: User;
  onLogout: () => void;
  currentTheme: ThemeName;
  onSetTheme: (theme: ThemeName) => void;
}

const HomeIcon = ({ className = 'w-5 h-5' }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
const ListBulletIcon = ({ className = 'w-5 h-5' }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg>;
const ChartPieIcon = ({ className = 'w-5 h-5' }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg>;
const CircleStackIcon = ({ className = 'w-5 h-5' }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>;
const ArrowLeftOnRectangleIcon = ({ className = 'w-5 h-5' }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>;
const UsersIcon = ({ className = 'w-5 h-5' }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.253 9.597 9.597 0 0 0-2.07-5.607 9.337 9.337 0 0 0-4.121-2.253m0 0a9.38 9.38 0 0 0-2.625.372M15 19.128v-3.172m0-6.256a5.25 5.25 0 0 1 5.25 5.25v3.172m-5.25-8.424a5.25 5.25 0 0 0-5.25 5.25v3.172m5.25-8.424-5.25 5.25m5.25-5.25v3.172m0 0a5.25 5.25 0 0 1-5.25 5.25m0 0v3.172a5.25 5.25 0 0 1-5.25-5.25M15 19.128a9.38 9.38 0 0 0-2.625.372 9.337 9.337 0 0 0-4.121-2.253 9.597 9.597 0 0 0 2.07-5.607 9.337 9.337 0 0 0 4.121-2.253M3.75 21v-3.172a5.25 5.25 0 0 1 5.25-5.25M3.75 21a5.25 5.25 0 0 1-5.25-5.25v-3.172a5.25 5.25 0 0 1 5.25 5.25" /></svg>;
const SunIcon = ({ className = 'w-5 h-5' }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.95-4.22-1.591 1.591M5.25 12H3m4.22-4.95L6.364 3.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>;
const MoonIcon = ({ className = 'w-5 h-5' }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>;
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

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 group ${
                isActive
                ? 'bg-[var(--brand-bg)] text-white shadow-sm'
                : 'text-[var(--text-sidebar)] hover:bg-[var(--bg-sidebar-hover)] hover:text-[var(--text-sidebar-hover)]'
            }`}
        >
            <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`}>
                {icon}
            </span>
            <span className="ml-3">{label}</span>
        </button>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, user, onLogout, currentTheme, onSetTheme }) => {
  const navItems: { id: Page; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    { id: 'HOME', label: 'Home', icon: <HomeIcon /> },
    { id: 'DEMAND', label: 'Demand', icon: <ListBulletIcon /> },
    { id: 'SUMMARY', label: 'Summary', icon: <ChartPieIcon /> },
    { id: 'STOCK', label: 'Stock', icon: <CircleStackIcon /> },
    { id: 'USERS', label: 'Users', icon: <UsersIcon />, adminOnly: true },
  ];
  
  const handleThemeToggle = () => {
    onSetTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-[var(--background-sidebar)] flex flex-col h-full shadow-xl z-30">
        <div className="flex items-center space-x-3 px-6 py-6 mb-2">
            <FourthDimensionIcon className="h-8 w-8 text-[var(--brand-text)]" />
            <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-tight leading-none">Cerberus</span>
                <span className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">Manager</span>
            </div>
        </div>

      <div className="flex-grow px-3 space-y-1">
        <nav className="space-y-1">
          {navItems.map((item) => {
            if (item.adminOnly && user.role !== 'admin') return null;
            return (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={currentPage === item.id}
                onClick={() => setCurrentPage(item.id)}
              />
            )
          })}
        </nav>
      </div>
      
      <div className="flex-shrink-0 p-4 bg-black/10 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
             <div className={`w-9 h-9 ${getColorForUser(user.name)} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-slate-800`}>
                {getInitials(user.name)}
            </div>
            <div className='flex flex-col overflow-hidden'>
                <button onClick={() => setCurrentPage('PROFILE')} className="text-sm font-medium text-white hover:underline text-left truncate">{user.name}</button>
                <span className="text-xs text-slate-400 truncate">{getDisplayRole(user)}</span>
            </div>
        </div>

        <div className="flex items-center justify-between gap-2">
           <button
            onClick={onLogout}
            className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md text-slate-300 hover:bg-red-900/20 hover:text-red-400 transition-colors border border-slate-700"
            title="Sign out"
          >
              <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-2"/>
              Sign Out
          </button>
          <button 
            onClick={handleThemeToggle} 
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border border-slate-700"
            title="Toggle theme"
          >
            {currentTheme === 'light' ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
};