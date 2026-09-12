import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { CasesPage } from './pages/CasesPage';
import { CreateCasePage } from './pages/CreateCasePage';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';
import { ArrowLeft, Clock } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function App() {
  // Sync initial route with window location hash or default to /dashboard
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

    // Future Submodule B placeholder route for /cases/:id
    if (activeRoute.startsWith('/cases/')) {
      const caseId = activeRoute.replace('/cases/', '');
      return (
        <Card className="max-w-2xl mx-auto space-y-6 text-center p-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <Button variant="ghost" size="sm" onClick={() => handleNavigate('/cases')}>
              <ArrowLeft className="w-4 h-4" />
              Back to Cases
            </Button>
            <Badge variant="purple">Submodule B Placeholder</Badge>
          </div>
          <div className="space-y-2 py-4">
            <div className="w-12 h-12 rounded-full bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-600 mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-dark">Case Detail Route ({caseId})</h2>
            <p className="text-xs text-dark-muted max-w-md mx-auto leading-relaxed">
              Case Detail, Agent Journey Timeline, Evidence & Decision Inspector, and Resolution Replay will be implemented in Submodule B.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => handleNavigate('/cases')}>
            Return to Case Management
          </Button>
        </Card>
      );
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
