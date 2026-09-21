import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext(null);

export const initialFilters = {
  client_id: 'ALL',
  portfolio_id: 'ALL',
  asset_class: 'ALL',
  region: 'ALL',
  country: 'ALL',
  risk_profile: 'ALL',
  benchmark: 'ALL',
  start_date: '2021-01-31',
  end_date: '2026-02-28'
};

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(initialFilters);
  const [demoMode, setDemoMode] = useState(false);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setDemoMode(false);
  };

  const runDemoScenario = () => {
    setDemoMode(true);
    setFilters({
      client_id: 'CLT-1005', // Atlas Sovereign Fund
      portfolio_id: 'ALL',
      asset_class: 'ALL',
      region: 'Middle East',
      country: 'UAE',
      risk_profile: 'Moderate',
      benchmark: 'ALL',
      start_date: '2021-01-31',
      end_date: '2026-02-28'
    });
  };

  return (
    <FilterContext.Provider value={{
      filters,
      setFilters,
      updateFilter,
      clearFilters,
      demoMode,
      setDemoMode,
      runDemoScenario
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
