import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

export const AppLayout = ({ children, activeRoute = '/dashboard', onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const getPageTitle = (route) => {
    if (route === '/dashboard') return 'Dashboard & Live Agent Stream';
    if (route === '/cases') return 'Case Management';
    if (route === '/cases/new') return 'Create New Case';
    if (route.startsWith('/cases/')) return 'Case Details';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen flex bg-background text-dark font-sans antialiased overflow-x-hidden">
      {/* Navigation Sidebar */}
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={onNavigate}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          title={getPageTitle(activeRoute)}
          activeRoute={activeRoute}
          onNavigate={onNavigate}
          onOpenMobile={() => setMobileOpen(true)}
        />

        {/* Scrollable Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-surface px-6 py-4 text-xs text-dark-muted mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>ResolveFlow — Autonomous Customer Resolution Engine</span>
            <span>Member 1: Customer Experience & Case Management</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
