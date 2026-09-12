import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { GitBranch, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const DecisionHistory = ({ decisions = [] }) => {
  const defaultDecisions = [
    {
      step: 1,
      title: 'Initial Planned Pathway: Replacement Unit',
      summary: 'Customer requested replacement for damaged laptop. Policy pol_damaged_item authorizes item replacement.',
      status: 'FAILED',
      reason: 'Mutation failed with INSUFFICIENT_STOCK (0 units available)'
    },
    {
      step: 2,
      title: 'Autonomous Re-Planned Pathway: Immediate Full Refund',
      summary: 'Agent observed stock failure. Evaluated alternate policy recovery: Execute immediate $1,999.00 full monetary refund.',
      status: 'SUCCESS',
      reason: 'Full refund credited to ledger and verified in MongoDB'
    }
  ];

  const list = decisions.length > 0 ? decisions : defaultDecisions;

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-primary-600" />
          <h2 className="text-sm font-bold text-dark">Decision Rationale & Replanning History</h2>
        </div>
        <Badge variant="purple">Replanning Engine</Badge>
      </div>

      <div className="space-y-3">
        {list.map((item, idx) => {
          const isSuccess = item.status === 'SUCCESS';
          return (
            <div
              key={idx}
              className={`p-4 rounded-card-sm border space-y-2 ${
                isSuccess ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-dark uppercase">
                    Decision #{item.step || idx + 1}
                  </span>
                  <span className="text-xs font-bold text-dark">{item.title || item.summary}</span>
                </div>
                <Badge variant={isSuccess ? 'success' : 'danger'}>
                  {item.status}
                </Badge>
              </div>
              <p className="text-xs text-dark-secondary leading-relaxed">{item.summary}</p>
              {item.reason && (
                <p className={`text-[11px] font-mono font-medium ${isSuccess ? 'text-emerald-800' : 'text-rose-800'}`}>
                  • {item.reason}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
