import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  onClick: () => void;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  children: ReactNode;
  className?: string;
}

export function ContextMenu({ items, children, className }: ContextMenuProps) {
  const [state, setState] = useState<{ open: boolean; x: number; y: number }>({
    open: false,
    x: 0,
    y: 0,
  });
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState({ open: true, x: e.clientX, y: e.clientY });
  }, []);

  const close = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  useEffect(() => {
    if (!state.open) return;
    const handler = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('pointerdown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('pointerdown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [state.open, close]);

  return (
    <>
      <div onContextMenu={handleContextMenu} className={className}>
        {children}
      </div>
      <AnimatePresence>
        {state.open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{ left: state.x, top: state.y }}
            className="fixed z-50 min-w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-800"
            role="menu"
          >
            {items.map((item) =>
              item.divider ? (
                <div
                  key={item.id}
                  className="my-1 border-t border-slate-100 dark:border-slate-700"
                />
              ) : (
                <button
                  key={item.id}
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    if (!item.disabled) {
                      item.onClick();
                      close();
                    }
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors',
                    'focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-inset',
                    item.disabled
                      ? 'cursor-not-allowed opacity-40'
                      : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700',
                    item.danger
                      ? 'text-error-700 dark:text-error-300 dark:bg-error-900/40'
                      : 'text-slate-700 dark:text-slate-300',
                  )}
                >
                  {item.icon && (
                    <span className="size-4 shrink-0">{item.icon}</span>
                  )}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.shortcut && (
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              ),
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
