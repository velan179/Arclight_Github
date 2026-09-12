import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ArrowRight, Bot, Clock } from 'lucide-react';

export const CaseTable = ({ cases = [], onViewCase }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return <Badge variant="success">RESOLVED</Badge>;
      case 'ESCALATED':
        return <Badge variant="warning">ESCALATED</Badge>;
      case 'REPLANNING':
        return <Badge variant="purple">REPLANNING</Badge>;
      case 'IN_PROGRESS':
      case 'INVESTIGATING':
        return <Badge variant="purple">INVESTIGATING</Badge>;
      default:
        return <Badge variant="neutral">{status || 'OPEN'}</Badge>;
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="overflow-x-auto bg-surface border border-border rounded-card shadow-apple">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-surface-subtle/70 text-[11px] font-bold text-dark-muted uppercase tracking-wider">
            <th className="py-3.5 px-4">Case ID</th>
            <th className="py-3.5 px-4">Customer</th>
            <th className="py-3.5 px-4">Customer Goal / Complaint</th>
            <th className="py-3.5 px-4">Current State</th>
            <th className="py-3.5 px-4">Resolution</th>
            <th className="py-3.5 px-4">Agent Status</th>
            <th className="py-3.5 px-4">Created Time</th>
            <th className="py-3.5 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/80 text-xs">
          {cases.map((c) => (
            <tr key={c.id} className="hover:bg-surface-subtle/50 transition-colors group">
              <td className="py-3.5 px-4 font-mono font-bold text-dark whitespace-nowrap">
                {c.caseNumber || c.id}
              </td>
              <td className="py-3.5 px-4 text-dark-secondary font-medium whitespace-nowrap">
                {c.customerId || 'Sarah Connor (cust_101)'}
              </td>
              <td className="py-3.5 px-4 text-dark font-medium max-w-xs truncate" title={c.customerGoal}>
                {c.customerGoal}
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                {getStatusBadge(c.status)}
              </td>
              <td className="py-3.5 px-4 text-dark-secondary font-medium whitespace-nowrap">
                {c.outcome?.type || (c.status === 'RESOLVED' ? 'REFUND' : 'Pending')}
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-xs text-dark-secondary">
                  <Bot className="w-3.5 h-3.5 text-primary-600" />
                  <span>{c.agentRunId ? 'Active Run' : 'Idle'}</span>
                </div>
              </td>
              <td className="py-3.5 px-4 text-dark-muted font-mono whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-dark-muted" />
                  <span>{formatDate(c.createdAt)}</span>
                </div>
              </td>
              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewCase(c.id)}
                  className="group-hover:text-primary-700"
                >
                  <span>View Case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
