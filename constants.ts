

import { DemandEntry, Sector, LicenceType, DemandStatus, TagType, Vehicle, User, ChatMessage, HomePageContent, WorkshopStatus } from './types';

export const BIKE_MODELS = ['nmax 125', 'WW 125', 'X-MAX 300', 'CBF 250-6', '125 NMAX', 'KTM 125', 'Speed Triple RS 1160', 'Himalayan 452', 'CBR 600 FA-B', 'PCX 125', 'SH 125i', 'SH 350', 'Forza 125', 'Forza 350', 'CB 125F', 'NC 750X', 'SV 650'];
export const LICENCE_TYPES: LicenceType[] = ['EURO', 'CBT', 'FULL'];
export const DEMAND_STATUSES: DemandStatus[] = ['PIZZA', 'LOCK', 'COMPLETED'];
export const SWAP_OPTIONS: Array<'YES' | 'NO'> = ['YES', 'NO'];

export const MOCK_VEHICLE_STOCK: Vehicle[] = [
    { id: 1, model: 'nmax 125', registration: 'RJ72ERX', status: 'on_hire' },
    { id: 2, model: 'WW 125', registration: 'RO24XYJ', status: 'on_hire' },
    { id: 3, model: 'SH125i', registration: 'RV24VRM', status: 'with_driver' },
    { id: 4, model: 'CB125F', registration: 'RV68EOC', status: 'with_driver' },
    { id: 5, model: 'NC750X', registration: 'RA19XJH', status: 'in_workshop' },
    { id: 6, model: 'SV650', registration: 'RF22JKN', status: 'with_driver' },
    { id: 7, model: 'FORZA125', registration: 'RO24YGL', status: 'on_hire' },
    { id: 8, model: 'SH350', registration: 'RV25LVN', status: 'available' },
    { id: 9, model: 'nmax 125', registration: 'BD19XYZ', status: 'available' },
    { id: 10, model: 'PCX 125', registration: 'EX20ABC', status: 'available' },
    { id: 11, model: 'PCX 125', registration: 'EX20ABD', status: 'in_workshop' },
    { id: 12, model: 'X-MAX 300', registration: 'YG21FGH', status: 'in_workshop' },
    { id: 13, model: 'Speed Triple RS 1160', registration: 'TR22RST', status: 'with_driver' },
    { id: 14, model: 'Himalayan 452', registration: 'RE23HML', status: 'on_hire' },
    { id: 15, model: 'PCX 125', registration: 'LM24AAB', status: 'with_driver' },
    { id: 16, model: 'SH 125i', registration: 'LM24AAC', status: 'with_driver' },
    { id: 17, model: 'Forza 125', registration: 'LM24AAD', status: 'with_driver' },
    { id: 18, model: 'nmax 125', registration: 'LM24AAE', status: 'in_workshop' },
    { id: 19, model: 'CB 125F', registration: 'LM24AAF', status: 'in_workshop' },
    { id: 20, model: 'WW 125', registration: 'LM24AAG', status: 'in_workshop' },
    { id: 21, model: 'Forza 350', registration: 'LM24AAH', status: 'in_workshop' },
    { id: 22, model: 'SH 350', registration: 'LM24AAI', status: 'in_workshop' },
    { id: 23, model: 'X-MAX 300', registration: 'LM24AAJ', status: 'in_workshop' },
    { id: 24, model: 'NC 750X', registration: 'LM24AAK', status: 'with_driver' },
    { id: 25, model: 'KTM 125', registration: 'LM24AAL', status: 'with_driver' },
    { id: 26, model: 'SV 650', registration: 'LM24AAM', status: 'with_driver' },
    { id: 27, model: 'CBF 250-6', registration: 'LM24AAN', status: 'with_driver' },
    { id: 28, model: 'Himalayan 452', registration: 'LM24AAO', status: 'with_driver' },
    { id: 29, model: 'Speed Triple RS 1160', registration: 'LM24AAP', status: 'in_workshop' },
    { id: 30, model: 'PCX 125', registration: 'LM24AAQ', status: 'in_workshop' },
    { id: 31, model: 'nmax 125', registration: 'LM24AAR', status: 'in_workshop' },
    { id: 32, model: 'SH 125i', registration: 'LM24AAS', status: 'with_driver' },
    { id: 33, model: 'X-MAX 300', registration: 'LM24AAT', status: 'with_driver' },
    { id: 34, model: 'Forza 350', registration: 'LM24AAU', status: 'with_driver' },
    { id: 35, model: 'CB 125F', registration: 'LM24AAV', status: 'available' },
    { id: 36, model: 'KTM 125', registration: 'LM24AAW', status: 'available' },
    { id: 37, model: 'PCX 125', registration: 'LM24AAX', status: 'available' },
    { id: 38, model: 'nmax 125', registration: 'LM24AAY', status: 'available' },
    { id: 39, model: 'WW 125', registration: 'LM24AAZ', status: 'available' },
];

