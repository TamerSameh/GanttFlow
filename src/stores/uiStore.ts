import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Toast, ModalType } from '@/types';

interface UIState {
  sidebarOpen: boolean;
  toasts: Toast[];
  activeModal: ModalType | null;
  modalData: unknown;

  commandPaletteOpen: boolean;
  globalSearchOpen: boolean;
  shortcutsCheatSheetOpen: boolean;
  mobileNavOpen: boolean;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (type: ModalType, data?: unknown) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;

  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleGlobalSearch: () => void;
  setGlobalSearchOpen: (open: boolean) => void;
  toggleShortcutsCheatSheet: () => void;
  setShortcutsCheatSheetOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
  setMobileNavOpen: (open: boolean) => void;
}

let toastCounter = 0;

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
  sidebarOpen: true,
  toasts: [],
  activeModal: null,
  modalData: null,

  commandPaletteOpen: false,
  globalSearchOpen: false,
  shortcutsCheatSheetOpen: false,
  mobileNavOpen: false,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  openModal: (type, data) => set({ activeModal: type, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  addToast: (toast) => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 5000);
    return id;
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  toggleCommandPalette: () =>
    set((s) => ({
      commandPaletteOpen: !s.commandPaletteOpen,
      globalSearchOpen: false,
    })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open, globalSearchOpen: false }),

  toggleGlobalSearch: () =>
    set((s) => ({
      globalSearchOpen: !s.globalSearchOpen,
      commandPaletteOpen: false,
    })),
  setGlobalSearchOpen: (open) => set({ globalSearchOpen: open, commandPaletteOpen: false }),

  toggleShortcutsCheatSheet: () => set((s) => ({ shortcutsCheatSheetOpen: !s.shortcutsCheatSheetOpen })),
  setShortcutsCheatSheetOpen: (open) => set({ shortcutsCheatSheetOpen: open }),
  toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen })),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
}),
    {
      name: 'ganttflow-ui',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        mobileNavOpen: state.mobileNavOpen,
      }),
    },
  ),
);
