import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Sun, Moon, Command, Search, Menu } from 'lucide-react';
import { useThemeStore, useUIStore } from '@/stores';
import { Avatar } from '@/components/ui';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/resources': 'Resources',
  '/portfolio': 'Portfolio',
  '/templates': 'Templates',
  '/settings': 'Settings',
};

function useBreadcrumbs(pathname: string) {
  return useMemo(() => {
    const parts: { label: string; to?: string }[] = [];
    const projectMatch = pathname.match(/^\/projects\/(.+)$/);
    if (projectMatch) {
      parts.push({ label: 'Projects', to: '/projects' });
    }
    return parts;
  }, [pathname]);
}

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();
  const addToast = useUIStore((s) => s.addToast);

  const title = routeTitles[location.pathname] ?? 'GanttFlow';
  const breadcrumbs = useBreadcrumbs(location.pathname);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <button
          onClick={() => useUIStore.getState().toggleMobileNav()}
          className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 md:hidden dark:hover:bg-slate-800 dark:hover:text-slate-300"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </button>
        {breadcrumbs.length > 0 ? (
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate(breadcrumbs[0]!.to!)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {breadcrumbs[0]!.label}
            </button>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="font-semibold text-slate-900 dark:text-slate-50">{title}</span>
          </div>
        ) : (
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => useUIStore.getState().setGlobalSearchOpen(true)}
          className="group hidden h-9 w-64 items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm text-slate-400 transition-colors hover:border-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 sm:flex dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500 dark:hover:border-slate-500"
        >
          <Search className="size-4 shrink-0" />
          <span className="flex-1 text-left">Search projects, tasks...</span>
          <kbd className="flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] dark:border-slate-600 dark:bg-slate-700">
            <Command className="size-3" />
            /
          </kbd>
        </button>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>

        <button
          onClick={() =>
            addToast({ message: 'No new notifications', variant: 'info' })
          }
          className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
        </button>

        <Avatar name="Alex Morgan" size="sm" />
      </div>
    </header>
  );
}
