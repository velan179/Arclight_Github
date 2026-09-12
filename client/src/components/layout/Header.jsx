import React from 'react';
import { Menu, Plus, Activity, GitBranch } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const Header = ({ title, activeRoute, onNavigate, onOpenMobile }) => {
  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border px-4 md:px-6 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobile}
            className="lg:hidden p-2 rounded-card-sm text-dark-secondary hover:bg-surface-subtle border border-border"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base md:text-lg font-bold tracking-tight text-dark leading-tight">
              {title || 'Dashboard'}
            </h1>
            <p className="text-[11px] text-dark-muted hidden sm:block">
              ResolveFlow • Autonomous Customer Resolution Engine
            </p>
          </div>
        </div>

        {/* Right: Quick Status & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-dark-secondary bg-surface-subtle px-3 py-1.5 rounded-card-sm border border-border">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Closed-Loop Engine</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-dark-secondary bg-surface-subtle px-3 py-1.5 rounded-card-sm border border-border">
            <GitBranch className="w-3.5 h-3.5 text-primary-600" />
            <span>Submodule A</span>
          </div>

          {activeRoute !== '/cases/new' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('/cases/new')}
              className="shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Case</span>
              <span className="sm:hidden">New</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
