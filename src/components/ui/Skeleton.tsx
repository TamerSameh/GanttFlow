import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          'relative isolate overflow-hidden bg-slate-200 dark:bg-slate-700',
          'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite]',
          'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
          variant === 'circular' && 'rounded-full',
          variant === 'text' && 'h-4 rounded-md',
          variant === 'rectangular' && 'rounded-lg',
          className,
        )}
        {...props}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-8 w-40" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function GanttSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 dark:border-slate-700">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>
      <div className="flex flex-1">
        <div className="w-80 space-y-2 border-r border-slate-200 p-3 dark:border-slate-700">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-10 rounded-md" />
          ))}
        </div>
        <div className="flex-1 space-y-2 p-3">
          <Skeleton className="h-8 w-full rounded-md" />
          <div className="space-y-6 pt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                className="h-6 rounded-md"
                style={{ width: `${40 + Math.random() * 50}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResourceSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
