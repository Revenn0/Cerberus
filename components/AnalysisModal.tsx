import React, { useState } from 'react';
import { analyzeFleetDemand } from '../services/geminiService';
import type { DemandEntry, Vehicle } from '../types';
import { SECTOR_THEMES } from '../constants';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  demands: DemandEntry[];
  stock: Vehicle[];
}

const SparklesIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
  </svg>
);

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, demands, stock }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeFleetDemand(demands, stock);
      setAnalysis(result);
    } catch (err) {
      setAnalysis("Error generating analysis.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to format Markdown-like bolding simply
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
        if (line.startsWith('## ')) return <h3 key={i} className="text-xl font-bold text-[var(--brand-text)] mt-4 mb-2">{line.replace('## ', '')}</h3>;
        if (line.startsWith('### ')) return <h4 key={i} className="text-lg font-bold text-[var(--text-primary)] mt-3 mb-1">{line.replace('### ', '')}</h4>;
        if (line.trim().startsWith('- ')) return <li key={i} className="ml-4 list-disc text-[var(--text-secondary)]">{line.replace('- ', '')}</li>;
        // Bold replacement
        const parts = line.split('**');
        return (
            <p key={i} className="mb-2 text-[var(--text-primary)]">
                {parts.map((part, index) => 
                    index % 2 === 1 ? <strong key={index} className="text-[var(--brand-text)]">{part}</strong> : part
                )}
            </p>
        );
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[var(--background-primary)] rounded-xl shadow-2xl w-full max-w-2xl border border-[var(--border-primary)] m-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-[var(--border-primary)] flex justify-between items-center bg-[var(--background-secondary-translucent)] rounded-t-xl">
          <div className="flex items-center gap-3">
             <div className="bg-purple-600 p-2 rounded-lg text-white">
                <SparklesIcon className="w-6 h-6" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Cerberus AI Analysis</h2>
                <p className="text-xs text-[var(--text-secondary)]">Intelligent Fleet & Demand Optimization</p>
             </div>
          </div>
          <button onClick={onClose} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] text-2xl">&times;</button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          {!analysis && !loading && (
            <div className="text-center py-10 space-y-6">
                <p className="text-[var(--text-secondary)]">
                    Cerberus can analyze current demand vs. stock levels to identify bottlenecks, 
                    prioritize workshop tasks, and suggest routing improvements.
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm text-[var(--text-tertiary)] mb-8">
                    <div className="bg-[var(--background-tertiary)] p-3 rounded-lg border border-[var(--border-secondary)]">
                        <span className="block font-bold text-[var(--text-primary)] mb-1">Bottlenecks</span>
                        Find sector delays
                    </div>
                     <div className="bg-[var(--background-tertiary)] p-3 rounded-lg border border-[var(--border-secondary)]">
                        <span className="block font-bold text-[var(--text-primary)] mb-1">Stock</span>
                        Prevent shortages
                    </div>
                     <div className="bg-[var(--background-tertiary)] p-3 rounded-lg border border-[var(--border-secondary)]">
                        <span className="block font-bold text-[var(--text-primary)] mb-1">Priority</span>
                        Urgent task list
                    </div>
                </div>
                <button 
                    onClick={handleAnalyze} 
                    className="px-6 py-3 bg-[var(--brand-bg)] text-white rounded-lg font-bold hover:opacity-90 transition-all shadow-lg flex items-center gap-2 mx-auto"
                >
                    <SparklesIcon />
                    Generate Report
                </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-[var(--brand-bg)] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[var(--brand-text)] font-mono animate-pulse">Analyzing neural vectors...</p>
            </div>
          )}

          {analysis && !loading && (
            <div className="space-y-4 animate-fade-in-out" style={{animationDuration: '0.5s'}}>
                {formatText(analysis)}
                
                <div className="mt-8 pt-4 border-t border-[var(--border-secondary)] flex justify-end">
                    <button onClick={handleAnalyze} className="text-sm text-[var(--brand-text)] hover:underline flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                        Regenerate
                    </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};