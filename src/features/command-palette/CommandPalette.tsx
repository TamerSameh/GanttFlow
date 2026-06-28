import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Users,
  Settings,
  FileText,
  Briefcase,
  LayoutDashboard,
  GitBranch,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn, fuzzyMatch } from '@/utils';
import { useKeyboard } from '@/hooks';
import { useUIStore } from '@/stores';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  category: 'Navigation' | 'Actions' | 'Projects';
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const navCommands: CommandItem[] = [
  { id: 'nav-dash', label: 'Go to Dashboard', icon: <LayoutDashboard className="size-4" />, category: 'Navigation', shortcut: 'G D', action: () => {} },
  { id: 'nav-projects', label: 'Go to Projects', icon: <Briefcase className="size-4" />, category: 'Navigation', shortcut: 'G P', action: () => {} },
  { id: 'nav-resources', label: 'Go to Resources', icon: <Users className="size-4" />, category: 'Navigation', shortcut: 'G R', action: () => {} },
  { id: 'nav-portfolio', label: 'Go to Portfolio', icon: <GitBranch className="size-4" />, category: 'Navigation', shortcut: 'G F', action: () => {} },
  { id: 'nav-templates', label: 'Go to Templates', icon: <FileText className="size-4" />, category: 'Navigation', shortcut: 'G T', action: () => {} },
  { id: 'nav-settings', label: 'Go to Settings', icon: <Settings className="size-4" />, category: 'Navigation', shortcut: 'G S', action: () => {} },
];

  const actionCommands: CommandItem[] = [
    { id: 'act-new-project', label: 'New Project', description: 'Create a new project', icon: <Plus className="size-4" />, category: 'Actions', shortcut: 'N', action: () => {} },
    { id: 'act-new-task', label: 'New Task', description: 'Add a task to current project', icon: <Plus className="size-4" />, category: 'Actions', shortcut: 'T', action: () => {} },
    { id: 'act-invite', label: 'Invite Team Member', description: 'Send an invitation email', icon: <Users className="size-4" />, category: 'Actions', shortcut: 'I', action: () => {} },
    { id: 'act-export', label: 'Export Schedule', description: 'Download as CSV or PDF', icon: <FileText className="size-4" />, category: 'Actions', action: () => {} },
  ];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const openModal = useUIStore((s) => s.openModal);

  const allCommands = useMemo(() => {
    const items = [...navCommands, ...actionCommands];
    for (const cmd of items) {
      const originalAction = cmd.action;
      cmd.action = () => {
        originalAction();
        onClose();
      };
    }
    navCommands[0]!.action = () => navigate('/dashboard');
    navCommands[1]!.action = () => navigate('/projects');
    navCommands[2]!.action = () => navigate('/resources');
    navCommands[3]!.action = () => navigate('/portfolio');
    navCommands[4]!.action = () => navigate('/templates');
    navCommands[5]!.action = () => navigate('/settings');
    actionCommands[0]!.action = () => openModal('create-project');
    actionCommands[1]!.action = () => openModal('create-task');
    actionCommands[2]!.action = () => openModal('invite-team');
    actionCommands[3]!.action = () => openModal('export');
    return items;
  }, [navigate, onClose, openModal]);

  const filtered = useMemo(() => {
    if (!query) return allCommands;
    return allCommands.filter(
      (cmd) =>
        fuzzyMatch(cmd.label, query) ||
        fuzzyMatch(cmd.category, query) ||
        (cmd.description && fuzzyMatch(cmd.description, query)),
    );
  }, [query, allCommands]);

  const grouped = useMemo(() => {
    const groups: { category: string; items: CommandItem[] }[] = [];
    const cats = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const existing = cats.get(item.category);
      if (existing) {
        existing.push(item);
      } else {
        cats.set(item.category, [item]);
      }
    }
    for (const [category, items] of cats) {
      groups.push({ category, items });
    }
    return groups;
  }, [filtered]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const executeSelected = useCallback(() => {
    const flatItems = filtered;
    if (flatItems[activeIndex]) {
      flatItems[activeIndex]!.action();
    }
  }, [filtered, activeIndex]);

  useKeyboard(
    {
      ArrowDown: (e) => {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      },
      ArrowUp: (e) => {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      },
      Enter: (e) => {
        e.preventDefault();
        executeSelected();
      },
      Escape: (e) => {
        e.preventDefault();
        onClose();
      },
    },
    open,
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (listRef.current && activeIndex >= 0) {
      const item = listRef.current.children[activeIndex] as HTMLElement | undefined;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-700">
              <Search className="size-5 shrink-0 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands..."
                className="h-12 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <kbd className="hidden rounded-md border border-slate-300 px-1.5 py-0.5 text-[11px] text-slate-400 sm:inline-block dark:border-slate-600">
                ESC
              </kbd>
            </div>

            <div
              ref={listRef}
              className="max-h-80 overflow-y-auto p-2"
              role="listbox"
            >
              {grouped.length === 0 && (
                <div className="flex flex-col items-center gap-2 px-4 py-12">
                  <Search className="size-8 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No results for "<strong>{query}</strong>"
                  </p>
                </div>
              )}

              {grouped.map((group) => (
                <div key={group.category}>
                  <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {group.category}
                  </div>
                  {group.items.map((item) => {
                    const globalIdx = filtered.indexOf(item);
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setActiveIndex(globalIdx)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                          globalIdx === activeIndex
                            ? 'bg-primary-200 text-primary-800 dark:bg-primary-900/70 dark:text-primary-200'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50',
                        )}
                        role="option"
                        aria-selected={globalIdx === activeIndex}
                      >
                        <span
                          className={cn(
                            'flex size-7 shrink-0 items-center justify-center rounded-md',
                            globalIdx === activeIndex
                              ? 'bg-primary-100 text-primary-600 dark:bg-primary-800/50 dark:text-primary-400'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
                          )}
                        >
                          {item.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-slate-400 dark:text-slate-500">
                              {item.description}
                            </div>
                          )}
                        </div>
                        {item.shortcut && (
                          <kbd className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] text-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-500">
                            {item.shortcut}
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 border-t border-slate-200 px-4 py-2 dark:border-slate-700">
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <kbd className="rounded border border-slate-300 bg-slate-50 px-1 dark:border-slate-600 dark:bg-slate-700">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <kbd className="rounded border border-slate-300 bg-slate-50 px-1 dark:border-slate-600 dark:bg-slate-700">↵</kbd>
                <span>Open</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <kbd className="rounded border border-slate-300 bg-slate-50 px-1 dark:border-slate-600 dark:bg-slate-700">Esc</kbd>
                <span>Close</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}