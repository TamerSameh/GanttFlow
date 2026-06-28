import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  GitBranch,
  Users,
  Briefcase,
  FileText,
  Settings,
  ChevronLeft,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useMediaQuery } from '@/hooks';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: Briefcase },
  { to: '/resources', label: 'Resources', icon: Users },
  { to: '/portfolio', label: 'Portfolio', icon: GitBranch },
  { to: '/templates', label: 'Templates', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const;

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const isLargeScreen = useMediaQuery('(min-width: 1200px)');

  useEffect(() => {
    setSidebarOpen(isLargeScreen);
  }, [isLargeScreen, setSidebarOpen]);

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-slate-200 bg-white transition-all duration-200 dark:border-slate-700 dark:bg-slate-900',
        sidebarOpen ? 'w-60' : 'w-16',
      )}
      aria-label="Main navigation"
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-700">
        {sidebarOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-lg font-bold text-primary-600 dark:text-primary-400"
          >
            GanttFlow
          </motion.span>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            'rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300',
            !sidebarOpen && 'mx-auto',
          )}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <ChevronLeft
            className={cn(
              'size-5 transition-transform',
              !sidebarOpen && 'rotate-180',
            )}
          />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                'focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900',
                isActive
                  ? 'bg-primary-200 text-primary-800 dark:bg-primary-900/70 dark:text-primary-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
                !sidebarOpen && 'justify-center px-2',
              )
            }

            title={item.label}
          >
            <item.icon className="size-5 shrink-0" aria-hidden="true" />
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
