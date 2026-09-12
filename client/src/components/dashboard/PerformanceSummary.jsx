import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle, RefreshCw, AlertOctagon, Zap } from 'lucide-react';

export const PerformanceSummary = ({
  casesCount = 0,
  resolvedCount = 0,
  escalatedCount = 0,
  replannedCount = 0
}) => {
  const resolutionRate = casesCount > 0 ? Math.round((resolvedCount / casesCount) * 100) : 100;
  const recoveryRate = casesCount > 0 ? Math.round((replannedCount / casesCount) * 100) : 100;
  const escalationRate = casesCount > 0 ? Math.round((escalatedCount / casesCount) * 100) : 0;

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary-600" />
          <h2 className="text-sm font-semibold text-dark">Performance & Autonomous Recovery Metrics</h2>
        </div>
        <Badge variant="neutral">System Health</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-card-sm bg-surface-subtle border border-border space-y-2">
          <div className="flex items-center justify-between text-xs text-dark-muted font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Resolution Success
            </span>
            <span className="font-bold text-dark">{resolutionRate}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${resolutionRate}%` }} />
          </div>
          <p className="text-[11px] text-dark-muted">Verified autonomous closed-loop resolution</p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-card-sm bg-surface-subtle border border-border space-y-2">
          <div className="flex items-center justify-between text-xs text-dark-muted font-medium">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-primary-600" /> Recovery Rate
            </span>
            <span className="font-bold text-dark">{recoveryRate}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-primary-600 h-full rounded-full transition-all duration-500" style={{ width: `${recoveryRate}%` }} />
          </div>
          <p className="text-[11px] text-dark-muted">Successful replanning after simulated stock depletion</p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-card-sm bg-surface-subtle border border-border space-y-2">
          <div className="flex items-center justify-between text-xs text-dark-muted font-medium">
            <span className="flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-amber-500" /> Escalation Rate
            </span>
            <span className="font-bold text-dark">{escalationRate}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${escalationRate}%` }} />
          </div>
          <p className="text-[11px] text-dark-muted">Cases safely handed over for manual review</p>
        </div>
      </div>
    </Card>
  );
};
