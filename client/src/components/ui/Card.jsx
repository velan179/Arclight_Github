import { cn } from '../../utils/cn';

export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-surface border border-border/80 rounded-card p-6 shadow-apple hover:shadow-apple-hover transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
