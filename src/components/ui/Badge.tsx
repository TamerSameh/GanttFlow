import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

const variants = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  success: 'bg-success-200 text-success-800 dark:bg-success-900/70 dark:text-success-200',
  warning: 'bg-warning-200 text-warning-800 dark:bg-warning-900/70 dark:text-warning-200',
  error: 'bg-error-200 text-error-800 dark:bg-error-900/70 dark:text-error-200',
  info: 'bg-primary-200 text-primary-800 dark:bg-primary-900/70 dark:text-primary-200',
  critical: 'bg-critical-200 text-critical-800 dark:bg-critical-900/70 dark:text-critical-200',
} as const;

const sizes = {
  sm: 'px-1.5 py-0.5 text-[11px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
} as const;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
