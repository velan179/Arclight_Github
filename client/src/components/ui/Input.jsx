import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(
  ({ label, error, helperText, className, id, required, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-dark tracking-tight">
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full px-3.5 py-2.5 bg-surface text-dark text-sm border border-border rounded-card-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder:text-dark-muted disabled:bg-surface-subtle disabled:cursor-not-allowed',
            error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-dark-muted">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
