import { AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  errorId?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  errorId,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-16 text-center',
        className,
      )}
      role="alert"
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-error-200 text-error-800 dark:bg-slate-800 dark:text-error-300 dark:ring-1 dark:ring-error-800/50">
        <AlertTriangle className="size-8" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h3>
      <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
      {errorId && (
        <p className="text-xs text-slate-400 font-mono">Error ID: {errorId}</p>
      )}
      {onRetry && (
        <div className="mt-2">
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
