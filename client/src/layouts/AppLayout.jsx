import { Bot, Shield, Layers, Activity, GitBranch } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-dark">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border/80 px-6 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-card-sm bg-primary-600 flex items-center justify-center text-white shadow-sm shadow-primary-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base tracking-tight text-dark">ResolveFlow</span>
                <Badge variant="purple">Autonomous Agent</Badge>
              </div>
              <p className="text-[11px] text-dark-muted font-medium">PS5 • Autonomous Customer Resolution</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-dark-secondary bg-surface-subtle px-3 py-1.5 rounded-card-sm border border-border">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Foundation Ready</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-dark-secondary bg-surface-subtle px-3 py-1.5 rounded-card-sm border border-border">
              <GitBranch className="w-3.5 h-3.5 text-primary-600" />
              <span>main (Frozen Contract)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-surface px-6 py-4 text-xs text-dark-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ResolveFlow — Closed-Loop Autonomous Customer Resolution Platform</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-primary-600" /> Deterministic Tools Source of Truth</span>
            <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-primary-600" /> 4 Coordinated Modules</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
