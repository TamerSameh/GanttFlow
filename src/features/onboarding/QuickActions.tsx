import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, Users, Briefcase, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUIStore } from '@/stores';

const actions = [
  { id: 'project', label: 'New Project', icon: Briefcase, shortcut: 'N', modal: 'create-project' as const, color: 'bg-primary-500' },
  { id: 'task', label: 'New Task', icon: FileText, shortcut: 'T', modal: 'create-task' as const, color: 'bg-info-500' },
  { id: 'invite', label: 'Invite Team', icon: Users, shortcut: 'I', modal: 'invite-team' as const, color: 'bg-success-500' },
];

export function QuickActions() {
  const [open, setOpen] = useState(false);
  const openModal = useUIStore((s) => s.openModal);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.15, staggerChildren: 0.05 }}
            className="flex flex-col gap-2"
          >
            {actions.map((action) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => {
                  openModal(action.modal);
                  setOpen(false);
                }}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 active:scale-95',
                  action.color,
                )}
              >
                <action.icon className="size-4" />
                <span>{action.label}</span>
                <kbd className="ml-2 rounded-md bg-white/20 px-1.5 py-0.5 text-[11px]">
                  {action.shortcut}
                </kbd>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className={cn(
          'flex size-14 items-center justify-center rounded-full shadow-xl transition-colors',
          open
            ? 'bg-slate-700 text-white dark:bg-slate-600'
            : 'bg-primary-500 text-white hover:bg-primary-600',
        )}
        aria-label={open ? 'Close quick actions' : 'Open quick actions'}
      >
        {open ? <X className="size-6" /> : <Plus className="size-6" />}
      </motion.button>
    </div>
  );
}
