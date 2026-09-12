import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  Bot,
  PackageSearch,
  Boxes,
  AlertTriangle,
  RefreshCw,
  Receipt,
  FileCheck2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const AgentJourneyGraph = ({ events = [], activeStepIndex, onSelectStep }) => {
  const getStepIcon = (type, status) => {
    if (status === 'FAILURE' || type === 'FAILURE') return AlertTriangle;
    if (type === 'GOAL_RECEIVED') return Bot;
    if (type === 'INVESTIGATION') return PackageSearch;
    if (type === 'TOOL_EXECUTION') return Boxes;
    if (type === 'REPLAN') return RefreshCw;
    if (type === 'ACTION_RESULT') return Receipt;
    if (type === 'VERIFICATION') return FileCheck2;
    if (type === 'RESOLUTION') return CheckCircle2;
    return Bot;
  };

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary-600" />
          <h2 className="text-base font-bold text-dark">Agent Journey State Machine</h2>
        </div>
        <Badge variant="purple">Closed-Loop Flow</Badge>
      </div>

      {/* Horizontal Interactive Step Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {events.map((event, index) => {
          const Icon = getStepIcon(event.type, event.status);
          const isSelected = activeStepIndex === index;
          const isFailure = event.status === 'FAILURE' || event.type === 'FAILURE';
          const isReplan = event.type === 'REPLAN';
          const isVerified = event.type === 'VERIFICATION' || event.type === 'RESOLUTION';

          return (
            <button
              key={index}
              onClick={() => onSelectStep(index)}
              className={`flex flex-col items-center p-3 rounded-card-sm border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500/20 shadow-md scale-102'
                  : isFailure
                  ? 'bg-rose-50/70 border-rose-200 hover:border-rose-400'
                  : isReplan
                  ? 'bg-amber-50/70 border-amber-200 hover:border-amber-400'
                  : isVerified
                  ? 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400'
                  : 'bg-surface-subtle border-border hover:border-slate-300'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1.5 shadow-sm ${
                  isFailure
                    ? 'bg-rose-500'
                    : isReplan
                    ? 'bg-amber-500'
                    : isVerified
                    ? 'bg-emerald-500'
                    : 'bg-primary-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-dark font-mono uppercase tracking-tight truncate w-full">
                Step {index + 1}
              </span>
              <span className="text-[10px] text-dark-muted font-medium truncate w-full mt-0.5">
                {event.type.replace(/_/g, ' ')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Step Inspector Box */}
      {events[activeStepIndex] && (
        <div className="p-4 bg-surface-subtle border border-border rounded-card-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-dark font-mono uppercase">
              Step {activeStepIndex + 1}: {events[activeStepIndex].type.replace(/_/g, ' ')}
            </span>
            <Badge
              variant={
                events[activeStepIndex].status === 'FAILURE'
                  ? 'danger'
                  : events[activeStepIndex].type === 'REPLAN'
                  ? 'warning'
                  : 'success'
              }
            >
              {events[activeStepIndex].status || 'SUCCESS'}
            </Badge>
          </div>
          <p className="text-xs text-dark-secondary font-medium leading-relaxed">
            {events[activeStepIndex].summary}
          </p>
          {events[activeStepIndex].metadata && Object.keys(events[activeStepIndex].metadata).length > 0 && (
            <div className="pt-2 border-t border-border flex flex-wrap gap-2 text-[11px] font-mono text-dark-muted">
              {Object.entries(events[activeStepIndex].metadata).map(([k, v]) => (
                <span key={k} className="bg-surface px-2 py-0.5 rounded border border-border">
                  {k}: <strong className="text-dark">{String(v)}</strong>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
