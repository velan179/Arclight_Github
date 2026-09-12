import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle2, XCircle, AlertTriangle, Shield, User, ShoppingBag, Boxes, FileText } from 'lucide-react';

export const EvidenceInspector = ({ evidence = {} }) => {
  const evidenceItems = [
    {
      id: 'customer',
      title: 'Customer Identity & Tier',
      icon: User,
      status: 'VERIFIED',
      badgeVariant: 'success',
      detail: 'Sarah Connor (cust_101) • VIP Tier Account'
    },
    {
      id: 'order',
      title: 'Target Order Status',
      icon: ShoppingBag,
      status: 'DELIVERED',
      badgeVariant: 'success',
      detail: 'ord_5001 • MacBook Pro M3 14-inch ($1,999.00)'
    },
    {
      id: 'policy',
      title: 'Policy Eligibility',
      icon: FileText,
      status: 'ELIGIBLE',
      badgeVariant: 'success',
      detail: '30-Day Damaged Item Policy (Delivered 8 days ago)'
    },
    {
      id: 'inventory',
      title: 'Warehouse Replacement Inventory',
      icon: Boxes,
      status: 'DEPLETED',
      badgeVariant: 'danger',
      detail: 'SKU-MBP-14 stock = 0 units in WH-US-EAST (Restock Sept 25)'
    }
  ];

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary-600" />
          <h2 className="text-sm font-bold text-dark">Evidence & System State Inspector</h2>
        </div>
        <Badge variant="purple">Deterministic Tools</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {evidenceItems.map((item) => {
          const Icon = item.icon;
          const isDanger = item.badgeVariant === 'danger';

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-card-sm border space-y-2 ${
                isDanger ? 'bg-rose-50/50 border-rose-200' : 'bg-surface-subtle border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-dark">
                  <Icon className={`w-4 h-4 ${isDanger ? 'text-rose-600' : 'text-primary-600'}`} />
                  <span>{item.title}</span>
                </div>
                <Badge variant={item.badgeVariant} className="text-[10px]">
                  {item.status}
                </Badge>
              </div>
              <p className="text-xs text-dark-secondary font-medium leading-tight">{item.detail}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
