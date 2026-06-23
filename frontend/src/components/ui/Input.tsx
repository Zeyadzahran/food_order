import React from 'react';
import { cn } from '../../utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="font-display font-semibold text-sm uppercase tracking-wide text-surface-900">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-12 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2 text-base ring-offset-surface-50 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-surface-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            error && 'border-accent focus-visible:ring-accent',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs font-bold font-body text-accent mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
