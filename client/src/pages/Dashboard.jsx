import { useCases } from '../hooks/useCases';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  Sparkles,
  RefreshCw,
  Cpu,
  Database,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Activity
} from 'lucide-react';

export const Dashboard = () => {
  const { data: cases, isLoading } = useCases();

  const modules = [
    {
      id: 1,
      title: 'Customer Experience & Case Management',
      member: 'Member 1',
      branch: 'feature/member-1-ui',
      path: 'client/',
      status: 'Ready for Dev',
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    {
      id: 2,
      title: 'Autonomous Agent & Replanning Engine',
      member: 'Member 2',
      branch: 'feature/member-2-agent',
      path: 'server/src/services/agent/',
      status: 'Ready for Dev',
      icon: Cpu,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    },
    {
      id: 3,
      title: 'Enterprise Intelligence & Evidence',
      member: 'Member 3',
      branch: 'feature/member-3-enterprise',
      path: 'server/src/models/ & services/',
      status: 'Ready for Dev',
      icon: Database,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      id: 4,
      title: 'Action Execution, Simulation & Verification',
      member: 'Member 4',
      branch: 'feature/member-4-actions',
      path: 'server/src/services/actions/',
      status: 'Ready for Dev',
      icon: ShieldCheck,
      color: 'text-violet-600 bg-violet-50 border-violet-200'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="card-apple bg-gradient-to-r from-surface via-primary-50/40 to-surface border border-primary-200/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-dark">
              Architecture Foundation Initialized
            </span>
            <Badge variant="success" className="animate-pulse">Active</Badge>
          </div>
          <p className="text-sm text-dark-secondary max-w-2xl">
            ResolveFlow common contracts, schemas, unified error handling, and Git feature branches are locked. Team members can begin isolated feature development according to the frozen specifications.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" size="sm" onClick={() => window.open('/docs/ARCHITECTURE.md', '_blank')}>
            <Terminal className="w-4 h-4" />
            Architecture Docs
          </Button>
          <Button variant="primary" size="sm" onClick={() => window.open('/docs/API.md', '_blank')}>
            <Activity className="w-4 h-4" />
            API Contract
          </Button>
        </div>
      </div>

      {/* 4 Team Module Ownership Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-dark">4 Team Module Boundaries</h2>
          <span className="text-xs text-dark-muted">No submodule division permitted</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.id} className="flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-card-sm border flex items-center justify-center ${m.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <Badge variant="purple">{m.member}</Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-dark leading-snug">{m.title}</h3>
                    <p className="text-xs font-mono text-dark-muted mt-1 truncate">{m.path}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-primary-700 font-medium">{m.branch}</span>
                  <Badge variant="neutral">{m.status}</Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Primary Demo Scenario Flow Showcase */}
      <Card className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div>
            <h2 className="text-base font-semibold text-dark">Primary Demo Flow: Autonomous Failure Recovery</h2>
            <p className="text-xs text-dark-muted mt-0.5">Laptop Damaged → Stock Depletion → Replan → Refund → Verify</p>
          </div>
          <Badge variant="purple">Hackathon Target Scenario</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-card-sm bg-surface-subtle border border-border space-y-1.5">
            <span className="text-[10px] font-semibold tracking-wide uppercase text-dark-muted">Step 1 • Goal</span>
            <p className="text-xs font-medium text-dark leading-tight">"My laptop arrived damaged. Replace it."</p>
          </div>
          <div className="p-3.5 rounded-card-sm bg-surface-subtle border border-border space-y-1.5">
            <span className="text-[10px] font-semibold tracking-wide uppercase text-dark-muted">Step 2 • Investigate</span>
            <p className="text-xs font-medium text-dark leading-tight">Order ord_5001 + 30-day damage policy verified</p>
          </div>
          <div className="p-3.5 rounded-card-sm bg-amber-50/70 border border-amber-200/80 space-y-1.5">
            <span className="text-[10px] font-semibold tracking-wide uppercase text-amber-700 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Step 3 • Failure
            </span>
            <p className="text-xs font-medium text-amber-900 leading-tight">Replacement stock = 0. Action fails.</p>
          </div>
          <div className="p-3.5 rounded-card-sm bg-purple-50/70 border border-primary-200/80 space-y-1.5">
            <span className="text-[10px] font-semibold tracking-wide uppercase text-primary-700 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Step 4 • Re-Plan
            </span>
            <p className="text-xs font-medium text-primary-900 leading-tight">Agent adapts: Swaps to full $1,999 refund</p>
          </div>
          <div className="p-3.5 rounded-card-sm bg-surface-subtle border border-border space-y-1.5">
            <span className="text-[10px] font-semibold tracking-wide uppercase text-dark-muted">Step 5 • Act & Verify</span>
            <p className="text-xs font-medium text-dark leading-tight">Refund recorded & DB state confirmed</p>
          </div>
          <div className="p-3.5 rounded-card-sm bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
            <span className="text-[10px] font-semibold tracking-wide uppercase text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Step 6 • Resolved
            </span>
            <p className="text-xs font-medium text-emerald-900 leading-tight">Case closed with full audit trail</p>
          </div>
        </div>
      </Card>

      {/* Case Management Shell */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-dark">Active Resolution Cases (Contract Shell)</h2>
            <p className="text-xs text-dark-muted">Fetched from API or contract-compliant mock fallback</p>
          </div>
          <Badge variant="neutral">{cases?.length || 0} Cases Recorded</Badge>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-dark-muted text-sm">Loading cases...</div>
        ) : (
          <div className="space-y-3">
            {cases?.map((c) => (
              <Card key={c.id} className="flex items-center justify-between py-4 hover:border-primary-300">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-dark">{c.caseNumber || c.id}</span>
                    <Badge variant={c.status === 'RESOLVED' ? 'success' : 'purple'}>
                      {c.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-dark-secondary">{c.customerGoal}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-dark-muted">
                  <span className="hidden sm:inline">Order: {c.orderId}</span>
                  <ArrowRight className="w-4 h-4 text-primary-600" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
