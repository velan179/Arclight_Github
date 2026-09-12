import React from 'react';
import { LayoutDashboard, FolderKanban, PlusCircle, Bot, X } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

export const Sidebar = ({ activeRoute, onNavigate, mobileOpen, onCloseMobile }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Case Management', route: '/cases', icon: FolderKanban },
    { id: 'new-case', label: 'Create New Case', route: '/cases/new', icon: PlusCircle, highlight: true }
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 space-y-6">
      {/* Brand & Module Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-card-sm bg-primary-600 flex items-center justify-center text-white shadow-sm shadow-primary-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-dark">ResolveFlow</span>
                <Badge variant="purple" className="text-[10px]">AI Engine</Badge>
              </div>
              <p className="text-[11px] text-dark-muted font-medium">Enterprise Autonomous Agent</p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-dark-muted hover:text-dark hover:bg-surface-subtle"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-dark-muted mb-2">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.route || (item.route !== '/dashboard' && activeRoute.startsWith(item.route));

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.route);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-card-sm text-xs font-medium transition-all text-left',
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold border border-primary-200/80 shadow-sm'
                    : item.highlight
                    ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow'
                    : 'text-dark-secondary hover:bg-surface-subtle hover:text-dark'
                )}
              >
                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-primary-600' : item.highlight ? 'text-white' : 'text-dark-muted')} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Member 1 Badge */}
      <div className="p-3 bg-surface-subtle border border-border rounded-card-sm space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-dark">Member 1 Scope</span>
          <Badge variant="success" className="text-[10px]">Active</Badge>
        </div>
        <p className="text-[10px] text-dark-muted leading-tight">
          Frontend Foundation • Dashboard • Case Management
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-surface border-r border-border min-h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-dark/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-full bg-surface shadow-2xl z-10 flex flex-col h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
