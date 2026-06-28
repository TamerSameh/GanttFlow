import type { Dependency, CriticalPathResult } from '@/types';
import type { ScheduleResult } from './scheduleEngine';

const NEAR_CRITICAL_THRESHOLD = 2;

export function findCriticalPath(schedule: ScheduleResult, dependencies: Dependency[]): CriticalPathResult {
  const taskIds = new Set<string>();
  const dependencyIds = new Set<string>();
  const totalFloat = new Map<string, number>();

  for (const [id, sched] of schedule.scheduled) {
    totalFloat.set(id, sched.tf);
    if (sched.tf <= 0) {
      taskIds.add(id);
    }
  }

  for (const dep of dependencies) {
    if (taskIds.has(dep.predecessorId) && taskIds.has(dep.successorId)) {
      dependencyIds.add(dep.id);
    }
  }

  return {
    taskIds,
    dependencyIds,
    totalFloat,
  };
}

export function findNearCriticalPath(
  schedule: ScheduleResult,
  threshold: number = NEAR_CRITICAL_THRESHOLD,
): Set<string> {
  const nearCritical = new Set<string>();
  for (const [id, sched] of schedule.scheduled) {
    if (sched.tf > 0 && sched.tf <= threshold) {
      nearCritical.add(id);
    }
  }
  return nearCritical;
}