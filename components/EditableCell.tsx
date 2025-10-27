import React, { useState, useEffect, useRef } from 'react';
import type { DemandEntry } from '../types';

interface EditableCellProps {
  item: DemandEntry;
  field: keyof DemandEntry;
  onSave: (demandId: number, field: keyof DemandEntry, value: any) => void;
  editingCell: string | null;
  setEditingCell: (cell: string | null) => void;
  isEditable: boolean;
  type?: 'text' | 'date';
  placeholder?: string;
  transform?: 'uppercase';
}

export const EditableCell: React.FC<EditableCellProps> = ({ item, field, onSave, editingCell, setEditingCell, isEditable, type = 'text', placeholder, transform }) => {
  const cellId = `${item.id}-${field}`;
  const isEditing = editingCell === cellId;
  const initialValue = item[field] as string || '';
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  useEffect(() => {
    setValue(item[field] as string || '');
  }, [item, field]);

  const handleSave = () => {
    if (value !== initialValue) {
      let finalValue = value;
      if(type === 'date' && value){
          // Assuming the date input gives YYYY-MM-DD, convert to DD/MM
          const [year, month, day] = value.split('-');
          finalValue = `${day}/${month}`;
      }
      onSave(item.id, field, finalValue);
    }
    setEditingCell(null);
  };

  const handleDoubleClick = () => {
    if (isEditable) {
      if (type === 'date' && initialValue) {
        // convert dd/mm to yyyy-mm-dd for input
        const [day, month] = initialValue.split('/');
        const year = new Date().getFullYear(); // Assume current year
        setValue(`${year}-${month}-${day}`);
      }
      setEditingCell(cellId);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditingCell(null);}}
        className="w-full bg-[var(--background-hover)] border border-[var(--brand-ring)] rounded px-1 py-0.5 text-[var(--text-primary)] focus:outline-none"
      />
    );
  }

  const displayValue = transform === 'uppercase' ? (initialValue || '').toUpperCase() : initialValue;

  return (
    <span onDoubleClick={handleDoubleClick} className="w-full block cursor-pointer">
      {displayValue || placeholder || ''}
    </span>
  );
};