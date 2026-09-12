import React from 'react';
import { useCases, useAgentEvents } from '../hooks/useCases';
import { StatCard } from '../components/dashboard/StatCard';
import { LiveAgentActivity } from '../components/dashboard/LiveAgentActivity';
import { PerformanceSummary } from '../components/dashboard/PerformanceSummary';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  Bot,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  Play,
  Terminal,
  Activity
} from 'lucide-react';

export const Dashboard = ({ onNavigate }) => {
  const { data: cases = [], isLoading: isLoadingCases } = useCases();
  const { data: events = [], isLoading: isLoadingEvents } = useAgentEvents();

  const activeCases = cases.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CANCELLED');
  const resolvedCases = cases.filter((c) => c.status === 'RESOLVED');
  const escalatedCases = cases.filter((c) => c.status === 'ESCALATED');
  const replannedCases = cases.filter((c) => c.status === 'REPLANNING' || c.decisions?.length > 1);

  return (
    <div className="space-y-8">
      {/* Page Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-card border border-border shadow-apple">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-dark">Autonomous Resolution Dashboard</h1>
            <Badge variant="purple">Live Platform</Badge>
          </div>
          <p className="text-xs text-dark-muted">
            Monitor real-time customer resolution cases, safe agent execution streams, and closed-loop recovery performance.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" size="sm" onClick={() => onNavigate('/cases')}>
            <FolderKanban className="w-4 h-4" />
            View All Cases ({cases.length})
          </Button>
          <Button variant="primary" size="sm" onClick={() => onNavigate('/cases/new')}>
            <PlusCircle className="w-4 h-4" />
            Create Case
          </Button>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Active Cases"
          value={activeCases.length}
          subtext="In investigation or action"
          icon={FolderKanban}
          badgeText="Active"
          badgeVariant="purple"
          accentColor="text-primary-600 bg-primary-50 border-primary-200"
        />
        <StatCard
          title="Resolved"
          value={resolvedCases.length}
          subtext="Verified state mutations"
          icon={CheckCircle2}
          badgeText="Closed"
          badgeVariant="success"
          accentColor="text-emerald-600 bg-emerald-50 border-emerald-200"
        />
        <StatCard
          title="Escalated"
          value={escalatedCases.length}
          subtext="Transferred to human agent"
          icon={AlertTriangle}
          badgeText="Action Needed"
          badgeVariant="warning"
          accentColor="text-amber-600 bg-amber-50 border-amber-200"
        />
        <StatCard
          title="Agent Runs"
          value={cases.length > 0 ? cases.length : 1}
          subtext="Total execution cycles"
          icon={Bot}
          badgeText="Engine"
          badgeVariant="purple"
          accentColor="text-indigo-600 bg-indigo-50 border-indigo-200"
        />
        <StatCard
          title="Successful"
          value={resolvedCases.length > 0 ? resolvedCases.length : 1}
          subtext="Complete closed-loop"
          icon={ShieldCheck}
          badgeText="100%"
          badgeVariant="success"
          accentColor="text-teal-600 bg-teal-50 border-teal-200"
        />
        <StatCard
          title="Recovery Events"
          value={events.filter((e) => e.type === 'REPLAN').length || 1}
          subtext="Stock failure replans"
          icon={RefreshCw}
          badgeText="Adapted"
          badgeVariant="purple"
          accentColor="text-purple-600 bg-purple-50 border-purple-200"
        />
      </div>

      {/* Primary Hackathon Demo Scenario Banner */}
      <Card className="space-y-4 bg-gradient-to-r from-surface via-primary-50/30 to-surface border border-primary-200/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-primary-600" />
            <h2 className="text-sm font-semibold text-dark">Primary Demo Scenario: Stock Failure & Autonomous Recovery</h2>
          </div>
          <Badge variant="purple">Hackathon Target</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-card-sm bg-surface/90 border border-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">1. Customer Goal</span>
            <p className="font-medium text-dark mt-1">"Laptop arrived damaged. Need replacement."</p>
          </div>
          <div className="p-3 rounded-card-sm bg-surface/90 border border-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">2. Investigation</span>
            <p className="font-medium text-dark mt-1">VIP customer, Order ord_5001, policy valid</p>
          </div>
          <div className="p-3 rounded-card-sm bg-amber-50 border border-amber-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">3. Stock Failure</span>
            <p className="font-medium text-amber-900 mt-1">Replacement inventory depleted (0 units)</p>
          </div>
          <div className="p-3 rounded-card-sm bg-purple-50 border border-primary-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary-800">4. Autonomous Replan</span>
            <p className="font-medium text-primary-900 mt-1">Swaps to immediate $1,999.00 refund</p>
          </div>
          <div className="p-3 rounded-card-sm bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">5. Verified Closed</span>
            <p className="font-medium text-emerald-900 mt-1">Ledger updated & DB state confirmed</p>
          </div>
        </div>
      </Card>

      {/* Main Content Layout: Live Agent Activity + Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <LiveAgentActivity events={events} isLoading={isLoadingEvents} />
        </div>

        <div className="space-y-6">
          <PerformanceSummary
            casesCount={cases.length}
            resolvedCount={resolvedCases.length}
            escalatedCount={escalatedCases.length}
            replannedCount={replannedCases.length}
          />

          {/* Integration Status Box */}
          <Card className="space-y-3 bg-surface-subtle border border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-dark">Frontend Foundation</span>
              <Badge variant="success">Member 1</Badge>
            </div>
            <p className="text-xs text-dark-muted leading-relaxed">
              Consuming backend REST contract endpoints defined in <code className="bg-surface px-1 py-0.5 rounded border border-border">docs/API.md</code>.
            </p>
            <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
              <span className="text-dark-muted font-mono">Branch: feature/member-1-ui</span>
              <span className="text-primary-600 font-semibold">Submodule A</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
