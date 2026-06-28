export type ZoomLevel = 'day' | 'week' | 'month' | 'quarter';

export interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TaskPosition {
  taskId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMilestone: boolean;
  isSummary: boolean;
}

export interface DependencyPath {
  dependencyId: string;
  predecessorId: string;
  successorId: string;
  path: string;
  isCritical?: boolean;
}

export interface DragState {
  taskId: string;
  type: 'move' | 'resize-start' | 'resize-end' | 'draw-dependency';
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  originalStartDate: string;
  originalEndDate: string;
}

export interface DependencyDrawState {
  sourceTaskId: string;
  sourceX: number;
  sourceY: number;
  currentX: number;
  currentY: number;
}

export interface CriticalPathResult {
  taskIds: Set<string>;
  dependencyIds: Set<string>;
  totalFloat: Map<string, number>;
}

export interface GanttLayout {
  tasks: TaskPosition[];
  dependencies: DependencyPath[];
  totalHeight: number;
  totalWidth: number;
}

export type TaskDragHandler = (taskId: string, newStartDate: Date) => void;
export type TaskResizeHandler = (taskId: string, newEndDate: Date) => void;
export type DependencyCreateHandler = (
  predecessorId: string,
  successorId: string,
) => void;
