import React from 'react';
import { cn } from '../../utils';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl font-display font-semibold tracking-[0.01em] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-50',
          {
            'bg-primary-500 text-white shadow-float hover:-translate-y-0.5 hover:bg-primary-600': variant === 'primary',
            'border border-surface-200 bg-white text-surface-900 shadow-sm hover:-translate-y-0.5 hover:border-primary-200 hover:bg-surface-50': variant === 'secondary',
            'bg-transparent text-surface-700 hover:bg-white/80 hover:text-surface-900': variant === 'ghost',
            'bg-accent text-white shadow-solid-accent hover:-translate-y-0.5 hover:bg-accent-hover': variant === 'danger',
          },
          {
            'h-10 px-4 text-sm': size === 'sm',
            'h-12 px-5 text-[15px]': size === 'md',
            'h-14 px-7 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading && <Spinner className="w-4 h-4 mr-2 rtl-flip:ml-2" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
