import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  variant?: 'default' | 'projects' | 'tasks' | 'resources' | 'search';
}

function DefaultIllustration() {
  return (
    <svg className="size-16" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <rect x="10" y="20" width="60" height="44" rx="8" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="2" fill="none" strokeDasharray="4 3" />
      <line x1="20" y1="34" x2="60" y2="34" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="2" />
      <line x1="20" y1="42" x2="50" y2="42" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="2" />
      <line x1="20" y1="50" x2="44" y2="50" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="2" />
      <circle cx="66" cy="18" r="8" className="fill-primary-100 dark:fill-primary-900/30" />
      <line x1="66" y1="14" x2="66" y2="22" className="stroke-primary-500" strokeWidth="2" strokeLinecap="round" />
      <line x1="62" y1="18" x2="70" y2="18" className="stroke-primary-500" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ProjectsIllustration() {
  return (
    <svg className="size-16" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <rect x="8" y="12" width="64" height="20" rx="6" className="fill-primary-50 stroke-primary-200 dark:fill-primary-900/20 dark:stroke-primary-800" strokeWidth="1.5" />
      <rect x="8" y="36" width="64" height="20" rx="6" className="fill-slate-50 stroke-slate-200 dark:fill-slate-800/50 dark:stroke-slate-700" strokeWidth="1.5" />
      <rect x="8" y="60" width="40" height="16" rx="6" className="fill-slate-50 stroke-slate-200 dark:fill-slate-800/50 dark:stroke-slate-700" strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="64" cy="68" r="10" className="fill-primary-100 dark:fill-primary-900/30" />
      <line x1="64" y1="64" x2="64" y2="72" className="stroke-primary-500" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="68" x2="68" y2="68" className="stroke-primary-500" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TasksIllustration() {
  return (
    <svg className="size-16" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <rect x="10" y="10" width="60" height="16" rx="4" className="fill-primary-100 dark:fill-primary-900/20" />
      <rect x="10" y="32" width="60" height="16" rx="4" className="fill-slate-100 dark:fill-slate-800" />
      <rect x="10" y="54" width="40" height="16" rx="4" className="fill-slate-100 dark:fill-slate-800" strokeDasharray="4 3" />
      <circle cx="65" cy="18" r="5" className="fill-success-400" />
      <circle cx="65" cy="40" r="5" className="fill-warning-400" />
    </svg>
  );
}

function ResourcesIllustration() {
  return (
    <svg className="size-16" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="40" cy="28" r="14" className="fill-primary-50 stroke-primary-200 dark:fill-primary-900/20 dark:stroke-primary-800" strokeWidth="1.5" />
      <path d="M20 66 C20 52 30 44 40 44 C50 44 60 52 60 66" className="fill-primary-50 stroke-primary-200 dark:fill-primary-900/20 dark:stroke-primary-800" strokeWidth="1.5" />
      <circle cx="40" cy="28" r="5" className="fill-primary-400" />
    </svg>
  );
}

function SearchIllustration() {
  return (
    <svg className="size-16" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="34" cy="34" r="18" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="2" />
      <line x1="48" y1="48" x2="60" y2="60" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="34" x2="40" y2="34" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="2" strokeLinecap="round" />
      <circle cx="34" cy="34" r="6" className="fill-slate-200 dark:fill-slate-700" />
    </svg>
  );
}

const illustrations = {
  default: DefaultIllustration,
  projects: ProjectsIllustration,
  tasks: TasksIllustration,
  resources: ResourcesIllustration,
  search: SearchIllustration,
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  variant = 'default',
}: EmptyStateProps) {
  const Illustration = illustrations[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'flex flex-col items-center justify-center gap-4 px-6 py-16 text-center will-change-transform',
        className,
      )}
    >
      {icon ?? (
        <div className="flex size-20 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/50">
          <Illustration />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h3>
      {description && (
        <p className="max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}
