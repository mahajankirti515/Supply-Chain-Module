import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalFilterContextType {
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
  dateRange: { from: string; to: string };
  setDateRange: (range: { from: string; to: string }) => void;
  dateRangePreset: 'today' | 'week' | 'month' | 'year' | 'custom';
  setDateRangePreset: (preset: 'today' | 'week' | 'month' | 'year' | 'custom') => void;
}

const GlobalFilterContext = createContext<GlobalFilterContextType | undefined>(undefined);

export function GlobalFilterProvider({ children }: { children: ReactNode }) {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [dateRangePreset, setDateRangePreset] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of month
    to: new Date().toISOString().split('T')[0], // Today
  });

  return (
    <GlobalFilterContext.Provider
      value={{
        selectedBranch,
        setSelectedBranch,
        dateRange,
        setDateRange,
        dateRangePreset,
        setDateRangePreset,
      }}
    >
      {children}
    </GlobalFilterContext.Provider>
  );
}

export function useGlobalFilter() {
  const context = useContext(GlobalFilterContext);
  if (!context) {
    throw new Error('useGlobalFilter must be used within a GlobalFilterProvider');
  }
  return context;
}