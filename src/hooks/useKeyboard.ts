import { useEffect } from 'react';

type KeyMap = Record<string, (e: KeyboardEvent) => void>;

export function useKeyboard(keys: KeyMap, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      const key = [e.ctrlKey || e.metaKey ? 'Ctrl+' : '', e.key].join('');
      const handlerFn = keys[key] ?? keys[e.key];
      if (handlerFn) {
        handlerFn(e);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [keys, enabled]);
}
