
import React from 'react';
import type { DemandEntry } from '../types';

interface InventorySummaryProps {
  data: DemandEntry[];
  theme: Record<string, string>;
}

interface HelmetSummary {
  [dateGroup: string]: {
    total: number;
    sizes: Record<string, number>;
  };
}

export const InventorySummary: React.FC<InventorySummaryProps> = ({ data, theme }) => {
  const summary = data.reduce<HelmetSummary>((acc, entry) => {
    const group = entry.group || 'Unscheduled';
    if (entry.helmet && entry.helmet.trim() !== '') {
      if (!acc[group]) {
        acc[group] = { total: 0, sizes: {} };
      }
      acc[group].total += 1;
      const size = entry.helmet.toUpperCase();
      acc[group].sizes[size] = (acc[group].sizes[size] || 0) + 1;
    }
    return acc;
  }, {});

  const sortedGroups = Object.keys(summary).sort((a, b) => {
    if (a === 'Unscheduled') return 1;
    if (b === 'Unscheduled') return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Helmet Request Summary</h2>
      {sortedGroups.length === 0 ? (
        <div className="text-center py-16">
            <p className="text-[var(--text-secondary)]">No helmets have been requested for the upcoming dates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedGroups.map(group => (
            <div key={group} className={`bg-[var(--background-primary)] border-l-4 ${theme.border} rounded-r-lg shadow-md p-6`}>
              <h3 className={`text-lg font-bold ${theme.text} mb-4`}>{group}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-[var(--border-primary)]">
                  <span className="text-[var(--text-secondary)] font-medium">Total Required:</span>
                  <span className="font-bold text-[var(--text-primary)] text-xl">{summary[group].total}</span>
                </div>
                <div>
                  <h4 className="text-[var(--text-secondary)] mb-2 font-medium">Breakdown by Size:</h4>
                  <ul className="space-y-1.5 pl-2">
                    {Object.entries(summary[group].sizes).sort(([a], [b]) => a.localeCompare(b)).map(([size, count]) => (
                      <li key={size} className="flex justify-between text-[var(--text-primary)]">
                        <span>{size}:</span>
                        <span className="font-mono bg-[var(--background-secondary)] px-2 rounded">{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};