export type Theme = {
  [key: string]: string;
};

export const darkTheme: Theme = {
  '--background-body': '#111827',
  '--background-primary': '#1f2937',
  '--background-secondary': '#374151',
  '--background-tertiary': '#4b5563',
  '--background-hover': '#4b5563',
  '--background-primary-translucent': 'rgba(31, 41, 55, 0.8)',
  '--background-secondary-translucent': 'rgba(55, 65, 81, 0.6)',
  '--background-backdrop': 'rgba(0, 0, 0, 0.7)',
  '--text-primary': '#f9fafb',
  '--text-secondary': '#9ca3af',
  '--text-tertiary': '#6b7280',
  '--border-primary': '#374151',
  '--border-secondary': '#4b5563',
  '--border-primary-translucent': 'rgba(55, 65, 81, 0.6)',
  '--brand-text': '#a5b4fc',
  '--brand-bg': '#4f46e5',
  '--brand-ring': '#818cf8',
};

export const lightTheme: Theme = {
  '--background-body': '#f3f4f6',
  '--background-primary': '#ffffff',
  '--background-secondary': '#f9fafb',
  '--background-tertiary': '#e5e7eb',
  '--background-hover': '#f3f4f6',
  '--background-primary-translucent': 'rgba(255, 255, 255, 0.8)',
  '--background-secondary-translucent': 'rgba(243, 244, 246, 0.6)',
  '--background-backdrop': 'rgba(255, 255, 255, 0.7)',
  '--text-primary': '#1f2937',
  '--text-secondary': '#6b7280',
  '--text-tertiary': '#9ca3af',
  '--border-primary': '#e5e7eb',
  '--border-secondary': '#d1d5db',
  '--border-primary-translucent': 'rgba(229, 231, 235, 0.6)',
  '--brand-text': '#4338ca',
  '--brand-bg': '#4f46e5',
  '--brand-ring': '#6366f1',
};

const logisticsTheme: Theme = { ...darkTheme };

const workshopTheme: Theme = {
  ...darkTheme,
  '--brand-text': '#fcd34d', // amber-300
  '--brand-bg': '#d97706',   // amber-600
  '--brand-ring': '#fbbf24', // amber-400
};

const hirefleetTheme: Theme = {
  ...darkTheme,
  '--brand-text': '#5eead4', // teal-300
  '--brand-bg': '#0d9488',   // teal-600
  '--brand-ring': '#2dd4bf', // teal-400
};


export const christmasTheme: Theme = { ...darkTheme, '--brand-text': '#f87171', '--brand-bg': '#b91c1c', '--brand-ring': '#ef4444' };
export const summerTheme: Theme = { ...lightTheme, '--brand-text': '#f59e0b', '--brand-bg': '#fb923c', '--brand-ring': '#fdba74' };
export const autumnTheme: Theme = { ...darkTheme, '--brand-text': '#f59e0b', '--brand-bg': '#d97706', '--brand-ring': '#fbbf24' };
export const easterTheme: Theme = { ...lightTheme, '--brand-text': '#a78bfa', '--brand-bg': '#8b5cf6', '--brand-ring': '#c4b5fd' };
export const springTheme: Theme = { ...lightTheme, '--brand-text': '#4ade80', '--brand-bg': '#22c55e', '--brand-ring': '#86efac' };


export const themes = {
    dark: darkTheme,
    light: lightTheme,
    logistics: logisticsTheme,
    workshop: workshopTheme,
    hirefleet: hirefleetTheme,
    christmas: christmasTheme,
    summer: summerTheme,
    autumn: autumnTheme,
    easter: easterTheme,
    spring: springTheme,
};