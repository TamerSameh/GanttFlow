import { useCallback } from 'react';
import { useGanttStore } from '../store';

export function useTaskSelection() {
  const selectedTaskIds = useGanttStore((s) => s.selectedTaskIds);
  const selectTask = useGanttStore((s) => s.selectTask);
  const clearSelection = useGanttStore((s) => s.clearSelection);
  const selectAll = useGanttStore((s) => s.selectAll);

  const isSelected = useCallback(
    (id: string) => selectedTaskIds.has(id),
    [selectedTaskIds],
  );

  const handleTaskClick = useCallback(
    (id: string, e: React.MouseEvent) => {
      const multi = e.shiftKey || e.ctrlKey || e.metaKey;
      selectTask(id, multi);
      if (!multi) {
        clearSelection();
        selectTask(id, false);
      }
    },
    [selectTask, clearSelection],
  );

  return {
    selectedTaskIds,
    isSelected,
    handleTaskClick,
    clearSelection,
    selectAll,
    selectionCount: selectedTaskIds.size,
  };
}