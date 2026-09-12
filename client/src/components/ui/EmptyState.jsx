import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No customer cases yet.',
  description = 'Create a new resolution case to start autonomous agent processing.',
  actionLabel = 'Create New Case',
  onAction,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 bg-surface border border-dashed border-border rounded-card space-y-4">
      <div className="w-12 h-12 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-semibold text-dark">{title}</h3>
        {description && <p className="text-xs text-dark-muted leading-relaxed">{description}</p>}
      </div>
      {action ? (
        action
      ) : (
        onAction && (
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
};
