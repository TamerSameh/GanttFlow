import { cn } from '@/utils/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

const variantStyles = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
};

export function ProgressBar({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700',
          size === 'sm' ? 'h-1.5' : 'h-2.5',
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            variantStyles[variant],
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
