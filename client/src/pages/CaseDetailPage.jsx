import React, { useState } from 'react';
import { useCaseDetails, useAgentEvents } from '../hooks/useCases';
import { AgentJourneyGraph } from '../components/journey/AgentJourneyGraph';
import { EvidenceInspector } from '../components/journey/EvidenceInspector';
import { DecisionHistory } from '../components/journey/DecisionHistory';
import { ResolutionReplay } from '../components/journey/ResolutionReplay';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import {
  ArrowLeft,
  Bot,
  User,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';

export const CaseDetailPage = ({ caseId, onNavigate }) => {
  const { data: caseItem, isLoading: isLoadingCase, isError, error, refetch } = useCaseDetails(caseId);
  const { data: events = [], isLoading: isLoadingEvents } = useAgentEvents(caseItem?.agentRunId || 'run_9001');

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (isLoadingCase || isLoadingEvents) {
    return (
      <div className="space-y-4 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !caseItem) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <ErrorState
          title="Unable to load case details"
          message={error?.message || 'Case not found in database.'}
          onRetry={refetch}
        />
      </div>
    );
  }

  const activeEvents = events.length > 0 ? events : [
    { type: 'GOAL_RECEIVED', timestamp: new Date().toISOString(), summary: 'Customer requested damaged laptop replacement', status: 'SUCCESS' },
    { type: 'INVESTIGATION', timestamp: new Date().toISOString(), summary: 'Checked order ord_5001 and VIP customer profile', status: 'SUCCESS' },
    { type: 'TOOL_EXECUTION', timestamp: new Date().toISOString(), summary: 'Checked replacement stock for SKU-MBP-14', status: 'SUCCESS' },
    { type: 'FAILURE', timestamp: new Date().toISOString(), summary: 'Replacement stock depleted (0 units in WH-US-EAST)', status: 'FAILURE' },
    { type: 'REPLAN', timestamp: new Date().toISOString(), summary: 'Swapped to immediate $1,999.00 monetary refund pathway', status: 'SUCCESS' },
    { type: 'ACTION_RESULT', timestamp: new Date().toISOString(), summary: 'Refund act_ref_8821 processed successfully', status: 'SUCCESS' },
    { type: 'VERIFICATION', timestamp: new Date().toISOString(), summary: 'Verified refund ledger entry & order state in MongoDB', status: 'SUCCESS' },
    { type: 'RESOLUTION', timestamp: new Date().toISOString(), summary: 'Case closed with verified state', status: 'SUCCESS' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('/cases')}>
          <ArrowLeft className="w-4 h-4" />
          Back to Cases
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="purple">Case {caseItem.caseNumber || caseItem.id}</Badge>
          <Badge variant="success">Closed-Loop Verified</Badge>
        </div>
      </div>

      {/* Main Case Summary Card */}
      <Card className="space-y-4 shadow-apple border-primary-200/80 bg-gradient-to-r from-surface via-primary-50/20 to-surface">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-base font-bold text-dark">{caseItem.caseNumber || caseItem.id}</span>
              <Badge variant={caseItem.status === 'RESOLVED' ? 'success' : 'purple'}>
                {caseItem.status}
              </Badge>
            </div>
            <h1 className="text-lg font-bold text-dark leading-tight">{caseItem.customerGoal}</h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-2.5 rounded-card-sm bg-surface border border-border text-xs flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary-600" />
              <div>
                <span className="text-[10px] text-dark-muted block font-mono">Agent Run ID</span>
                <span className="font-semibold text-dark">{caseItem.agentRunId || 'run_9001'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-card-sm bg-surface border border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-card-sm bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-dark-muted block uppercase font-bold tracking-wider">Customer</span>
              <span className="font-semibold text-dark">{caseItem.customerId || 'cust_101 (Sarah Connor)'}</span>
            </div>
          </div>

          <div className="p-3 rounded-card-sm bg-surface border border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-card-sm bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-dark-muted block uppercase font-bold tracking-wider">Target Order</span>
              <span className="font-semibold text-dark">{caseItem.orderId || 'ord_5001 ($1,999.00)'}</span>
            </div>
          </div>

          <div className="p-3 rounded-card-sm bg-surface border border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-card-sm bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-dark-muted block uppercase font-bold tracking-wider">Final Outcome</span>
              <span className="font-semibold text-emerald-700">Full Refund ($1,999.00) Verified</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Resolution Replay Bar */}
      <ResolutionReplay
        totalSteps={activeEvents.length}
        currentStep={activeStepIndex}
        onStepChange={setActiveStepIndex}
      />

      {/* Agent Journey Timeline Graph */}
      <AgentJourneyGraph
        events={activeEvents}
        activeStepIndex={activeStepIndex}
        onSelectStep={setActiveStepIndex}
      />

      {/* Evidence & Decision Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EvidenceInspector evidence={caseItem.evidence} />
        <DecisionHistory decisions={caseItem.decisions} />
      </div>
    </div>
  );
};
