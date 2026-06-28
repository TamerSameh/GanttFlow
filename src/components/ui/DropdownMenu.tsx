import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick: () => void;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'end';
  className?: string;
}

export function DropdownMenu({
  trigger,
  items,
  align = 'start',
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    const enabledItems = items.filter((i) => !i.disabled);
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusIndex((i) => (i + 1) % enabledItems.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusIndex((i) => (i - 1 + enabledItems.length) % enabledItems.length);
        break;
      case 'Enter':
        e.preventDefault();
        enabledItems[focusIndex]?.onClick();
        setOpen(false);
        break;
      case 'Escape':
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={ref} className="relative inline-block" onKeyDown={handleKeyDown}>
      <div
        onClick={() => {
          setOpen(!open);
          setFocusIndex(0);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(!open);
            setFocusIndex(0);
          }
        }}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={open}
        className="inline-flex cursor-pointer"
      >
        {trigger}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className={cn(
              'absolute z-50 mt-1 min-w-48 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800',
              align === 'end' ? 'right-0' : 'left-0',
              className,
            )}
            role="menu"
          >
            {items.map((item, index) => (
              <button
                key={item.id}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick();
                    setOpen(false);
                  }
                }}
                onMouseEnter={() => setFocusIndex(index)}
                className={cn(
                  'flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors',
                  'focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-inset',
                  index === focusIndex && !item.disabled
                    ? 'bg-slate-100 dark:bg-slate-700'
                    : '',
                  item.disabled
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer',
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
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                    {item.shortcut}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
