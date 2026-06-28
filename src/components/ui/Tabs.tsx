import { type ReactNode, createContext, useContext, useState } from 'react';
import { cn } from '@/utils/cn';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  badge?: string;
  disabled?: boolean;
}

interface TabsContext {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsCtx = createContext<TabsContext | null>(null);

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  onChange?: (id: string) => void;
}

export function Tabs({ tabs, defaultTab, className, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id ?? '');

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <TabsCtx.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={cn('flex flex-col', className)}>
        <div
          className="flex border-b border-slate-200 dark:border-slate-700"
          role="tablist"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-disabled={tab.disabled}
                disabled={tab.disabled}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
                  'focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-inset',
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300',
                  tab.disabled && 'cursor-not-allowed opacity-50',
                )}
              >
                {tab.label}
                {tab.badge && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[11px] font-medium',
                      isActive
                        ? 'bg-primary-200 text-primary-800 dark:bg-primary-900/70 dark:text-primary-200'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 dark:bg-primary-400" />
                )}
              </button>
            );
          })}
        </div>
        <div role="tabpanel" className="pt-4">
          {activeContent}
        </div>
      </div>
    </TabsCtx.Provider>
  );
}

export function useTabs() {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error('useTabs must be used within Tabs');
  return ctx;
}