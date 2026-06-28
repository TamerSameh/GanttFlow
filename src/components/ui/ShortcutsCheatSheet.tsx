import { Command } from 'lucide-react';
import { Modal } from './Modal';
import { getShortcutsByCategory } from '@/hooks/useShortcuts';
import { isMac } from '@/utils';

interface ShortcutsCheatSheetProps {
  open: boolean;
  onClose: () => void;
}

export function ShortcutsCheatSheet({ open, onClose }: ShortcutsCheatSheetProps) {
  const grouped = getShortcutsByCategory();

  return (
    <Modal open={open} onClose={onClose} title="Keyboard Shortcuts" size="lg">
      <div className="space-y-6">
        {Object.entries(grouped).map(([category, shortcuts]) => (
          <div key={category}>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {category}
            </h4>
            <div className="space-y-1">
              {shortcuts.map((s) => (
                <div
                  key={s.key + (s.ctrl ? 'Ctrl' : '')}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <span className="text-slate-700 dark:text-slate-300">
                    {s.description}
                  </span>
                  <kbd className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400">
                    {s.ctrl && (
                      isMac() ? (
                        <Command className="size-3" />
                      ) : (
                        <span className="text-[11px]">Ctrl</span>
                      )
                    )}
                    {s.ctrl && <span>+</span>}
                    {s.shift && <span>Shift + </span>}
                    <span>{s.key.toUpperCase()}</span>
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