export const MOCK_DEMAND_DATA: DemandEntry[] = [
  // Existing Data (Adjusted)
  {
    id: 1, clientName: 'DE OLIVEIRA', proclaim: '613410', postcode: 'en3', model: 'nmax 125', category: 'B2A', contract: '365', status: 'PIZZA', helmet: 'S&M', licenceType: 'EURO', routedDate: '12/07', confirmedDate: '12/07', swap: 'YES', vehicleInfo: 'PCX (nasi pizza)', registration: 'RJ72ERX', cyrusConfirmation: 'NO', referenceId: '613410', lastModifiedBy: 'Admin', lastModifiedAt: '2024-07-20 10:00', group: 'Friday 12/07', currentSector: 'LOGISTICS', workshopStatus: '', assignedTo: 4
  },
  {
    id: 2, clientName: 'SANTOS', proclaim: '615551', postcode: 'WW10', model: 'WW 125', category: 'B2A', contract: '365', status: 'LOCK', licenceType: 'EURO', routedDate: '12/07', confirmedDate: '12/07', swap: 'NO', vehicleInfo: 'SH125i (nasi lb)', registration: 'RO24XYJ', cyrusConfirmation: 'NO', referenceId: '615551', lastModifiedBy: 'Admin', lastModifiedAt: '2024-07-20 10:05', group: 'Friday 12/07', currentSector: 'LOGISTICS', workshopStatus: ''
  },
  {
    id: 3, clientName: 'KHESSAR', proclaim: '615302', postcode: 'W10', model: 'X-MAX 300', category: 'B3A', contract: '365', status: 'PIZZA', licenceType: 'EURO', routedDate: '12/07', confirmedDate: '12/07', swap: 'YES', vehicleInfo: 'SH350 (nasi pizza)', registration: 'YG21FGH', cyrusConfirmation: 'NO', referenceId: '615302', lastModifiedBy: 'Scheduler', lastModifiedAt: '2024-07-20 10:15', tags: [{ text: 'Needs Topbox', type: 'normal' }], group: 'Friday 12/07', currentSector: 'WORKSHOP', workshopStatus: '', assignedTo: 3
  },
  {
    id: 4, clientName: 'VIAU', proclaim: '615603', postcode: 'HP3', model: 'CBF 250-6', category: 'B3M', contract: '365', status: 'LOCK', licenceType: 'EURO', routedDate: '12/07', confirmedDate: '12/07', swap: 'YES', vehicleInfo: 'SH350/FORZA (nasi lb)', registration: 'RJ25HLK', cyrusConfirmation: 'NO', referenceId: '615603', lastModifiedBy: 'Admin', lastModifiedAt: '2024-07-20 10:20', group: 'Friday 12/07', currentSector: 'HIREFLEET', isArchived: true, completedAt: '2024-07-23', workshopStatus: ''
  },
  {
    id: 5, group: 'Monday 15/07', clientName: 'DINIZ', proclaim: '615239', postcode: 'SL0', model: 'SH125i', category: 'B2A', contract: '365', status: 'LOCK', helmet: 'L', licenceType: 'CBT', routedDate: '15/07', confirmedDate: '', swap: 'NO', vehicleInfo: 'SH125i (nasi lb)', registration: 'RV24VRM', cyrusConfirmation: 'YES', referenceId: '615239', lastModifiedBy: 'Scheduler', lastModifiedAt: '2024-07-20 11:30', currentSector: 'LOGISTICS', workshopStatus: ''
  },
  {
    id: 6, clientName: 'Strain', proclaim: '615411', postcode: 'CM7', model: 'CB125F', category: 'B2M', contract: '4D', status: 'LOCK', helmet: 'S&M', licenceType: 'FULL', routedDate: '15/07', confirmedDate: '', swap: 'NO', vehicleInfo: 'CB125F + RACK', registration: 'RV68EOC', cyrusConfirmation: 'NO', referenceId: '615411', lastModifiedBy: 'PlannerBot', lastModifiedAt: '2024-07-19 14:00', group: 'Monday 15/07', currentSector: 'LOGISTICS', workshopStatus: ''
  },
  {
    id: 7, clientName: 'Baron', proclaim: '615528', postcode: 'KA7', model: 'Speed Triple RS 1160', category: 'B6M', contract: '4D', status: 'LOCK', licenceType: 'FULL', routedDate: '15/07', confirmedDate: '', swap: 'NO', vehicleInfo: 'NC750X', registration: 'TR22RST', cyrusConfirmation: 'NO', referenceId: '615528', lastModifiedBy: 'PlannerBot', lastModifiedAt: '2024-07-19 14:05', tags: [{ text: 'Client wants early delivery', type: 'important' }], group: 'Monday 15/07', currentSector: 'HIREFLEET', workshopStatus: ''
  },
  {
    id: 8, clientName: 'Brown', proclaim: '615062', postcode: 'DH3', model: 'SV650', category: 'B4M', contract: '4D', status: '', helmet: 'XL', licenceType: 'FULL', routedDate: '15/07', confirmedDate: '', swap: 'NO', vehicleInfo: 'SV650', registration: 'RF22JKN', cyrusConfirmation: 'NO', referenceId: '615524', lastModifiedBy: 'PlannerBot', lastModifiedAt: '2024-07-19 15:00', tags: [{ text: 'Client Requested CB500', type: 'urgent' }, { text: 'Check documents', type: 'important' }], group: 'Monday 15/07', currentSector: 'LOGISTICS', workshopStatus: ''
  },
  {
    id: 9, clientName: 'Pereira', proclaim: '615571', postcode: 'CR4', model: 'FORZA125', category: 'B4M', contract: '4D', status: '', licenceType: 'FULL', routedDate: '15/07', confirmedDate: 'YES', swap: 'NO', vehicleInfo: 'FORZA125 (nasi pizza)', registration: 'RO24YGL', cyrusConfirmation: 'YES', referenceId: '615571', lastModifiedBy: 'Scheduler', lastModifiedAt: '2024-07-20 12:00', group: 'Monday 15/07', currentSector: 'HIREFLEET', workshopStatus: ''
  },

  // New Data
  // LOGISTICS (6 new)
  {
    id: 10, group: 'Tuesday 16/07', clientName: 'Silva', proclaim: '616001', postcode: 'N1', model: 'PCX 125', category: 'B2A', contract: '365', status: 'PIZZA', helmet: 'M', licenceType: 'CBT', routedDate: '16/07', confirmedDate: '16/07', swap: 'NO', vehicleInfo: 'PCX 125', registration: 'LM24AAB', cyrusConfirmation: 'NO', referenceId: '616001', lastModifiedBy: 'Joana Silva', lastModifiedAt: '2024-07-21 09:00', currentSector: 'LOGISTICS', workshopStatus: ''
  },
  {
    id: 11, group: 'Tuesday 16/07', clientName: 'Johnson', proclaim: '616002', postcode: 'E8', model: 'SH 125i', category: 'B2A', contract: '4D', status: 'LOCK', licenceType: 'FULL', routedDate: '16/07', confirmedDate: '', swap: 'YES', vehicleInfo: 'SH 125i', registration: 'LM24AAC', cyrusConfirmation: 'NO', referenceId: '616002', lastModifiedBy: 'Emily Carter', lastModifiedAt: '2024-07-21 09:30', tags: [{ text: 'VIP Client', type: 'important' }], currentSector: 'LOGISTICS', workshopStatus: '', assignedTo: 6
  },
  {
    id: 12, group: 'Tuesday 16/07', clientName: 'Williams', proclaim: '616003', postcode: 'SE15', model: 'Forza 125', category: 'B2A', contract: '365', status: '', licenceType: 'EURO', routedDate: '16/07', confirmedDate: '', swap: 'NO', vehicleInfo: 'Forza 125', registration: 'LM24AAD', cyrusConfirmation: 'NO', referenceId: '616003', lastModifiedBy: 'Joana Silva', lastModifiedAt: '2024-07-21 10:00', currentSector: 'LOGISTICS', workshopStatus: ''
  },
  {
    id: 13, group: 'Wednesday 17/07', clientName: 'Jones', proclaim: '617010', postcode: 'SW11', model: 'NC 750X', category: 'B5M', contract: '4D', status: 'LOCK', licenceType: 'FULL', routedDate: '17/07', confirmedDate: '17/07', swap: 'NO', vehicleInfo: 'NC 750X', registration: 'LM24AAK', cyrusConfirmation: 'NO', referenceId: '617010', lastModifiedBy: 'Admin', lastModifiedAt: '2024-07-22 11:00', currentSector: 'LOGISTICS', workshopStatus: ''
  },
  {
    id: 14, group: 'Wednesday 17/07', clientName: 'Taylor', proclaim: '617011', postcode: 'W2', model: 'KTM 125', category: 'B2M', contract: '4D', status: 'PIZZA', helmet: 'L', licenceType: 'CBT', routedDate: '17/07', confirmedDate: '', swap: 'YES', vehicleInfo: 'KTM 125 + Rack', registration: 'LM24AAL', cyrusConfirmation: 'NO', referenceId: '617011', lastModifiedBy: 'Emily Carter', lastModifiedAt: '2024-07-22 11:30', currentSector: 'LOGISTICS', workshopStatus: ''
  },
  {
    id: 15, group: 'Wednesday 17/07', clientName: 'Davies', proclaim: '617012', postcode: 'NW8', model: 'SV 650', category: 'B4M', contract: '4D', status: '', licenceType: 'FULL', routedDate: '17/07', confirmedDate: '', swap: 'NO', vehicleInfo: 'SV 650', registration: 'LM24AAM', cyrusConfirmation: 'NO', referenceId: '617012', lastModifiedBy: 'PlannerBot', lastModifiedAt: '2024-07-22 12:00', tags: [{ text: 'Check license', type: 'urgent' }], currentSector: 'LOGISTICS', workshopStatus: ''
  },

  // WORKSHOP (9 new)
  {
    id: 16, group: 'Tuesday 16/07', clientName: 'Evans', proclaim: '616004', postcode: 'GU1', model: 'nmax 125', category: 'B2A', contract: '365', status: 'LOCK', helmet: 'S', licenceType: 'CBT', routedDate: '16/07', confirmedDate: '16/07', swap: 'NO', vehicleInfo: 'Standard service', registration: 'LM24AAE', cyrusConfirmation: 'NO', referenceId: '616004', lastModifiedBy: 'Workshop Supervisor', lastModifiedAt: '2024-07-21 14:00', currentSector: 'WORKSHOP', workshopStatus: ''
  },
  {
    id: 17, group: 'Tuesday 16/07', clientName: 'Thomas', proclaim: '616005', postcode: 'KT1', model: 'CB 125F', category: 'B2M', contract: '4D', status: '', licenceType: 'FULL', routedDate: '16/07', confirmedDate: '', swap: 'NO', vehicleInfo: 'New tyres required', registration: 'LM24AAF', cyrusConfirmation: 'NO', referenceId: '616005', lastModifiedBy: 'Workshop Supervisor', lastModifiedAt: '2024-07-21 14:30', tags: [{ text: 'Urgent repair', type: 'urgent' }], currentSector: 'WORKSHOP', workshopStatus: ''
  },
  {
    id: 18, group: 'Wednesday 17/07', clientName: 'Roberts', proclaim: '617020', postcode: 'TW9', model: 'WW 125', category: 'B2A', contract: '365', status: 'PIZZA', licenceType: 'EURO', routedDate: '17/07', confirmedDate: '17/07', swap: 'YES', vehicleInfo: 'Topbox fitting', registration: 'LM24AAG', cyrusConfirmation: 'NO', referenceId: '617020', lastModifiedBy: 'Workshop Supervisor', lastModifiedAt: '2024-07-22 15:00', currentSector: 'WORKSHOP', workshopStatus: ''
  },
  {
    id: 19, group: 'Wednesday 17/07', clientName: 'Wilson', proclaim: '617021', postcode: 'UB6', model: 'Forza 350', category: 'B3A', contract: '4D', status: 'LOCK', licenceType: 'FULL', routedDate: '17/07', confirmedDate: '', swap: 'NO', vehicleInfo: 'Full valet + checkup', registration: 'LM24AAH', cyrusConfirmation: 'NO', referenceId: '617021', lastModifiedBy: 'Workshop Supervisor', lastModifiedAt: '2024-07-22 15:30', currentSector: 'WORKSHOP', workshopStatus: ''
  },
  {
    id: 20, group: 'Thursday 18/07', clientName: 'Walker', proclaim: '618030', postcode: 'HA1', model: 'SH 350', category: 'B3A', contract: '365', status: '', licenceType: 'FULL', routedDate: '18/07', confirmedDate: '', swap: 'YES', vehicleInfo: 'New brakes', registration: 'LM24AAI', cyrusConfirmation: 'NO', referenceId: '618030', lastModifiedBy: 'Admin', lastModifiedAt: '2024-07-23 09:00', currentSector: 'WORKSHOP', workshopStatus: 'RESERVED'
  },
  {
    id: 21, group: 'Thursday 18/07', clientName: 'Wright', proclaim: '618031', postcode: 'WD17', model: 'X-MAX 300', category: 'B3A', contract: '4D', status: 'LOCK', helmet: 'XL', licenceType: 'CBT', routedDate: '18/07', confirmedDate: '18/07', swap: 'NO', vehicleInfo: 'Electrical fault diagnosis', registration: 'LM24AAJ', cyrusConfirmation: 'NO', referenceId: '618031', lastModifiedBy: 'Workshop Supervisor', lastModifiedAt: '2024-07-23 09:30', tags: [{ text: 'Complex issue', type: 'important' }], currentSector: 'WORKSHOP', workshopStatus: ''
  },
   {
    id: 22, clientName: 'Thompson', proclaim: '618032', postcode: 'RM1', model: 'Speed Triple RS 1160', category: 'B6M', contract: '4D', status: 'PIZZA', licenceType: 'FULL', routedDate: '18/07', confirmedDate: '', swap: 'NO', vehicleInfo: 'Chain and sprocket replacement', registration: 'LM24AAP', cyrusConfirmation: 'NO', referenceId: '618032', lastModifiedBy: 'Scheduler', lastModifiedAt: '2024-07-23 10:15', group: 'Thursday 18/07', currentSector: 'WORKSHOP', workshopStatus: ''
  },
  {
    id: 23, clientName: 'White', proclaim: '619040', postcode: 'IG1', model: 'PCX 125', category: 'B2A', contract: '365', status: 'LOCK', licenceType: 'EURO', routedDate: '19/07', confirmedDate: '19/07', swap: 'YES', vehicleInfo: 'Standard service', registration: 'LM24AAQ', cyrusConfirmation: 'NO', referenceId: '619040', lastModifiedBy: 'Admin', lastModifiedAt: '2024-07-24 11:00', group: 'Friday 19/07', currentSector: 'WORKSHOP', workshopStatus: ''
  },
  {
    id: 24, clientName: 'Green', proclaim: '619041', postcode: 'DA1', model: 'nmax 125', category: 'B2A', contract: '365', status: '', licenceType: 'CBT', routedDate: '19/07', confirmedDate: '', swap: 'NO', vehicleInfo: 'Panel damage repair', registration: 'LM24AAR', cyrusConfirmation: 'NO', referenceId: '619041', lastModifiedBy: 'Workshop Supervisor', lastModifiedAt: '2024-07-24 11:30', group: 'Friday 19/07', currentSector: 'WORKSHOP', workshopStatus: 'RESERVED'
  },
  
  // HIREFLEET (10 new)
  {
    id: 25, clientName: 'Harris', proclaim: '616006', postcode: 'BR1', model: 'CBF 250-6', category: 'B3M', contract: '4D', status: 'LOCK', licenceType: 'FULL', routedDate: '16/07', confirmedDate: '16/07', swap: 'NO', vehicleInfo: 'Awaiting Cyrus confirmation', registration: 'LM24AAN', cyrusConfirmation: 'NO', referenceId: '616006', lastModifiedBy: 'Mike Johnson', lastModifiedAt: '2024-07-21 16:00', group: 'Tuesday 16/07', currentSector: 'HIREFLEET', workshopStatus: '', assignedTo: 2
  },
  {
    id: 26, clientName: 'Clark', proclaim: '616007', postcode: 'CR0', model: 'Himalayan 452', category: 'B4M', contract: '4D', status: '', licenceType: 'FULL', routedDate: '16/07', confirmedDate: '16/07', swap: 'NO', vehicleInfo: 'Ready for handover', registration: 'LM24AAO', cyrusConfirmation: 'NO', referenceId: '616007', lastModifiedBy: 'Victor Junger', lastModifiedAt: '2024-07-21 16:30', tags: [{ text: 'Arrange collection', type: 'normal' }], group: 'Tuesday 16/07', currentSector: 'HIREFLEET', workshopStatus: 'RESERVED'
  },
  {
    id: 27, clientName: 'Lewis', proclaim: '617022', postcode: 'SM1', model: 'SH 125i', category: 'B2A', contract: '365', status: 'LOCK', licenceType: 'CBT', routedDate: '17/07', confirmedDate: '17/07', swap: 'YES', vehicleInfo: 'Client to call back', registration: 'LM24AAS', cyrusConfirmation: 'NO', referenceId: '617022', lastModifiedBy: 'Mike Johnson', lastModifiedAt: '2024-07-22 17:00', group: 'Wednesday 17/07', currentSector: 'HIREFLEET', workshopStatus: ''
  },
  {
    id: 28, clientName: 'King', proclaim: '617023', postcode: 'TN1', model: 'X-MAX 300', category: 'B3A', contract: '365', status: 'PIZZA', licenceType: 'EURO', routedDate: '17/07', confirmedDate: '17/07', swap: 'NO', vehicleInfo: 'Confirmed, awaiting driver', registration: 'LM24AAT', cyrusConfirmation: 'YES', referenceId: '617023', lastModifiedBy: 'Victor Junger', lastModifiedAt: '2024-07-22 17:30', group: 'Wednesday 17/07', currentSector: 'HIREFLEET', workshopStatus: 'RESERVED'
  },
  {
    id: 29, clientName: 'Baker', proclaim: '618033', postcode: 'ME1', model: 'Forza 350', category: 'B3A', contract: '4D', status: '', licenceType: 'FULL', routedDate: '18/07', confirmedDate: '18/07', swap: 'NO', vehicleInfo: 'Ready for handover', registration: 'LM24AAU', cyrusConfirmation: 'NO', referenceId: '618033', lastModifiedBy: 'Mike Johnson', lastModifiedAt: '2024-07-23 14:00', group: 'Thursday 18/07', currentSector: 'HIREFLEET', workshopStatus: 'RESERVED'
  },
  {
    id: 30, clientName: 'Allen', proclaim: '615529', postcode: 'SS1', model: 'NC 750X', category: 'B6M', contract: '4D', status: '', licenceType: 'FULL', routedDate: '15/07', confirmedDate: '', swap: 'NO', vehicleInfo: 'NC750X', registration: 'NC750XYZ', cyrusConfirmation: 'NO', referenceId: '615529', lastModifiedBy: 'PlannerBot', lastModifiedAt: '2024-07-19 14:05', tags: [{ text: 'High value vehicle', type: 'important' }], group: 'Monday 15/07', currentSector: 'WORKSHOP', workshopStatus: ''
  },
  {
    id: 31, clientName: 'Scott', proclaim: '618035', postcode: 'RH1', model: 'CB 125F', category: 'B2M', contract: '4D', status: 'LOCK', licenceType: 'CBT', routedDate: '18/07', confirmedDate: '18/07', swap: 'YES', vehicleInfo: 'Ready for handover', registration: 'LM24AAV', cyrusConfirmation: 'NO', referenceId: '618035', lastModifiedBy: 'Victor Junger', lastModifiedAt: '2024-07-23 15:00', group: 'Thursday 18/07', currentSector: 'HIREFLEET', workshopStatus: 'RESERVED'
  },
  {
    id: 32, clientName: 'Turner', proclaim: '619042', postcode: 'PO1', model: 'KTM 125', category: 'B2M', contract: '4D', status: '', licenceType: 'FULL', routedDate: '19/07', confirmedDate: '19/07', swap: 'NO', vehicleInfo: 'Confirmed', registration: 'LM24AAW', cyrusConfirmation: 'YES', referenceId: '619042', lastModifiedBy: 'Mike Johnson', lastModifiedAt: '2024-07-24 16:00', group: 'Friday 19/07', currentSector: 'HIREFLEET', workshopStatus: 'RESERVED'
  },
  {
    id: 33, clientName: 'Hill', proclaim: '619043', postcode: 'BN1', model: 'PCX 125', category: 'B2A', contract: '365', status: 'LOCK', licenceType: 'EURO', routedDate: '19/07', confirmedDate: '19/07', swap: 'NO', vehicleInfo: 'Awaiting Cyrus confirmation', registration: 'LM24AAX', cyrusConfirmation: 'NO', referenceId: '619043', lastModifiedBy: 'Victor Junger', lastModifiedAt: '2024-07-24 16:30', group: 'Friday 19/07', currentSector: 'HIREFLEET', workshopStatus: ''
  },
  {
    id: 34, clientName: 'Parker', proclaim: '619044', postcode: 'SO14', model: 'nmax 125', category: 'B2A', contract: '365', status: 'PIZZA', licenceType: 'CBT', routedDate: '19/07', confirmedDate: '19/07', swap: 'YES', vehicleInfo: 'Ready for handover', registration: 'LM24AAY', cyrusConfirmation: 'NO', referenceId: '619044', lastModifiedBy: 'Mike Johnson', lastModifiedAt: '2024-07-24 17:00', group: 'Friday 19/07', currentSector: 'HIREFLEET', workshopStatus: 'RESERVED'
  },
];


