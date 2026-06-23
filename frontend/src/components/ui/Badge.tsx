import { cn } from '../../utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'surface';
  className?: string;
}

export default function Badge({ children, variant = 'primary', className }: BadgeProps) {
  const variants = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-surface-900 text-white',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-emerald-100 text-emerald-800',
    danger: 'bg-rose-100 text-rose-700',
    surface: 'bg-white/90 text-surface-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-white/80 px-3 py-1 font-display text-[11px] font-semibold tracking-[0.08em] shadow-sm',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
