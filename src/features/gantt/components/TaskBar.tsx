import { memo, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { useGanttStore } from '../store';
import { useTaskSelection } from '../hooks/useTaskSelection';
import { useDependencyDraw } from '../hooks/useDependencyDraw';
import { TASK_BAR_HEIGHT } from '../engine/layoutEngine';
import type { TaskPosition } from '@/types';

interface TaskBarProps {
  position: TaskPosition;
  taskId: string;
  name: string;
  progress: number;
  isCritical: boolean;
  isSelected: boolean;
  isSummary: boolean;
  isMilestone: boolean;
  onStartMove: (taskId: string, clientX: number) => void;
  onStartResize: (taskId: string, clientX: number, edge: 'start' | 'end') => void;
}

export const TaskBar = memo(function TaskBar({
  position,
  taskId,
  name,
  progress,
  isCritical,
  isSelected,
  isSummary,
  isMilestone,
  onStartMove,
  onStartResize,
}: TaskBarProps) {
  const updateTask = useGanttStore((s) => s.updateTask);
  const { handleTaskClick } = useTaskSelection();
  const { startDraw, updateDraw, finishDraw } = useDependencyDraw();
  const barRef = useRef<SVGGElement>(null);
  const drawCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      drawCleanupRef.current?.();
      drawCleanupRef.current = null;
    };
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      handleTaskClick(taskId, e);
      onStartMove(taskId, e.clientX);
    },
    [taskId, handleTaskClick, onStartMove],
  );

  const handleDependencyStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      drawCleanupRef.current?.();
      const svg = barRef.current?.closest('svg');
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      startDraw(taskId, e.clientX - rect.left, e.clientY - rect.top);

      const handleMove = (ev: MouseEvent) => {
        updateDraw(ev.clientX - rect.left, ev.clientY - rect.top);
      };
      const handleUp = () => {
        const target = document.elementFromPoint(
          (svg as unknown as SVGSVGElement).viewportElement?.getBoundingClientRect()?.left ?? 0,
          0,
        );
        const targetBar = target?.closest('[data-task-id]');
        finishDraw(targetBar?.getAttribute('data-task-id') ?? null);
        cleanup();
      };

      const cleanup = () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
        drawCleanupRef.current = null;
      };

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
      drawCleanupRef.current = cleanup;
    },
    [taskId, startDraw, updateDraw, finishDraw],
  );

  const handleProgressClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      const newProgress = Math.round(Math.max(0, Math.min(100, pct * 100)));
      updateTask(taskId, { progress: newProgress });
    },
    [taskId, updateTask],
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onStartResize(taskId, e.clientX, 'end');
    },
    [taskId, onStartResize],
  );

  if (isMilestone) {
    const size = 16;
    const cx = position.x + position.width / 2;
    const cy = position.y + TASK_BAR_HEIGHT / 2;
    return (
      <g
        ref={barRef}
        data-task-id={taskId}
        className="cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        <polygon
          points={`${cx},${cy - size / 2} ${cx + size / 2},${cy} ${cx},${cy + size / 2} ${cx - size / 2},${cy}`}
          className={cn(
            'fill-milestone-500 stroke-milestone-600 stroke-1',
            isSelected && 'stroke-2 stroke-primary-500',
            isCritical && 'fill-critical-500',
          )}
        />
        <title>{name}</title>
      </g>
    );
  }

  const barX = position.x;
  const barY = position.y;
  const barWidth = position.width;
  const progressWidth = (progress / 100) * barWidth;

  return (
    <g
      ref={barRef}
      data-task-id={taskId}
      className="cursor-pointer group"
      onMouseDown={handleMouseDown}
    >
      <rect
        x={barX}
        y={barY}
        width={barWidth}
        height={TASK_BAR_HEIGHT}
        rx={4}
        className={cn(
          'fill-primary-400 stroke-primary-500 stroke-1',
          isSummary && 'fill-primary-300 stroke-dashed',
          isCritical && 'fill-critical-400 stroke-critical-500',
        )}
      />
      <rect
        x={barX}
        y={barY}
        width={progressWidth}
        height={TASK_BAR_HEIGHT}
        rx={4}
        className={cn(
          'fill-primary-600',
          isCritical && 'fill-critical-600',
        )}
        style={{ clipPath: `inset(0 ${barWidth - progressWidth}px 0 0)` }}
      />
      {isSelected && (
        <rect
          x={barX - 2}
          y={barY - 2}
          width={barWidth + 4}
          height={TASK_BAR_HEIGHT + 4}
          rx={6}
          fill="none"
          className="stroke-primary-500 stroke-2"
          pointerEvents="none"
        />
      )}
      <text
        x={barX + 6}
        y={barY + TASK_BAR_HEIGHT / 2 + 1}
        className="fill-white text-[11px] font-medium pointer-events-none"
        dominantBaseline="central"
      >
        {barWidth > 60 ? name : ''}
      </text>
      <rect
        x={barX + barWidth - 4}
        y={barY}
        width={8}
        height={TASK_BAR_HEIGHT}
        rx={2}
        className="fill-transparent cursor-ew-resize hover:fill-primary-700/20"
        onMouseDown={handleResizeStart}
      />
      <circle
        cx={barX + barWidth + 8}
        cy={barY + TASK_BAR_HEIGHT / 2}
        r={5}
        className="fill-transparent cursor-crosshair hover:fill-info-500/40 group-hover:fill-info-500/20"
        onMouseDown={handleDependencyStart}
      />
      <rect
        x={barX}
        y={barY + TASK_BAR_HEIGHT + 2}
        width={barWidth}
        height={4}
        rx={2}
        className="cursor-pointer fill-transparent hover:fill-primary-500/20"
        onMouseDown={handleProgressClick}
      />
      <title>{`${name} - ${progress}%`}</title>
    </g>
  );
});