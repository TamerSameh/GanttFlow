import { useCallback, useRef } from 'react';
import { useGanttStore } from '../store';
import { useUIStore } from '@/stores';
import { validateDependency } from '../engine/dependencyGraph';

export function useDependencyDraw() {
  const dependencies = useGanttStore((s) => s.dependencies);
  const addDependency = useGanttStore((s) => s.addDependency);
  const setDependencyDrawState = useGanttStore((s) => s.setDependencyDrawState);
  const dependencyDrawState = useGanttStore((s) => s.dependencyDrawState);
  const addToast = useUIStore((s) => s.addToast);
  const sourceTaskRef = useRef<string | null>(null);

  const startDraw = useCallback(
    (taskId: string, x: number, y: number) => {
      sourceTaskRef.current = taskId;
      setDependencyDrawState({
        sourceTaskId: taskId,
        sourceX: x,
        sourceY: y,
        currentX: x,
        currentY: y,
      });
    },
    [setDependencyDrawState],
  );

  const updateDraw = useCallback(
    (x: number, y: number) => {
      if (!dependencyDrawState) return;
      setDependencyDrawState({
        ...dependencyDrawState,
        currentX: x,
        currentY: y,
      });
    },
    [dependencyDrawState, setDependencyDrawState],
  );

  const finishDraw = useCallback(
    (targetTaskId: string | null) => {
      const sourceId = sourceTaskRef.current;
      sourceTaskRef.current = null;
      setDependencyDrawState(null);

      if (!sourceId || !targetTaskId || sourceId === targetTaskId) return;

      const validation = validateDependency(sourceId, targetTaskId, dependencies);
      if (!validation.valid) {
        addToast({
          message: validation.error ?? 'Invalid dependency',
          variant: 'error',
        });
        return;
      }

      addDependency({
        id: `dep-${Date.now()}`,
        projectId: '',
        predecessorId: sourceId,
        successorId: targetTaskId,
        type: 'FS',
        lag: 0,
      });

      addToast({ message: 'Dependency created', variant: 'success' });
    },
    [dependencies, addDependency, setDependencyDrawState, addToast],
  );

  const cancelDraw = useCallback(() => {
    sourceTaskRef.current = null;
    setDependencyDrawState(null);
  }, [setDependencyDrawState]);

  return { startDraw, updateDraw, finishDraw, cancelDraw, dependencyDrawState };
}