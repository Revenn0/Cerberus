export type Theme = {
  [key: string]: string;
};

// Professional Light Theme (Default)
export const lightTheme: Theme = {
  '--background-body': '#f1f5f9', // Slate 100
  '--background-primary': '#ffffff',
  '--background-secondary': '#f8fafc', // Slate 50
  '--background-tertiary': '#e2e8f0', // Slate 200
  '--background-hover': '#f1f5f9',
  '--background-sidebar': '#0f172a', // Slate 900
  '--text-sidebar': '#cbd5e1',
  '--text-sidebar-hover': '#ffffff',
  '--bg-sidebar-hover': '#1e293b',
  '--background-primary-translucent': 'rgba(255, 255, 255, 0.95)',
  '--background-secondary-translucent': 'rgba(248, 250, 252, 0.95)',
  '--background-backdrop': 'rgba(15, 23, 42, 0.4)',
  '--text-primary': '#0f172a', // Slate 900
  '--text-secondary': '#475569', // Slate 600
  '--text-tertiary': '#94a3b8', // Slate 400
  '--border-primary': '#e2e8f0', // Slate 200
  '--border-secondary': '#cbd5e1', // Slate 300
  '--border-primary-translucent': 'rgba(226, 232, 240, 0.8)',
  '--brand-text': '#2563eb',
  '--brand-bg': '#2563eb',
  '--brand-hover': '#1d4ed8',
  '--brand-ring': '#60a5fa',
};

// Professional Dark Theme
export const darkTheme: Theme = {
  '--background-body': '#0f172a', // Slate 900
  '--background-primary': '#1e293b', // Slate 800
  '--background-secondary': '#334155', // Slate 700
  '--background-tertiary': '#475569', // Slate 600
  '--background-hover': '#334155',
  '--background-sidebar': '#020617', // Slate 950
  '--text-sidebar': '#94a3b8',
  '--text-sidebar-hover': '#f8fafc',
  '--bg-sidebar-hover': '#1e293b',
  '--background-primary-translucent': 'rgba(30, 41, 59, 0.95)',
  '--background-secondary-translucent': 'rgba(51, 65, 85, 0.95)',
  '--background-backdrop': 'rgba(0, 0, 0, 0.7)',
  '--text-primary': '#f8fafc', // Slate 50
  '--text-secondary': '#cbd5e1', // Slate 300
  '--text-tertiary': '#94a3b8', // Slate 400
  '--border-primary': '#334155', // Slate 700
  '--border-secondary': '#475569', // Slate 600
  '--border-primary-translucent': 'rgba(51, 65, 85, 0.8)',
  '--brand-text': '#60a5fa', // Blue 400
  '--brand-bg': '#3b82f6', // Blue 500
  '--brand-hover': '#2563eb', // Blue 600
  '--brand-ring': '#3b82f6',
};

const logisticsTheme: Theme = { ...lightTheme, '--brand-bg': '#4f46e5', '--brand-text': '#4338ca' }; // Indigo
const workshopTheme: Theme = { ...lightTheme, '--brand-bg': '#d97706', '--brand-text': '#b45309' }; // Amber
const hirefleetTheme: Theme = { ...lightTheme, '--brand-bg': '#059669', '--brand-text': '#047857' }; // Emerald

export const themes = {
    light: lightTheme,
    dark: darkTheme,
    logistics: logisticsTheme,
    workshop: workshopTheme,
    hirefleet: hirefleetTheme,
    // Legacy mapping
    christmas: lightTheme,
    summer: lightTheme,
    autumn: lightTheme,
    easter: lightTheme,
    spring: lightTheme,
};