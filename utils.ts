import { User } from './types';

export const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length > 1) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const avatarColors = [
  'bg-pink-600', 'bg-purple-600', 'bg-blue-600', 'bg-green-600', 
  'bg-yellow-600', 'bg-red-600', 'bg-indigo-600', 'bg-fuchsia-600',
  'bg-sky-600', 'bg-emerald-600', 'bg-rose-600'
];

export const getColorForUser = (name: string) => {
  if (!name) return 'bg-gray-600';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % avatarColors.length);
  return avatarColors[index];
}

export const getDisplayRole = (user: User): string => {
    if (user.sector === 'HIREFLEET' && user.role === 'user') {
        return 'Hire Fleet Coordinator';
    }
    const role = user.role;
    return role.charAt(0).toUpperCase() + role.slice(1);
};
