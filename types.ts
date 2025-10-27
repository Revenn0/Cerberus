

export type Sector = 'LOGISTICS' | 'WORKSHOP' | 'HIREFLEET';
export type DemandStatus = 'PIZZA' | 'LOCK' | 'COMPLETED' | '';
export type LicenceType = 'EURO' | 'CBT' | 'FULL';
export type CyrusConfirmation = 'YES' | 'NO' | '';
export type TagType = 'normal' | 'important' | 'urgent';
export type Page = 'LOGIN' | 'HOME' | 'DEMAND' | 'SUMMARY' | 'STOCK' | 'PROFILE' | 'USERS';
export type ThemeName = 'dark' | 'light' | 'christmas' | 'summer' | 'autumn' | 'easter' | 'spring' | 'logistics' | 'workshop' | 'hirefleet';
export type WorkshopStatus = 'RESERVED' | '';


export interface Tag {
  text: string;
  type: TagType;
}

export interface DemandEntry {
  id: number;
  clientName: string;
  proclaim: string;
  postcode: string;
  model: string;
  category: string;
  contract: string;
  status: DemandStatus;
  helmet?: string;
  licenceType: LicenceType;
  routedDate?: string;
  confirmedDate?: string;
  swap: 'YES' | 'NO';
  vehicleInfo: string;
  registration: string;
  cyrusConfirmation: CyrusConfirmation;
  referenceId: string;
  group?: string; // For grouping by date, e.g., "Monday 14/07"
  lastModifiedBy: string;
  lastModifiedAt: string;
  tags?: Tag[];
  currentSector: Sector;
  lockedBy?: string;
  isArchived?: boolean;
  completedAt?: string;
  workshopStatus?: WorkshopStatus;
  assignedTo?: number; // ID of the user working on the demand
}

export interface User {
  id: number;
  name: string;
  sector: Sector;
  role: 'user' | 'supervisor' | 'admin';
  email: string;
  password?: string; // Should be handled securely, only present for mock data
  phone?: string;
  theme: ThemeName;
}

export interface ChatMessage {
    id: number;
    user: User;
    message: string;
    timestamp: string;
    channel: Sector | 'ALL';
    demandId?: number;
    mentions?: number[]; // Array of mentioned user IDs
}

export type CreateDemandFormData = Omit<DemandEntry, 'id' | 'lastModifiedBy' | 'lastModifiedAt' | 'referenceId' | 'group' | 'currentSector' | 'lockedBy' | 'isArchived' | 'completedAt' | 'workshopStatus' | 'assignedTo'>;

export interface AuditLog {
    id: number;
    demandId: number;
    demandProclaim: string;
    user: string;
    action: string;
    timestamp: string;
    details: string;
}

export interface NotificationItem {
    id: number;
    message: string;
    timestamp: string;
    read: boolean;
}

export type VehicleStatus = 'available' | 'on_hire' | 'in_workshop' | 'stolen' | 'with_driver';

export interface Vehicle {
  id: number;
  model: string;
  registration: string;
  status: VehicleStatus;
}

export interface UpdateItem {
  id: number;
  title: string;
  date: string;
  content: string;
  color: string;
}

export interface HomePageContent {
  title: string;
  subtitle: string;
  updates: UpdateItem[];
}