import { useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useKeyboard } from '@/hooks';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: 'left' | 'right';
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = 'right',
  className,
}: DrawerProps) {
  const focusRef = useRef<HTMLDivElement>(null);

  useKeyboard({ Escape: onClose }, open);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      focusRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const slideFrom = side === 'right' ? { x: '100%' } : { x: '-100%' };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-40"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={focusRef}
            tabIndex={-1}
            initial={slideFrom}
            animate={{ x: 0 }}
            exit={slideFrom}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className={cn(
              'absolute inset-y-0 flex w-full max-w-lg flex-col bg-white shadow-xl dark:bg-slate-800',
              side === 'right' ? 'right-0' : 'left-0',
              className,
            )}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                aria-label="Close panel"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
