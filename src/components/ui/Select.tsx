import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'h-10 w-full appearance-none rounded-md border px-3 pr-10 text-sm transition-colors',
              'bg-white text-slate-900',
              'dark:bg-slate-800 dark:text-slate-100',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-error-500'
                : 'border-slate-300 dark:border-slate-600',
              className,
            )}
            aria-invalid={error ? 'true' : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        </div>
        {error && (
          <p className="text-xs text-error-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
