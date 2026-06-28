import { create } from 'zustand';
import type { Theme } from '@/types';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') return getSystemTheme();
  return theme;
}

export const useThemeStore = create<ThemeState>((set, get) => {
  const saved = (typeof localStorage !== 'undefined'
    ? (localStorage.getItem('ganttflow-theme') as Theme | null)
    : null) ?? 'system';
  const initialResolved = resolveTheme(saved);

  applyTheme(initialResolved);

  let mediaQuery: MediaQueryList | null = null;
  let mediaQueryHandler: ((this: MediaQueryList, ev: MediaQueryListEvent) => void) | null = null;

  if (saved === 'system' && typeof window !== 'undefined') {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQueryHandler = (_e: MediaQueryListEvent) => {
      const resolved = resolveTheme(get().theme);
      applyTheme(resolved);
      set({ resolvedTheme: resolved });
    };
    mediaQuery.addEventListener('change', mediaQueryHandler);
  }

  return {
    theme: saved,
    resolvedTheme: initialResolved,
    setTheme: (theme: Theme) => {
      if (mediaQuery && mediaQueryHandler) {
        mediaQuery.removeEventListener('change', mediaQueryHandler);
        mediaQuery = null;
        mediaQueryHandler = null;
      }
      localStorage.setItem('ganttflow-theme', theme);
      if (theme === 'system' && typeof window !== 'undefined') {
        mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQueryHandler = (_e: MediaQueryListEvent) => {
          const resolved = resolveTheme(get().theme);
          applyTheme(resolved);
          set({ resolvedTheme: resolved });
        };
        mediaQuery.addEventListener('change', mediaQueryHandler);
      }
      const resolved = resolveTheme(theme);
      applyTheme(resolved);
      set({ theme, resolvedTheme: resolved });
    },
  };
});
