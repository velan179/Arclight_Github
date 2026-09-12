import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '../../utils/cn';

export const CaseFilters = ({
  activeFilter = 'ALL',
  onFilterChange,
  searchQuery = '',
  onSearchChange
}) => {
  const filterTabs = [
    { id: 'ALL', label: 'All Cases' },
    { id: 'INVESTIGATING', label: 'Investigating' },
    { id: 'REPLANNING', label: 'Replanning' },
    { id: 'RESOLVED', label: 'Resolved' },
    { id: 'ESCALATED', label: 'Escalated' }
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-surface p-4 rounded-card border border-border shadow-sm">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-card-sm text-xs font-medium whitespace-nowrap transition-all',
                isActive
                  ? 'bg-primary-600 text-white shadow-xs font-semibold'
                  : 'text-dark-secondary hover:bg-surface-subtle hover:text-dark'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-72">
        <Search className="w-4 h-4 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by customer, order, goal..."
          className="w-full pl-9 pr-3 py-1.5 bg-surface-subtle text-dark text-xs border border-border rounded-card-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder:text-dark-muted transition-all"
        />
      </div>
    </div>
  );
};
