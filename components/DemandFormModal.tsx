
import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { DemandEntry, Sector, CreateDemandFormData, TagType, Tag, Vehicle } from '../types';
import { BIKE_MODELS, DEMAND_STATUSES, LICENCE_TYPES, SWAP_OPTIONS, SECTOR_THEMES, TAG_TYPE_THEMES } from '../constants';

interface DemandFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialData?: DemandEntry;
  onClose: () => void;
  onSave: (data: Partial<DemandEntry>) => void;
  activeSector: Sector;
  theme: Record<string, string>;
  vehicleStock: Vehicle[];
}

const initialFormState: CreateDemandFormData = {
  clientName: '', proclaim: '', postcode: '', model: '', category: '', contract: '',
  status: '', helmet: '', licenceType: 'CBT', routedDate: '', confirmedDate: '',
  swap: 'NO', vehicleInfo: '', registration: '', cyrusConfirmation: 'NO', tags: []
};

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className={`bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md w-full px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)] disabled:opacity-50 disabled:cursor-not-allowed`} />
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, ...props }) => (
  <select {...props} className={`bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md w-full px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)] disabled:opacity-50 disabled:cursor-not-allowed`}>{children}</select>
);

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{label}</label>
        {children}
    </div>
);

export const DemandFormModal: React.FC<DemandFormModalProps> = ({ isOpen, mode, initialData, onClose, onSave, activeSector, theme, vehicleStock }) => {
  const [formData, setFormData] = useState<Partial<DemandEntry>>(initialFormState);
  const [tagInput, setTagInput] = useState('');
  const [tagType, setTagType] = useState<TagType>('normal');
  
  const [registrationQuery, setRegistrationQuery] = useState('');
  const [registrationSuggestions, setRegistrationSuggestions] = useState<Vehicle[]>([]);
  const [showRegistrationSuggestions, setShowRegistrationSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);

  const availableVehicles = useMemo(() => activeSector === 'WORKSHOP' ? vehicleStock : vehicleStock.filter(v => v.status === 'available'), [vehicleStock, activeSector]);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({ ...initialData, tags: initialData.tags ? [...initialData.tags] : [] });
        setRegistrationQuery(initialData.registration || '');
      } else {
        setFormData(initialFormState);
        setRegistrationQuery('');
      }
      setTagInput('');
      setTagType('normal');
      setShowRegistrationSuggestions(false);
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setRegistrationQuery(query);
    
    // Clear model if user changes registration, forcing them to re-select
    setFormData(prev => ({...prev, registration: '', model: ''}));

    if (query) {
      const filtered = availableVehicles.filter(v => 
        v.registration.toLowerCase().includes(query.toLowerCase()) || 
        v.model.toLowerCase().includes(query.toLowerCase())
      );
      setRegistrationSuggestions(filtered);
      setShowRegistrationSuggestions(filtered.length > 0);
      setSuggestionIndex(0);
    } else {
      setShowRegistrationSuggestions(false);
    }
  };

  const handleRegistrationSelect = (vehicle: Vehicle) => {
    setRegistrationQuery(vehicle.registration);
    setFormData(prev => ({...prev, registration: vehicle.registration, model: vehicle.model}));
    setShowRegistrationSuggestions(false);
  };
  
  const handleRegistrationKeyDown = (e: React.KeyboardEvent) => {
    if (showRegistrationSuggestions && registrationSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionIndex(prev => (prev + 1) % registrationSuggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionIndex(prev => (prev - 1 + registrationSuggestions.length) % registrationSuggestions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (suggestionIndex >= 0) {
          handleRegistrationSelect(registrationSuggestions[suggestionIndex]);
        }
      } else if (e.key === 'Escape') {
        setShowRegistrationSuggestions(false);
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() === '') return;
    const newTag: Tag = { text: tagInput.trim(), type: tagType };
    setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), newTag] }));
    setTagInput('');
    setTagType('normal');
  };

  const handleRemoveTag = (tagText: string) => {
    setFormData(prev => ({...prev, tags: prev.tags?.filter(t => t.text !== tagText) }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'create' && (!formData.model || !formData.registration)) {
      alert('Please select a valid vehicle from the suggestions list.');
      return;
    }
    onSave(formData);
  };
  
  const isFieldEditable = (sector: Sector) => activeSector === sector;
  const isTagSectionDisabled = mode === 'edit' && activeSector !== formData.currentSector;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[var(--background-primary)] p-8 rounded-xl shadow-2xl w-full max-w-4xl border border-[var(--border-primary)] m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">{mode === 'create' ? 'Create New Demand' : `Editing Demand #${initialData?.proclaim}`}</h2>
        <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto pr-4 -mr-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* --- Logistics Fields --- */}
            <FormField label="Client Name"><FormInput name="clientName" value={formData.clientName || ''} onChange={handleChange} required disabled={mode === 'edit' && !isFieldEditable('LOGISTICS')} /></FormField>
            <FormField label="Proclaim"><FormInput name="proclaim" value={formData.proclaim || ''} onChange={handleChange} required disabled={mode === 'edit' && !isFieldEditable('LOGISTICS')} /></FormField>
            <FormField label="Postcode"><FormInput name="postcode" value={formData.postcode || ''} onChange={handleChange} required disabled={mode === 'edit' && !isFieldEditable('LOGISTICS')} minLength={6} maxLength={8} title="Postcode must be between 6 and 8 characters." /></FormField>
            
            {mode === 'create' ? (
              <FormField label="Registration (Available Bikes)">
                <div className="relative">
                  <FormInput 
                    name="registrationQuery" 
                    value={registrationQuery} 
                    onChange={handleRegistrationChange} 
                    onKeyDown={handleRegistrationKeyDown} 
                    placeholder="Type to search registration..." 
                    autoComplete="off" 
                    required={!formData.registration} 
                  />
                  {showRegistrationSuggestions && (
                    <div className="absolute z-10 w-full bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                      <ul>
                        {registrationSuggestions.map((vehicle, index) => (
                          <li key={vehicle.id}>
                            <button
                              type="button"
                              onClick={() => handleRegistrationSelect(vehicle)}
                              className={`w-full text-left p-3 hover:bg-[var(--background-hover)] ${index === suggestionIndex ? 'bg-[var(--background-hover)]' : ''}`}
                            >
                              <span className="font-bold text-[var(--text-primary)]">{vehicle.registration}</span>
                              <span className="ml-2 text-sm text-[var(--text-secondary)]">{vehicle.model}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </FormField>
            ) : (
                <FormField label="Registration"><FormInput value={formData.registration || ''} disabled /></FormField>
            )}

            <FormField label="Model of Bike"><FormInput name="model" value={formData.model || ''} required disabled /></FormField>
            
            <FormField label="Category"><FormInput name="category" value={formData.category || ''} onChange={handleChange} disabled={mode === 'edit' && !isFieldEditable('LOGISTICS')} /></FormField>
            <FormField label="Contract"><FormInput name="contract" value={formData.contract || ''} onChange={handleChange} disabled={mode === 'edit' && !isFieldEditable('LOGISTICS')} /></FormField>
            <FormField label="Licence Type"><FormSelect name="licenceType" value={formData.licenceType || ''} onChange={handleChange} disabled={mode === 'edit' && !isFieldEditable('LOGISTICS')}><option value="">Select Licence</option>{LICENCE_TYPES.map(l => <option key={l} value={l}>{l}</option>)}</FormSelect></FormField>
            <FormField label="Swap"><FormSelect name="swap" value={formData.swap || 'NO'} onChange={handleChange} disabled={mode === 'edit' && !isFieldEditable('LOGISTICS')}><option value="">Select Option</option>{SWAP_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}</FormSelect></FormField>
            <FormField label="Status"><FormSelect name="status" value={formData.status || ''} onChange={handleChange} disabled={mode === 'edit' && !isFieldEditable('LOGISTICS')}><option value="">Select Status</option>{DEMAND_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</FormSelect></FormField>
            <FormField label="Helmet Size"><FormInput name="helmet" value={formData.helmet || ''} onChange={handleChange} placeholder="e.g. S&M, L, XL" disabled={mode === 'edit' && !isFieldEditable('LOGISTICS')} /></FormField>
            <FormField label="Routed Date"><FormInput type="text" name="routedDate" value={formData.routedDate || ''} onChange={handleChange} placeholder="dd/mm" disabled={mode === 'edit' && !isFieldEditable('LOGISTICS')} /></FormField>
            <FormField label="Confirmed Date"><FormInput type="text" name="confirmedDate" value={formData.confirmedDate || ''} onChange={handleChange} placeholder="dd/mm" disabled={mode === 'edit' && !isFieldEditable('LOGISTICS')} /></FormField>
            
            {/* --- Workshop Fields --- */}
            <div className="md:col-span-3 border-t border-[var(--border-primary)] my-2"></div>
            <h3 className="md:col-span-3 text-lg font-semibold" style={{color: SECTOR_THEMES.WORKSHOP.text.replace('text-','').split('-')[0]}}>Workshop Info</h3>
            <FormField label="Vehicle Info"><FormInput name="vehicleInfo" value={formData.vehicleInfo || ''} onChange={handleChange} disabled={mode === 'edit' && !isFieldEditable('WORKSHOP')} /></FormField>
            
            {/* --- Hirefleet Fields --- */}
            <div className="md:col-span-3 border-t border-[var(--border-primary)] my-2"></div>
            <h3 className="md:col-span-3 text-lg font-semibold" style={{color: SECTOR_THEMES.HIREFLEET.text.replace('text-','').split('-')[0]}}>Hirefleet Info</h3>
            <FormField label="Cyrus Confirmation"><FormSelect name="cyrusConfirmation" value={formData.cyrusConfirmation || 'NO'} onChange={handleChange} disabled={mode === 'edit' && !isFieldEditable('HIREFLEET')}><option value="NO">NO</option><option value="YES">YES</option></FormSelect></FormField>

            {/* --- Tags --- */}
            <div className="md:col-span-3 border-t border-[var(--border-primary)] my-2"></div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Tags</label>
              <div className="flex gap-2">
                <FormInput name="tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="e.g. Needs Topbox" disabled={isTagSectionDisabled} />
                <FormSelect name="tagType" value={tagType} onChange={(e) => setTagType(e.target.value as TagType)} disabled={isTagSectionDisabled}>
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </FormSelect>
                <button type="button" onClick={handleAddTag} className="px-4 py-2 rounded-md bg-[var(--brand-bg)] text-white font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={isTagSectionDisabled}>Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags?.map(tag => {
                  const tagTheme = TAG_TYPE_THEMES[tag.type];
                  return (
                    <span key={tag.text} className={`flex items-center gap-2 ${tagTheme.bg} ${tagTheme.text} ${tagTheme.border} text-xs font-medium px-2.5 py-1 rounded-full border`}>
                      {tag.text}
                      <button type="button" onClick={() => handleRemoveTag(tag.text)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-50" disabled={isTagSectionDisabled}>&times;</button>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-md text-[var(--text-primary)] bg-[var(--background-secondary-translucent)] hover:bg-[var(--background-hover)] transition-colors font-semibold">Cancel</button>
            <button type="submit" className={`px-5 py-2.5 rounded-md ${theme.bg} text-white font-semibold hover:opacity-90 transition-opacity`}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};