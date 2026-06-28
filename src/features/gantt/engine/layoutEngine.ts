import {
  differenceInCalendarDays,
  addDays,
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfQuarter,
} from 'date-fns';
import type { Task, Dependency, ZoomLevel, TaskPosition, DependencyPath } from '@/types';

export const ROW_HEIGHT = 40;
export const ROW_GAP = 4;
export const TASK_BAR_HEIGHT = 24;
export const DEPENDENCY_HANDLE_RADIUS = 5;

const ZOOM_PX_PER_DAY: Record<ZoomLevel, number> = {
  day: 48,
  week: 24,
  month: 10,
  quarter: 4,
};

export function getPxPerDay(zoom: ZoomLevel): number {
  return ZOOM_PX_PER_DAY[zoom];
}

export function getTimelineStart(projectStart: string, zoom: ZoomLevel): Date {
  const date = startOfDay(new Date(projectStart));
  switch (zoom) {
    case 'day':
      return startOfDay(date);
    case 'week':
      return startOfWeek(date, { weekStartsOn: 1 });
    case 'month':
      return startOfMonth(date);
    case 'quarter':
      return startOfQuarter(date);
  }
}

export function getTimelineEnd(projectEnd: string, zoom: ZoomLevel): Date {
  const date = startOfDay(new Date(projectEnd));
  switch (zoom) {
    case 'day':
      return addDays(startOfDay(date), 1);
    case 'week':
      return addDays(startOfWeek(addDays(date, 7), { weekStartsOn: 1 }), 1);
    case 'month':
      return addDays(startOfMonth(addDays(date, 31)), 1);
    case 'quarter':
      return addDays(startOfQuarter(addDays(date, 92)), 1);
  }
}

export interface LayoutInput {
  tasks: Task[];
  dependencies: Dependency[];
  zoom: ZoomLevel;
  projectStart: string;
  projectEnd: string;
  viewportWidth: number;
  criticalTaskIds: Set<string>;
}

export interface LayoutResult {
  taskPositions: Map<string, TaskPosition>;
  dependencyPaths: DependencyPath[];
  totalHeight: number;
  totalWidth: number;
  timelineStart: Date;
  timelineEnd: Date;
  pxPerDay: number;
  zoomLevel: ZoomLevel;
}

function buildTaskTree(tasks: Task[]): { visible: Task[]; totalRows: number } {
  const byParent = new Map<string | null, Task[]>();
  for (const task of tasks) {
    const key = task.parentId ?? '__root__';
    const group = byParent.get(key);
    if (group) {
      group.push(task);
    } else {
      byParent.set(key, [task]);
    }
  }

  const rootTasks = byParent.get('__root__') ?? [];
  rootTasks.sort((a, b) => a.sortOrder - b.sortOrder);

  const visible: Task[] = [];

  function flatten(parentId: string | null, depth: number) {
    const children = byParent.get(parentId) ?? [];
    children.sort((a, b) => a.sortOrder - b.sortOrder);

    for (const child of children) {
      visible.push(child);
      flatten(child.id, depth + 1);
    }
  }

  flatten('__root__', 0);
  return { visible, totalRows: visible.length };
}

export function calculateLayout(input: LayoutInput): LayoutResult {
  const { tasks, dependencies, zoom, projectStart, projectEnd, viewportWidth, criticalTaskIds } = input;

  const timelineStart = getTimelineStart(projectStart, zoom);
  const timelineEnd = getTimelineEnd(projectEnd, zoom);
  const pxPerDay = getPxPerDay(zoom);

  const totalDays = differenceInCalendarDays(timelineEnd, timelineStart);
  const totalWidth = Math.max(totalDays * pxPerDay, viewportWidth);

  const { visible: orderedTasks, totalRows } = buildTaskTree(tasks);
  const totalHeight = totalRows * (ROW_HEIGHT + ROW_GAP) + ROW_GAP;

  const taskPositions = new Map<string, TaskPosition>();

  let rowIndex = 0;
  for (const task of orderedTasks) {
    const taskStart = startOfDay(new Date(task.startDate));
    const taskEnd = startOfDay(new Date(task.endDate));

    const daysFromStart = differenceInCalendarDays(taskStart, timelineStart);
    const durationDays = Math.max(differenceInCalendarDays(taskEnd, taskStart), 0.5);

    const x = daysFromStart * pxPerDay;
    const width = durationDays * pxPerDay;
    const y = rowIndex * (ROW_HEIGHT + ROW_GAP) + ROW_GAP;

    taskPositions.set(task.id, {
      taskId: task.id,
      x,
      y,
      width: Math.max(width, 4),
      height: TASK_BAR_HEIGHT,
      isMilestone: task.isMilestone,
      isSummary: task.isSummary,
    });

    rowIndex++;
  }

  const rowMidpoints = new Map<string, number>();
  for (const [id, pos] of taskPositions) {
    rowMidpoints.set(id, pos.y + pos.height / 2);
  }

  const dependencyPaths: DependencyPath[] = [];
  for (const dep of dependencies) {
    const predPos = taskPositions.get(dep.predecessorId);
    const succPos = taskPositions.get(dep.successorId);
    if (!predPos || !succPos) continue;

    const x1 = predPos.x + predPos.width;
    const y1 = predPos.y + predPos.height / 2;
    const x2 = succPos.x;
    const y2 = succPos.y + succPos.height / 2;

    const midX = (x1 + x2) / 2;
    const padding = 8;

    const path = `M ${x1} ${y1} L ${x1 + padding} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2 - padding} ${y2} L ${x2} ${y2}`;

    const isCritical =
      criticalTaskIds.has(dep.predecessorId) &&
      criticalTaskIds.has(dep.successorId);

    dependencyPaths.push({
      dependencyId: dep.id,
      predecessorId: dep.predecessorId,
      successorId: dep.successorId,
      path,
      isCritical,
    });
  }

  return {
    taskPositions,
    dependencyPaths,
    totalHeight,
    totalWidth,
    timelineStart,
    timelineEnd,
    pxPerDay,
    zoomLevel: zoom,
  };
}

export function dateFromX(x: number, layout: LayoutResult): Date {
  const days = x / layout.pxPerDay;
  return addDays(layout.timelineStart, Math.floor(days));
}

export function xFromDate(date: Date, layout: LayoutResult): number {
  const days = differenceInCalendarDays(startOfDay(date), layout.timelineStart);
  return days * layout.pxPerDay;
}
