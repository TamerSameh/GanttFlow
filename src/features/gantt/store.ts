import { create } from 'zustand';
import type { Task, Dependency, Resource, Assignment, ZoomLevel } from '@/types';
import { calculateSchedule } from './engine/scheduleEngine';
import { findCriticalPath } from './engine/criticalPath';
import type { ScheduleResult } from './engine/scheduleEngine';
import type { CriticalPathResult } from '@/types';

interface DragInteraction {
  taskId: string;
  type: 'move' | 'resize-start' | 'resize-end';
  startX: number;
  currentX: number;
  originalStartDate: string;
  originalEndDate: string;
}

interface DependencyDrawInteraction {
  sourceTaskId: string;
  sourceX: number;
  sourceY: number;
  currentX: number;
  currentY: number;
}

export interface GanttState {
  tasks: Task[];
  dependencies: Dependency[];
  resources: Resource[];
  assignments: Assignment[];

  zoomLevel: ZoomLevel;
  selectedTaskIds: Set<string>;
  showCriticalPath: boolean;

  dragState: DragInteraction | null;
  dependencyDrawState: DependencyDrawInteraction | null;

  scheduleResult: ScheduleResult | null;
  criticalPathResult: CriticalPathResult | null;

  todayMarkerDate: string;

  setTasks: (tasks: Task[]) => void;
  setDependencies: (deps: Dependency[]) => void;
  setResources: (resources: Resource[]) => void;
  setAssignments: (assignments: Assignment[]) => void;

  addTask: (task: Task) => void;
  updateTask: (id: string, changes: Partial<Task>) => void;
  removeTask: (id: string) => void;
  moveTask: (id: string, newStartDate: Date) => void;
  resizeTask: (id: string, newEndDate: Date) => void;

  addDependency: (dep: Dependency) => void;
  removeDependency: (id: string) => void;

  setZoomLevel: (level: ZoomLevel) => void;
  toggleCriticalPath: () => void;
  selectTask: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  selectAll: () => void;

  setDragState: (state: DragInteraction | null) => void;
  setDependencyDrawState: (state: DependencyDrawInteraction | null) => void;

  setTodayMarkerDate: (date: string) => void;

  recalculateSchedule: () => void;
}

export const useGanttStore = create<GanttState>((set, get) => ({
  tasks: [],
  dependencies: [],
  resources: [],
  assignments: [],

  zoomLevel: 'week',
  selectedTaskIds: new Set(),
  showCriticalPath: false,

  dragState: null,
  dependencyDrawState: null,

  scheduleResult: null,
  criticalPathResult: null,
  todayMarkerDate: new Date().toISOString().split('T')[0]!,

  setTasks: (tasks) => {
    set({ tasks });
    get().recalculateSchedule();
  },

  setDependencies: (dependencies) => {
    set({ dependencies });
    get().recalculateSchedule();
  },

  setResources: (resources) => set({ resources }),
  setAssignments: (assignments) => set({ assignments }),

  addTask: (task) => {
    set((s) => ({ tasks: [...s.tasks, task] }));
    get().recalculateSchedule();
  },

  updateTask: (id, changes) => {
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...changes } : t)),
    }));
    if (changes.startDate || changes.endDate || changes.progress !== undefined || changes.status) {
      get().recalculateSchedule();
    }
  },

  removeTask: (id) => {
    set((s) => ({
      tasks: s.tasks.filter((t) => t.id !== id),
      dependencies: s.dependencies.filter(
        (d) => d.predecessorId !== id && d.successorId !== id,
      ),
      selectedTaskIds: new Set(
        [...s.selectedTaskIds].filter((tid) => tid !== id),
      ),
    }));
    get().recalculateSchedule();
  },

  moveTask: (id, newStartDate) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const oldStart = new Date(task.startDate);
    const oldEnd = new Date(task.endDate);
    const duration = Math.max(
      (oldEnd.getTime() - oldStart.getTime()) / (1000 * 60 * 60 * 24),
      1,
    );
    const newEnd = new Date(newStartDate);
    newEnd.setDate(newEnd.getDate() + duration);

    const startStr = newStartDate.toISOString().split('T')[0]!;
    const endStr = newEnd.toISOString().split('T')[0]!;

    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, startDate: startStr, endDate: endStr } : t,
      ),
    }));
    get().recalculateSchedule();
  },

  resizeTask: (id, newEndDate) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const endStr = newEndDate.toISOString().split('T')[0]!;

    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, endDate: endStr } : t,
      ),
    }));
    get().recalculateSchedule();
  },

  addDependency: (dep) => {
    set((s) => ({ dependencies: [...s.dependencies, dep] }));
    get().recalculateSchedule();
  },

  removeDependency: (id) => {
    set((s) => ({
      dependencies: s.dependencies.filter((d) => d.id !== id),
    }));
    get().recalculateSchedule();
  },

  setZoomLevel: (zoomLevel) => set({ zoomLevel }),

  toggleCriticalPath: () =>
    set((s) => ({ showCriticalPath: !s.showCriticalPath })),

  selectTask: (id, multi = false) => {
    set((s) => {
      const next = new Set(multi ? s.selectedTaskIds : []);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedTaskIds: next };
    });
  },

  clearSelection: () => set({ selectedTaskIds: new Set() }),
  selectAll: () => {
    set((s) => ({
      selectedTaskIds: new Set(s.tasks.map((t) => t.id)),
    }));
  },

  setDragState: (dragState) => set({ dragState }),
  setDependencyDrawState: (dependencyDrawState) => set({ dependencyDrawState }),

  setTodayMarkerDate: (date) => set({ todayMarkerDate: date }),

  recalculateSchedule: () => {
    const { tasks, dependencies } = get();
    const scheduleResult = calculateSchedule(tasks, dependencies);
    const criticalPathResult = findCriticalPath(scheduleResult, dependencies);
    set({ scheduleResult, criticalPathResult });
  },
}));
