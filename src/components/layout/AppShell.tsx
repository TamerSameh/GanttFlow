import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar, navItems } from './Sidebar';
import { Header } from './Header';
import { Drawer } from '@/components/ui';
import { QuickActions } from '@/features/onboarding/QuickActions';
import { CommandPalette } from '@/features/command-palette/CommandPalette';
import { GlobalSearch } from '@/features/search/GlobalSearch';
import { ShortcutsCheatSheet } from '@/components/ui/ShortcutsCheatSheet';
import { ModalManager } from '@/features/modals/ModalManager';
import { useUIStore } from '@/stores';
import { useShortcuts } from '@/hooks/useShortcuts';
import { cn } from '@/utils/cn';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

const pageTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

function GlobalOverlays() {
  const commandPaletteOpen = useUIStore((s) => s.commandPaletteOpen);
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const globalSearchOpen = useUIStore((s) => s.globalSearchOpen);
  const setGlobalSearchOpen = useUIStore((s) => s.setGlobalSearchOpen);
  const shortcutsCheatSheetOpen = useUIStore((s) => s.shortcutsCheatSheetOpen);
  const setShortcutsCheatSheetOpen = useUIStore((s) => s.setShortcutsCheatSheetOpen);
  const toggleCommandPalette = useUIStore((s) => s.toggleCommandPalette);
  const toggleShortcutsCheatSheet = useUIStore((s) => s.toggleShortcutsCheatSheet);
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);

  useShortcuts([
    {
      key: 'k',
      ctrl: true,
      handler: () => toggleCommandPalette(),
      description: 'Open command palette',
      category: 'Global',
    },
    {
      key: '/',
      handler: () => {
        setGlobalSearchOpen(true);
        setCommandPaletteOpen(false);
      },
      description: 'Search projects, tasks, people',
      category: 'Global',
    },
    {
      key: '?',
      shift: true,
      handler: () => toggleShortcutsCheatSheet(),
      description: 'Show keyboard shortcuts',
      category: 'Global',
    },
  ]);

  return (
    <>
      <Drawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        title="Navigation"
        side="left"
      >
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-200 text-primary-800 dark:bg-primary-900/70 dark:text-primary-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
                )
              }
            >
              <item.icon className="size-5 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </Drawer>
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
      <GlobalSearch
        open={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
      />
      <ShortcutsCheatSheet
        open={shortcutsCheatSheetOpen}
        onClose={() => setShortcutsCheatSheetOpen(false)}
      />
    </>
  );
}

export function AppShell() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="h-full will-change-transform"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <QuickActions />
      <GlobalOverlays />
      <ModalManager />
    </div>
  );
}