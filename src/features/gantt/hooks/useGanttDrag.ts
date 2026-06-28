import { useCallback, useEffect } from 'react';
import { useGanttStore } from '../store';
import { dateFromX } from '../engine/layoutEngine';
import type { LayoutResult } from '../engine/layoutEngine';

export function useGanttDrag(layout: LayoutResult | null) {
  const tasks = useGanttStore((s) => s.tasks);
  const moveTask = useGanttStore((s) => s.moveTask);
  const resizeTask = useGanttStore((s) => s.resizeTask);
  const dragState = useGanttStore((s) => s.dragState);
  const setDragState = useGanttStore((s) => s.setDragState);

  const startMove = useCallback(
    (taskId: string, clientX: number) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task || !layout) return;

      setDragState({
        taskId,
        type: 'move',
        startX: clientX,
        currentX: clientX,
        originalStartDate: task.startDate,
        originalEndDate: task.endDate,
      });
    },
    [tasks, layout, setDragState],
  );

  const startResize = useCallback(
    (taskId: string, clientX: number, edge: 'start' | 'end') => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task || !layout) return;

      setDragState({
        taskId,
        type: edge === 'start' ? 'resize-start' : 'resize-end',
        startX: clientX,
        currentX: clientX,
        originalStartDate: task.startDate,
        originalEndDate: task.endDate,
      });
    },
    [tasks, layout, setDragState],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState || !layout) return;

      const dx = e.clientX - dragState.startX;
      const newDate = dateFromX(
        layout.pxPerDay > 0
          ? (dragState.startX + dx)
          : 0,
        layout,
      );

      switch (dragState.type) {
        case 'move':
          moveTask(dragState.taskId, newDate);
          break;
        case 'resize-end':
          resizeTask(dragState.taskId, newDate);
          break;
        case 'resize-start': {
          const task = tasks.find((t) => t.id === dragState.taskId);
          if (task) {
            const oldEnd = new Date(task.endDate);
            if (newDate < oldEnd) {
              moveTask(dragState.taskId, newDate);
            }
          }
          break;
        }
      }

      setDragState({ ...dragState, currentX: e.clientX });
    },
    [dragState, layout, moveTask, resizeTask, tasks, setDragState],
  );

  const handleMouseUp = useCallback(() => {
    setDragState(null);
  }, [setDragState]);

  useEffect(() => {
    if (!dragState) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, handleMouseMove, handleMouseUp]);

  return { startMove, startResize, isDragging: dragState !== null };
}