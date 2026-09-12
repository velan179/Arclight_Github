import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

export const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  badgeText,
  badgeVariant = 'purple',
  accentColor = 'text-primary-600 bg-primary-50 border-primary-200'
}) => {
  return (
    <Card className="flex flex-col justify-between p-5 space-y-4 hover:border-primary-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-dark-muted">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight text-dark">{value}</h3>
        </div>
        {Icon && (
          <div className={cn('w-10 h-10 rounded-card-sm border flex items-center justify-center shrink-0', accentColor)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs">
        <span className="text-dark-muted font-medium">{subtext}</span>
        {badgeText && <Badge variant={badgeVariant}>{badgeText}</Badge>}
      </div>
    </Card>
  );
};
