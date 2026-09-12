import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import {
  UserCheck,
  PackageSearch,
  FileCheck2,
  Boxes,
  RefreshCw,
  AlertTriangle,
  Receipt,
  CheckCircle2,
  Activity,
  Bot
} from 'lucide-react';

export const LiveAgentActivity = ({ events = [], isLoading = false }) => {
  const getEventIcon = (type, status) => {
    if (status === 'FAILURE' || type === 'FAILURE') return AlertTriangle;
    if (type === 'GOAL_RECEIVED') return Bot;
    if (type === 'INVESTIGATION') return PackageSearch;
    if (type === 'TOOL_EXECUTION') return Boxes;
    if (type === 'REPLAN') return RefreshCw;
    if (type === 'ACTION_RESULT') return Receipt;
    if (type === 'VERIFICATION') return FileCheck2;
    if (type === 'RESOLUTION') return CheckCircle2;
    return Activity;
  };

  const getEventBadge = (type, status) => {
    if (status === 'FAILURE' || type === 'FAILURE') {
      return { variant: 'danger', text: 'Failure' };
    }
    if (type === 'REPLAN') {
      return { variant: 'warning', text: 'Replanning' };
    }
    if (type === 'RESOLUTION' || type === 'VERIFICATION') {
      return { variant: 'success', text: 'Verified' };
    }
    return { variant: 'purple', text: 'Executed' };
  };

  const formatTime = (ts) => {
    if (!ts) return 'Just now';
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-card-sm bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-dark">LIVE AGENT ACTIVITY</h2>
            <p className="text-xs text-dark-muted">Safe observable events & autonomous execution stream</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Badge variant="purple">Live Stream</Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-6 text-xs text-dark-muted">
          No live agent events recorded yet. Trigger an agent run to view live stream.
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-subtle">
          {events.map((event, index) => {
            const Icon = getEventIcon(event.type, event.status);
            const badge = getEventBadge(event.type, event.status);
            const isFailure = event.status === 'FAILURE' || event.type === 'FAILURE';
            const isReplan = event.type === 'REPLAN';

            return (
              <div key={index} className="relative flex items-start gap-3 group">
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-6 top-1 w-5 h-5 rounded-full border flex items-center justify-center text-white text-[10px] z-10 transition-transform group-hover:scale-110 ${
                    isFailure
                      ? 'bg-rose-500 border-rose-600'
                      : isReplan
                      ? 'bg-amber-500 border-amber-600'
                      : 'bg-primary-600 border-primary-700'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                </div>

                <div
                  className={`flex-1 p-3.5 rounded-card-sm border transition-all ${
                    isFailure
                      ? 'bg-rose-50/60 border-rose-200'
                      : isReplan
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-surface-subtle border-border/80 hover:border-primary-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-dark font-mono uppercase tracking-tight">
                      {event.type.replace(/_/g, ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-dark-muted">{formatTime(event.timestamp)}</span>
                      <Badge variant={badge.variant} className="text-[10px] px-2 py-0">
                        {badge.text}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-dark-secondary font-medium leading-relaxed">{event.summary}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
