import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUIStore } from '@/stores';
import type { ToastVariant } from '@/types';

const icons: Record<ToastVariant, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles: Record<ToastVariant, string> = {
  success: 'border-success-500 bg-success-200 text-success-900 dark:bg-slate-800 dark:border-success-600 dark:text-success-200',
  error: 'border-error-500 bg-error-200 text-error-900 dark:bg-slate-800 dark:border-error-600 dark:text-error-200',
  warning: 'border-warning-500 bg-warning-200 text-warning-900 dark:bg-slate-800 dark:border-warning-600 dark:text-warning-200',
  info: 'border-primary-500 bg-primary-200 text-primary-900 dark:bg-slate-800 dark:border-primary-600 dark:text-primary-200',
};

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  return (
    <div
      className="fixed right-4 top-4 z-50 flex flex-col gap-2"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = icons[toast.variant];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={cn(
                'flex w-80 items-start gap-3 rounded-lg border-l-4 p-4 shadow-lg',
                styles[toast.variant],
              )}
              role="alert"
            >
              <Icon className="mt-0.5 size-5 shrink-0" />
              <p className="flex-1 text-sm font-medium">{toast.message}</p>
              {toast.action && (
                <button
                  onClick={toast.action.onClick}
                  className="text-sm font-semibold underline"
                >
                  {toast.action.label}
                </button>
              )}
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100"
                aria-label="Dismiss"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
