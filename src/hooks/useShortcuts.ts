import { useEffect, useRef } from 'react';

type ShortcutHandler = (e: KeyboardEvent) => void;

export interface Shortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  handler: ShortcutHandler;
  description: string;
  category: string;
}

const registry = new Map<string, Shortcut>();

function shortcutId(s: Pick<Shortcut, 'key' | 'ctrl' | 'meta' | 'shift'>): string {
  return [s.ctrl && 'Ctrl', s.meta && 'Meta', s.shift && 'Shift', s.key.toUpperCase()]
    .filter(Boolean)
    .join('+');
}

export function registerShortcut(shortcut: Shortcut): () => void {
  const id = shortcutId(shortcut);
  registry.set(id, shortcut);
  return () => { registry.delete(id); };
}

export function unregisterAllShortcuts(): void {
  registry.clear();
}

export function getShortcuts(): Shortcut[] {
  return Array.from(registry.values());
}

export function getShortcutsByCategory(): Record<string, Shortcut[]> {
  const grouped: Record<string, Shortcut[]> = {};
  for (const s of registry.values()) {
    const cat = s.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat]!.push(s);
  }
  return grouped;
}

function matchesModifiers(e: KeyboardEvent, s: Shortcut): boolean {
  const isMac = navigator.platform.includes('Mac');
  const primaryMod = isMac ? e.metaKey : e.ctrlKey;
  if (s.ctrl && !primaryMod) return false;
  if (!s.ctrl && primaryMod) return false;
  if (s.shift && !e.shiftKey) return false;
  if (!s.shift && e.shiftKey) return false;
  return true;
}

export function useShortcuts(shortcuts: Shortcut[], enabled = true) {
  const cleanupRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const cleanups = shortcuts.map((s) => registerShortcut(s));
    cleanupRef.current = cleanups;

    const handler = (e: KeyboardEvent) => {
      for (const s of shortcuts) {
        if (e.key.toLowerCase() !== s.key.toLowerCase()) continue;
        if (!matchesModifiers(e, s)) continue;

        e.preventDefault();
        e.stopPropagation();
        s.handler(e);
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      cleanups.forEach((c) => c());
    };
  }, [shortcuts, enabled]);
}

if (import.meta.hot) {
  import.meta.hot.dispose(unregisterAllShortcuts);
}
