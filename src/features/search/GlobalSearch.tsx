import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, Users, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn, fuzzyMatch } from '@/utils';
import { useKeyboard } from '@/hooks';

interface SearchResult {
  id: string;
  label: string;
  description?: string;
  type: 'project' | 'task' | 'resource';
  href: string;
}

const sampleResults: SearchResult[] = [
  { id: 'p1', label: 'Website Redesign', description: 'Project · Due Jul 15', type: 'project', href: '/projects/1' },
  { id: 'p2', label: 'Mobile App v2', description: 'Project · Due Aug 30', type: 'project', href: '/projects/2' },
  { id: 'p3', label: 'Q3 Marketing Campaign', description: 'Project · Due Sep 1', type: 'project', href: '/projects/3' },
  { id: 't1', label: 'Design Phase', description: 'Task · Website Redesign', type: 'task', href: '/projects/1' },
  { id: 't2', label: 'Development', description: 'Task · Website Redesign', type: 'task', href: '/projects/1' },
  { id: 't3', label: 'Requirements Gathering', description: 'Task · Website Redesign', type: 'task', href: '/projects/1' },
  { id: 'r1', label: 'Sarah Chen', description: 'Senior Developer', type: 'resource', href: '/resources' },
  { id: 'r2', label: 'Marcus Jones', description: 'Designer', type: 'resource', href: '/resources' },
];

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query) return sampleResults.slice(0, 5);
    return sampleResults.filter(
      (r) =>
        fuzzyMatch(r.label, query) ||
        fuzzyMatch(r.type, query) ||
        (r.description && fuzzyMatch(r.description, query)),
    );
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const execute = useCallback(
    (result: SearchResult) => {
      navigate(result.href);
      onClose();
    },
    [navigate, onClose],
  );

  useKeyboard(
    {
      ArrowDown: (e) => {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      },
      ArrowUp: (e) => {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      },
      Enter: (e) => {
        e.preventDefault();
        if (results[activeIndex]) execute(results[activeIndex]!);
      },
      Escape: () => onClose(),
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

  const typeIcons = {
    project: Briefcase,
    task: FileText,
    resource: Users,
  };

  const typeColors = {
    project: 'text-primary-800 bg-primary-200 dark:bg-primary-900/70 dark:text-primary-200',
    task: 'text-info-800 bg-info-200 dark:bg-info-900/70 dark:text-info-200',
    resource: 'text-success-800 bg-success-200 dark:bg-success-900/70 dark:text-success-200',
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
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
            aria-label="Search"
          >
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-700">
              <Search className="size-5 shrink-0 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, tasks, people..."
                className="h-12 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <kbd className="hidden rounded-md border border-slate-300 px-1.5 py-0.5 text-[11px] text-slate-400 sm:inline-block dark:border-slate-600">
                ESC
              </kbd>
            </div>

            <div ref={listRef} className="max-h-72 overflow-y-auto p-2" role="listbox">
              {results.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-12">
                  <Search className="size-8 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No results for "<strong>{query}</strong>"
                  </p>
                </div>
              ) : (
                results.map((result, idx) => {
                  const Icon = typeIcons[result.type];
                  return (
                    <button
                      key={result.id}
                      onClick={() => execute(result)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                        idx === activeIndex
                          ? 'bg-primary-200 text-primary-800 dark:bg-primary-900/70 dark:text-primary-200'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50',
                      )}
                      role="option"
                      aria-selected={idx === activeIndex}
                    >
                      <span
                        className={cn(
                          'flex size-7 shrink-0 items-center justify-center rounded-md',
                          typeColors[result.type],
                        )}
                      >
                        <Icon className="size-3.5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{result.label}</div>
                        {result.description && (
                          <div className="text-xs text-slate-400 dark:text-slate-500 truncate">
                            {result.description}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="size-4 shrink-0 text-slate-300 dark:text-slate-600" />
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex items-center gap-4 border-t border-slate-200 px-4 py-2 dark:border-slate-700">
              <span className="text-[11px] text-slate-400">
                Search across <strong className="text-slate-500 dark:text-slate-300">projects</strong>, <strong className="text-slate-500 dark:text-slate-300">tasks</strong>, and <strong className="text-slate-500 dark:text-slate-300">people</strong>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
