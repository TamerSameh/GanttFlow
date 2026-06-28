import { memo, useMemo, useRef, useState, useEffect, useCallback, useId } from 'react';
import { useGanttStore } from '../store';
import { calculateLayout } from '../engine/layoutEngine';
import type { LayoutResult } from '../engine/layoutEngine';
import { useGanttDrag } from '../hooks/useGanttDrag';
import { TaskBar } from './TaskBar';
import { DependencyLine } from './DependencyLine';
import { TodayMarker } from './TodayMarker';
import { TimelineHeader } from './TimelineHeader';
import { Trash2, Copy, ArrowUpRight, Link2, Plus } from 'lucide-react';
import { useUIStore } from '@/stores';
import { EmptyState, Button } from '@/components/ui';

interface GanttChartProps {
  projectStart: string;
  projectEnd: string;
}

export const GanttChart = memo(function GanttChart({
  projectStart,
  projectEnd,
}: GanttChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(800);
  const tasks = useGanttStore((s) => s.tasks);
  const dependencies = useGanttStore((s) => s.dependencies);
  const zoomLevel = useGanttStore((s) => s.zoomLevel);
  const showCriticalPath = useGanttStore((s) => s.showCriticalPath);
  const selectedTaskIds = useGanttStore((s) => s.selectedTaskIds);
  const criticalPathResult = useGanttStore((s) => s.criticalPathResult);
  const dependencyDrawState = useGanttStore((s) => s.dependencyDrawState);
  const removeTask = useGanttStore((s) => s.removeTask);
  const addTask = useGanttStore((s) => s.addTask);
  const addToast = useUIStore((s) => s.addToast);
  const [contextMenu, setContextMenu] = useState<{ taskId: string; x: number; y: number } | null>(null);
  const markerId = useId();

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setViewportWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo<LayoutResult | null>(() => {
    if (tasks.length === 0) return null;
    return calculateLayout({
      tasks,
      dependencies,
      zoom: zoomLevel,
      projectStart,
      projectEnd,
      viewportWidth,
      criticalTaskIds: showCriticalPath
        ? (criticalPathResult?.taskIds ?? new Set())
        : new Set(),
    });
  }, [tasks, dependencies, zoomLevel, projectStart, projectEnd, viewportWidth, showCriticalPath, criticalPathResult]);

  const { startMove, startResize } = useGanttDrag(layout);

  const handleSvgContext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.target as SVGElement;
    const taskEl = target.closest('[data-task-id]');
    if (taskEl) {
      const taskId = taskEl.getAttribute('data-task-id');
      if (taskId) {
        setContextMenu({ taskId, x: e.clientX, y: e.clientY });
      }
    }
  }, []);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  useEffect(() => {
    if (!contextMenu) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-context-menu]')) closeContextMenu();
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeContextMenu();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [contextMenu, closeContextMenu]);

  const handleDuplicateTask = useCallback(() => {
    if (!contextMenu) return;
    const task = tasks.find((t) => t.id === contextMenu.taskId);
    if (!task) return;
    addTask({
      ...task,
      id: `task-${Date.now()}`,
      name: `${task.name} (copy)`,
      sortOrder: tasks.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    addToast({ message: 'Task duplicated', variant: 'success' });
    closeContextMenu();
  }, [contextMenu, tasks, addTask, addToast, closeContextMenu]);

  const handleDeleteTask = useCallback(() => {
    if (!contextMenu) return;
    removeTask(contextMenu.taskId);
    addToast({ message: 'Task deleted', variant: 'success' });
    closeContextMenu();
  }, [contextMenu, removeTask, addToast, closeContextMenu]);

  const handleFocusTask = useCallback(() => {
    if (!contextMenu) return;
    const task = tasks.find((t) => t.id === contextMenu.taskId);
    if (!task) return;
    addToast({ message: `Focusing on "${task.name}"`, variant: 'info' });
    closeContextMenu();
  }, [contextMenu, tasks, addToast, closeContextMenu]);

  const handleAddDependencyFromMenu = useCallback(() => {
    if (!contextMenu) return;
    addToast({ message: 'Click the dependency handle on another task to link', variant: 'info' });
    closeContextMenu();
  }, [contextMenu, addToast, closeContextMenu]);

  if (!layout) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          variant="tasks"
          title="No tasks yet"
          description="Add a task to start building your project schedule."
          action={<Button icon={<Plus className="size-4" />} onClick={() => useUIStore.getState().openModal('create-task')}>Add Task</Button>}
        />
      </div>
    );
  }

  const HEADER_HEIGHT = 52;
  const svgHeight = layout.totalHeight + HEADER_HEIGHT;

  return (
    <>
        <div
          ref={containerRef}
          className="h-full overflow-auto bg-white dark:bg-slate-900"
          onContextMenu={handleSvgContext}
        >
        {contextMenu && (
          <div
            data-context-menu
            style={{ left: contextMenu.x, top: contextMenu.y, position: 'fixed' }}
            className="z-50 min-w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-800"
            role="menu"
          >
            <button
              role="menuitem"
              onClick={handleDuplicateTask}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-inset dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Copy className="size-4 shrink-0" />
              <span className="flex-1 text-left">Duplicate Task</span>
              <span className="text-[11px] text-slate-400 font-mono">Ctrl+D</span>
            </button>
            <button
              role="menuitem"
              onClick={handleAddDependencyFromMenu}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-inset dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Link2 className="size-4 shrink-0" />
              <span className="flex-1 text-left">Add Dependency</span>
            </button>
            <button
              role="menuitem"
              onClick={handleFocusTask}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-inset dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <ArrowUpRight className="size-4 shrink-0" />
              <span className="flex-1 text-left">Focus on Task</span>
            </button>
            <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
            <button
              role="menuitem"
              onClick={handleDeleteTask}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm text-error-700 transition-colors hover:bg-error-50 focus-visible:ring-2 focus-visible:ring-error-500/50 focus-visible:ring-inset dark:text-error-300 dark:hover:bg-error-900/20"
            >
              <Trash2 className="size-4 shrink-0" />
              <span className="flex-1 text-left">Delete Task</span>
            </button>
          </div>
        )}
        <svg
          role="img"
          aria-label="Gantt chart timeline"
          width={Math.max(layout.totalWidth, viewportWidth)}
          height={svgHeight}
          className="min-w-full"
          style={{ display: 'block' }}
        >
          <defs>
          <marker
            id={`${markerId}-arrow-info`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-info-500" />
          </marker>
          <marker
            id={`${markerId}-arrow-critical`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-critical-500" />
          </marker>
        </defs>

        <rect
          x={0}
          y={0}
          width="100%"
          height={HEADER_HEIGHT}
          className="fill-white dark:fill-slate-900"
        />

        <line
          x1={0}
          y1={HEADER_HEIGHT}
          x2="100%"
          y2={HEADER_HEIGHT}
          className="stroke-slate-300 dark:stroke-slate-600"
          strokeWidth={1}
        />

        <TimelineHeader layout={layout} />

        <g transform={`translate(0, ${HEADER_HEIGHT})`}>
          {[...Array(Math.ceil(layout.totalHeight / 40))].map((_, i) => (
            <line
              key={i}
              x1={0}
              y1={i * 40}
              x2={layout.totalWidth}
              y2={i * 40}
              className="stroke-slate-300 dark:stroke-slate-700"
              strokeWidth={1}
            />
          ))}

          <g>
            {layout.dependencyPaths.map((depPath) => {
              const isCritical =
                showCriticalPath &&
                criticalPathResult?.dependencyIds.has(depPath.dependencyId);
              return (
                <DependencyLine
                  key={depPath.dependencyId}
                  path={depPath}
                  isCritical={isCritical ?? false}
                  markerPrefix={markerId}
                />
              );
            })}
          </g>

          {dependencyDrawState && (
            <line
              x1={dependencyDrawState.sourceX}
              y1={dependencyDrawState.sourceY}
              x2={dependencyDrawState.currentX}
              y2={dependencyDrawState.currentY}
              className="stroke-info-400 stroke-[2] stroke-dashed"
            />
          )}

          <g>
            {tasks.map((task) => {
              const pos = layout.taskPositions.get(task.id);
              if (!pos) return null;
              const isCritical =
                showCriticalPath &&
                criticalPathResult?.taskIds.has(task.id);
              return (
                <TaskBar
                  key={task.id}
                  position={pos}
                  taskId={task.id}
                  name={task.name}
                  progress={task.progress}
                  isCritical={isCritical ?? false}
                  isSelected={selectedTaskIds.has(task.id)}
                  isSummary={task.isSummary}
                  isMilestone={task.isMilestone}
                  onStartMove={startMove}
                  onStartResize={startResize}
                />
              );
            })}
          </g>

          <TodayMarker layout={layout} height={layout.totalHeight} />
        </g>
      </svg>
    </div>
    </>
  );
});