export const SECTOR_THEMES: Record<Sector, Record<string, string>> = {
  LOGISTICS: {
    name: 'indigo',
    text: 'text-indigo-300',
    border: 'border-indigo-400',
    bg: 'bg-indigo-600',
    hoverText: 'hover:text-indigo-300',
    hoverBorder: 'hover:border-indigo-500',
    ring: 'focus:ring-indigo-400',
  },
  WORKSHOP: {
    name: 'amber',
    text: 'text-amber-300',
    border: 'border-amber-400',
    bg: 'bg-amber-600',
    hoverText: 'hover:text-amber-300',
    hoverBorder: 'hover:border-amber-500',
    ring: 'focus:ring-amber-400',
  },
  HIREFLEET: {
    name: 'teal',
    text: 'text-teal-300',
    border: 'border-teal-400',
    bg: 'bg-teal-600',
    hoverText: 'hover:text-teal-300',
    hoverBorder: 'hover:border-teal-500',
    ring: 'focus:ring-teal-400',
  },
};

export const TAG_TYPE_THEMES: Record<TagType, { bg: string; text: string; border: string }> = {
  normal: { bg: 'bg-gray-600/50', text: 'text-gray-300', border: 'border-gray-500/50' },
  important: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30' },
  urgent: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30' },
};

