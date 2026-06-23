import { cn } from '../../utils';

interface SkeletonProps {
  className?: string;
  variant?: 'card' | 'row' | 'text';
}

export default function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={cn("animate-pulse flex flex-col bg-surface-200 h-96 border-4 border-surface-900", className)}>
        <div className="h-48 bg-surface-300 border-b-4 border-surface-900"></div>
        <div className="p-4 flex flex-col gap-3 flex-1">
          <div className="h-6 bg-surface-300 w-3/4"></div>
          <div className="h-4 bg-surface-300 w-full mb-auto"></div>
          <div className="h-10 bg-surface-300 w-1/2 mt-4 ml-auto rtl-flip:mr-auto rtl-flip:ml-0"></div>
        </div>
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div className={cn("animate-pulse flex items-center justify-between p-4 bg-surface-100 border-b-2 border-surface-200", className)}>
        <div className="h-6 bg-surface-300 w-1/4"></div>
        <div className="h-6 bg-surface-300 w-1/4"></div>
        <div className="h-6 bg-surface-300 w-1/4"></div>
      </div>
    );
  }

  return (
    <div className={cn("animate-pulse bg-surface-300 h-4 rounded-sm", className)}></div>
  );
}
