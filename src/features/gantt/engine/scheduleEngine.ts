import { addDays, differenceInCalendarDays, max, min } from 'date-fns';
import type { Task, Dependency } from '@/types';

interface ScheduledTask {
  task: Task;
  es: Date;
  ef: Date;
  ls: Date;
  lf: Date;
  tf: number;
  ff: number;
}

export interface ScheduleResult {
  scheduled: Map<string, ScheduledTask>;
  projectStart: Date;
  projectEnd: Date;
}

function getDependencyLag(dep: Dependency): number {
  return dep.lag ?? 0;
}

export function calculateSchedule(
  tasks: Task[],
  dependencies: Dependency[],
): ScheduleResult {
  const taskMap = new Map<string, Task>();
  for (const task of tasks) {
    taskMap.set(task.id, task);
  }

  const successors = new Map<string, string[]>();
  const predecessors = new Map<string, string[]>();

  for (const dep of dependencies) {
    const succList = successors.get(dep.predecessorId) ?? [];
    succList.push(dep.successorId);
    successors.set(dep.predecessorId, succList);

    const predList = predecessors.get(dep.successorId) ?? [];
    predList.push(dep.predecessorId);
    predecessors.set(dep.successorId, predList);
  }

  const scheduled = new Map<string, ScheduledTask>();

  function getStartTaskIds(): string[] {
    return tasks
      .filter((t) => {
        const preds = predecessors.get(t.id);
        return !preds || preds.length === 0;
      })
      .map((t) => t.id);
  }

  function getEndTaskIds(): string[] {
    return tasks
      .filter((t) => {
        const succs = successors.get(t.id);
        return !succs || succs.length === 0;
      })
      .map((t) => t.id);
  }

  const inDegree = new Map<string, number>();
  for (const task of tasks) {
    const preds = predecessors.get(task.id);
    inDegree.set(task.id, preds?.length ?? 0);
  }

  const queue: string[] = [];
  for (const [id, degree] of inDegree) {
    if (degree === 0) queue.push(id);
  }

  const topoOrder: string[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    topoOrder.push(id);
    const succs = successors.get(id) ?? [];
    for (const succId of succs) {
      const newDegree = (inDegree.get(succId) ?? 1) - 1;
      inDegree.set(succId, newDegree);
      if (newDegree === 0) queue.push(succId);
    }
  }

  for (const id of topoOrder) {
    const task = taskMap.get(id)!;
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    const duration = Math.max(
      differenceInCalendarDays(taskEnd, taskStart),
      1,
    );

    const preds = predecessors.get(id) ?? [];
    let earliestStart: Date;
    if (preds.length === 0) {
      earliestStart = taskStart;
    } else {
      const candidateDates = preds.map((predId) => {
        const pred = scheduled.get(predId);
        if (!pred) return taskStart;
        const dep = dependencies.find(
          (d) => d.predecessorId === predId && d.successorId === id,
        );
        const lag = dep ? getDependencyLag(dep) : 0;

        switch (dep?.type ?? 'FS') {
          case 'FS':
            return addDays(pred.ef, lag);
          case 'SS':
            return addDays(pred.es, lag);
          case 'FF':
            return addDays(pred.ef, lag - duration);
          case 'SF':
            return addDays(pred.es, lag - duration);
          default:
            return addDays(pred.ef, lag);
        }
      });

      earliestStart = max(candidateDates) as Date;
    }

    const ef = addDays(earliestStart, duration - 1);

    scheduled.set(id, {
      task,
      es: earliestStart,
      ef,
      ls: earliestStart,
      lf: ef,
      tf: 0,
      ff: 0,
    });
  }

  const endTaskIds = getEndTaskIds();
  const projectEnd = endTaskIds.length > 0
    ? max(endTaskIds.map((id) => scheduled.get(id)!.ef)) as Date
    : new Date();

  const revQueue = [...endTaskIds];
  const visited = new Set<string>();

  for (const endId of endTaskIds) {
    const endTask = scheduled.get(endId)!;
    endTask.lf = projectEnd;
    endTask.ls = addDays(projectEnd, -(differenceInCalendarDays(endTask.ef, endTask.es) - 1));
  }

  while (revQueue.length > 0) {
    const id = revQueue.shift()!;
    const current = scheduled.get(id);
    if (!current || visited.has(id)) continue;
    visited.add(id);

    const preds = predecessors.get(id) ?? [];
    for (const predId of preds) {
      const pred = scheduled.get(predId);
      if (!pred) continue;

      const dep = dependencies.find(
        (d) => d.predecessorId === predId && d.successorId === id,
      );
      const lag = dep ? getDependencyLag(dep) : 0;

      let latestFinish: Date;
      switch (dep?.type ?? 'FS') {
        case 'FS':
          latestFinish = addDays(current.ls, -lag);
          break;
        case 'SS':
          latestFinish = addDays(
            addDays(current.ls, -(differenceInCalendarDays(current.ef, current.es) - 1)),
            -lag,
          );
          break;
        case 'FF':
          latestFinish = addDays(current.lf, -lag);
          break;
        case 'SF':
          latestFinish = addDays(current.ls, -lag);
          break;
        default:
          latestFinish = addDays(current.ls, -lag);
      }

      pred.lf = pred.lf < latestFinish ? pred.lf : latestFinish;
      pred.ls = addDays(pred.lf, -(differenceInCalendarDays(pred.ef, pred.es) - 1));

      revQueue.push(predId);
    }
  }

  for (const [, sched] of scheduled) {
    sched.tf = differenceInCalendarDays(sched.lf, sched.ef);
    sched.ff = 0;
  }

  const startTaskIdsList = getStartTaskIds();
  const projectStart = startTaskIdsList.length > 0
    ? min(startTaskIdsList.map((id) => scheduled.get(id)!.es)) as Date
    : new Date();

  return { scheduled, projectStart, projectEnd };
}
