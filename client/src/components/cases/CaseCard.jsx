import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ArrowRight, Bot, Clock, User, ShoppingBag } from 'lucide-react';

export const CaseCard = ({ caseItem, onViewCase }) => {
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
    <Card className="space-y-3.5 p-4 hover:border-primary-300">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-bold text-dark">{caseItem.caseNumber || caseItem.id}</span>
        {getStatusBadge(caseItem.status)}
      </div>

      <div className="space-y-1">
        <p className="text-xs font-medium text-dark leading-snug">{caseItem.customerGoal}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] text-dark-secondary pt-2 border-t border-border-subtle">
        <div className="flex items-center gap-1.5 truncate">
          <User className="w-3.5 h-3.5 text-dark-muted shrink-0" />
          <span className="truncate">{caseItem.customerId || 'cust_101'}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <ShoppingBag className="w-3.5 h-3.5 text-dark-muted shrink-0" />
          <span className="truncate">{caseItem.orderId || 'ord_5001'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-xs">
        <div className="flex items-center gap-1.5 text-dark-muted font-mono text-[11px]">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(caseItem.createdAt)}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onViewCase(caseItem.id)}>
          <span>View Case</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
};
