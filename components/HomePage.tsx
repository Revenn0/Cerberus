
import React, { useState } from 'react';
import type { User, HomePageContent, UpdateItem } from '../types';

interface HomePageProps {
  user: User;
  content: HomePageContent;
  onUpdateContent: (newContent: HomePageContent) => void;
}

const colorClasses: Record<string, string> = {
  amber: 'text-amber-300',
  teal: 'text-teal-300',
  indigo: 'text-indigo-300',
  red: 'text-red-300',
  green: 'text-green-300',
};

export const HomePage: React.FC<HomePageProps> = ({ user, content, onUpdateContent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState<HomePageContent>(JSON.parse(JSON.stringify(content))); // Deep copy

  const handleEditToggle = () => {
    if (isEditing) {
      // cancel
      setEditableContent(JSON.parse(JSON.stringify(content)));
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    onUpdateContent(editableContent);
    setIsEditing(false);
  };

  const handleContentChange = (field: 'title' | 'subtitle', value: string) => {
    setEditableContent(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateItemChange = (id: number, field: keyof UpdateItem, value: string) => {
    setEditableContent(prev => ({
      ...prev,
      updates: prev.updates.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };
  
  const handleRemoveItem = (id: number) => {
    setEditableContent(prev => ({
        ...prev,
        updates: prev.updates.filter(item => item.id !== id)
    }));
  };

  const handleAddItem = () => {
    const newItem: UpdateItem = {
        id: Date.now(),
        title: 'New Announcement',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'}),
        content: 'Enter your announcement details here.',
        color: 'indigo'
    };
    setEditableContent(prev => ({ ...prev, updates: [...prev.updates, newItem] }));
  };

  const currentContent = isEditing ? editableContent : content;
  const welcomeTitle = currentContent.title.replace('!', `, ${user.name.split(' ')[0]}!`);

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-[var(--text-primary)] flex-1">
      <div className="max-w-4xl mx-auto">
        {user.role === 'admin' && (
          <div className="flex justify-end gap-4 mb-4">
            {isEditing ? (
              <>
                <button onClick={handleEditToggle} className="px-4 py-2 rounded-lg font-semibold text-[var(--text-primary)] bg-[var(--background-secondary)] hover:bg-[var(--background-hover)] transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors">Save Changes</button>
              </>
            ) : (
              <button onClick={handleEditToggle} className="px-4 py-2 rounded-lg font-semibold text-white bg-[var(--brand-bg)] hover:opacity-90 transition-all">Edit Page</button>
            )}
          </div>
        )}
        <div className="bg-[var(--background-primary-translucent)] backdrop-blur-sm border border-[var(--border-primary-translucent)] shadow-2xl rounded-xl p-8">
          {isEditing ? (
            <>
              <input type="text" value={currentContent.title} onChange={(e) => handleContentChange('title', e.target.value)} className="text-4xl font-bold bg-transparent border-b-2 border-dashed border-[var(--brand-ring)] w-full mb-4 focus:outline-none" />
              <textarea value={currentContent.subtitle} onChange={(e) => handleContentChange('subtitle', e.target.value)} className="text-lg bg-transparent border-b-2 border-dashed border-[var(--border-secondary)] w-full mb-6 focus:outline-none h-20 resize-none" />
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-[var(--brand-text)] mb-4">{welcomeTitle}</h1>
              <p className="text-lg text-[var(--text-secondary)] mb-6">{currentContent.subtitle}</p>
            </>
          )}

          <div className="border-t border-[var(--border-primary)] pt-6">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Company News & Updates</h2>
            <div className="space-y-6">
              {currentContent.updates.map(item => (
                <div key={item.id} className="bg-[var(--background-secondary-translucent)] p-6 rounded-lg relative">
                  {isEditing ? (
                    <div className="space-y-2">
                      <button onClick={() => handleRemoveItem(item.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-300 font-bold text-lg">&times;</button>
                      <input type="text" value={item.title} onChange={(e) => handleUpdateItemChange(item.id, 'title', e.target.value)} className={`text-xl font-bold bg-transparent border-b border-dashed w-full focus:outline-none ${colorClasses[item.color] || 'text-white'}`} />
                      <input type="text" value={item.date} onChange={(e) => handleUpdateItemChange(item.id, 'date', e.target.value)} className="text-[var(--text-tertiary)] text-sm mb-2 bg-transparent border-b border-dashed w-full focus:outline-none" />
                      <textarea value={item.content} onChange={(e) => handleUpdateItemChange(item.id, 'content', e.target.value)} className="text-[var(--text-secondary)] bg-transparent w-full focus:outline-none h-24 resize-none" />
                    </div>
                  ) : (
                    <>
                      <h3 className={`text-xl font-bold ${colorClasses[item.color] || 'text-white'}`}>{item.title}</h3>
                      <p className="text-[var(--text-tertiary)] text-sm mb-2">{item.date}</p>
                      <p className="text-[var(--text-secondary)]">{item.content}</p>
                    </>
                  )}
                </div>
              ))}
              {isEditing && (
                 <button onClick={handleAddItem} className="w-full text-center py-4 border-2 border-dashed border-[var(--border-secondary)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--background-hover)] hover:border-[var(--brand-ring)] hover:text-[var(--text-primary)] transition-all">
                    + Add Announcement
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
