import { cn } from '../../utils/cn';

export const Badge = ({ children, variant = 'purple', className }) => {
  const variantStyles = {
    purple: 'bg-primary-100 text-primary-700 border-primary-200',
    neutral: 'bg-surface-subtle text-dark-secondary border-border',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-tight',
        variantStyles[variant] || variantStyles.purple,
        className
      )}
    >
      {children}
    </span>
  );
};