export const MOCK_USERS: User[] = [
  { id: 1, name: 'Admin User', sector: 'LOGISTICS', role: 'admin', email: 'admin@cerberus.com', password: 'admin', phone: '00000 000000', theme: 'dark' },
  { id: 2, name: 'Victor Junger', sector: 'HIREFLEET', role: 'user', email: 'victor.junger@4th-d.co.uk', password: 'victor', phone: '01111 222222', theme: 'dark' },
  { id: 3, name: 'Workshop Supervisor', sector: 'WORKSHOP', role: 'supervisor', email: 'supervisor@cerberus.com', password: 'admin', phone: '01234 567890', theme: 'dark' },
  { id: 4, name: 'Joana Silva', sector: 'LOGISTICS', role: 'user', email: 'joana@cerberus.com', password: 'password', phone: '01234 567891', theme: 'dark' },
  { id: 5, name: 'Mike Johnson', sector: 'HIREFLEET', role: 'user', email: 'mike@cerberus.com', password: 'password', phone: '01234 567892', theme: 'dark' },
  { id: 6, name: 'Emily Carter', sector: 'LOGISTICS', role: 'supervisor', email: 'emily@cerberus.com', password: 'admin', phone: '01234 567893', theme: 'dark' },
];

export const MOCK_CHAT_MESSAGES: Record<Sector | 'ALL', ChatMessage[]> = {
  LOGISTICS: [
    { id: 1, user: MOCK_USERS[5], message: 'Morning team, please double check all postcodes for the Monday run.', timestamp: '09:05', channel: 'LOGISTICS' },
    { id: 2, user: MOCK_USERS[3], message: 'Will do, Emily. I see a new one for Diniz, I\'ll confirm it now.', timestamp: '09:07', channel: 'LOGISTICS' },
  ],
  WORKSHOP: [
    { id: 3, user: MOCK_USERS[2], message: 'The X-MAX for Khessar needs a topbox fitted, can someone pick that up?', timestamp: '10:20', channel: 'WORKSHOP' },
  ],
  HIREFLEET: [
    { id: 4, user: MOCK_USERS[4], message: 'Pereira has confirmed collection for the CBR600.', timestamp: '12:01', channel: 'HIREFLEET' },
    { id: 5, user: MOCK_USERS[4], message: 'RE: Demand #615603 for VIAU', timestamp: '12:05', channel: 'HIREFLEET', demandId: 4 },
  ],
  ALL: [
      { id: 101, user: MOCK_USERS[0], message: 'Welcome to the new general chat! Messages here are visible to all sectors.', timestamp: '08:00', channel: 'ALL' }
  ]
};

export const MOCK_HOME_PAGE_CONTENT: HomePageContent = {
  title: "Welcome back!",
  subtitle: "Your central hub for transport management and demand planning.",
  updates: [
    {
      id: 1,
      title: "New Feature: Full Login & History",
      date: "25th July 2024",
      content: "The app now features a full user login system, a profile page to manage your details, and a comprehensive History page to view completed demands.",
      color: "amber",
    },
    {
      id: 2,
      title: "Workshop Maintenance Schedule",
      date: "23rd July 2024",
      content: "Please be advised that the workshop will be undergoing scheduled maintenance this Friday. Plan your vehicle preparations accordingly. Check the new 'Stock' page to see vehicles currently in the workshop.",
      color: "teal",
    },
  ],
};