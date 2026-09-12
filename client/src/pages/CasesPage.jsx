import React, { useState } from 'react';
import { useCases } from '../hooks/useCases';
import { CaseFilters } from '../components/cases/CaseFilters';
import { CaseTable } from '../components/cases/CaseTable';
import { CaseCard } from '../components/cases/CaseCard';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { PlusCircle, FolderKanban } from 'lucide-react';

export const CasesPage = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: cases = [],
    isLoading,
    isError,
    error,
    refetch
  } = useCases({
    status: activeFilter,
    search: searchQuery
  });

  const handleViewCase = (caseId) => {
    onNavigate(`/cases/${caseId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-card border border-border shadow-apple">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-primary-600" />
            <h1 className="text-xl font-bold tracking-tight text-dark">Case Management</h1>
          </div>
          <p className="text-xs text-dark-muted">
            Track customer complaints, active investigation states, autonomous replanning pathways, and closed resolutions.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => onNavigate('/cases/new')}>
          <PlusCircle className="w-4 h-4" />
          Create New Case
        </Button>
      </div>

      {/* Filters & Search */}
      <CaseFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Content Rendering (Loading / Error / Empty / Data) */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Failed to load cases"
          message={error?.message || 'Unable to retrieve case records from the server.'}
          onRetry={refetch}
        />
      ) : cases.length === 0 ? (
        <EmptyState
          title="No customer cases found"
          description={
            searchQuery || activeFilter !== 'ALL'
              ? 'No cases match your current filter or search criteria. Try resetting filters.'
              : 'No resolution cases exist in the database yet. Create your first case to test the autonomous engine.'
          }
          actionLabel="Create New Case"
          onAction={() => onNavigate('/cases/new')}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <CaseTable cases={cases} onViewCase={handleViewCase} />
          </div>

          {/* Mobile Card Grid View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {cases.map((c) => (
              <CaseCard key={c.id} caseItem={c} onViewCase={handleViewCase} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
