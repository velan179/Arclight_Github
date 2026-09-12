import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { CasesPage } from './pages/CasesPage';
import { CreateCasePage } from './pages/CreateCasePage';
import { CaseDetailPage } from './pages/CaseDetailPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function App() {
  const getInitialRoute = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash === '/cases' || hash === '/cases/new' || hash.startsWith('/cases/')) {
      return hash;
    }
    return '/dashboard';
  };

  const [activeRoute, setActiveRoute] = useState(getInitialRoute);

  const handleNavigate = (route) => {
    setActiveRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveRoute(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderCurrentRoute = () => {
    if (activeRoute === '/dashboard') {
      return <Dashboard onNavigate={handleNavigate} />;
    }

    if (activeRoute === '/cases') {
      return <CasesPage onNavigate={handleNavigate} />;
    }

    if (activeRoute === '/cases/new') {
      return <CreateCasePage onNavigate={handleNavigate} />;
    }

    // Full Submodule 2 Route for /cases/:id
    if (activeRoute.startsWith('/cases/')) {
      const caseId = activeRoute.replace('/cases/', '');
      return <CaseDetailPage caseId={caseId} onNavigate={handleNavigate} />;
    }

    return <Dashboard onNavigate={handleNavigate} />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppLayout activeRoute={activeRoute} onNavigate={handleNavigate}>
          {renderCurrentRoute()}
        </AppLayout>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
