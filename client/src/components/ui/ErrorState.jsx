import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Unable to load cases',
  message = 'An error occurred while communicating with the ResolveFlow server.',
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-rose-50/50 border border-rose-200/80 rounded-card space-y-4">
      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="text-sm font-semibold text-rose-900">{title}</h3>
        <p className="text-xs text-rose-700 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="bg-white border-rose-200 text-rose-800 hover:bg-rose-50">
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Operation
        </Button>
      )}
    </div>
  );
};
