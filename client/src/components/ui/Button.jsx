import { cn } from '../../utils/cn';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-card-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5'
  };

  const variantStyles = {
    primary:
      'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow active:scale-[0.98]',
    secondary:
      'bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-200 active:scale-[0.98]',
    outline:
      'bg-surface hover:bg-surface-subtle text-dark border border-border hover:border-slate-300 active:scale-[0.98]',
    ghost: 'text-dark-secondary hover:bg-surface-subtle hover:text-dark'
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
