import { cn } from '../../utils/cn';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-card-sm bg-slate-200/80', className)}
      {...props}
    />
  );
};
