import type { Dependency } from '@/types';

export interface CycleResult {
  hasCycle: boolean;
  cyclePath: string[];
}

export function detectCycle(dependencies: Dependency[]): CycleResult {
  const graph = new Map<string, string[]>();
  const allNodes = new Set<string>();

  for (const dep of dependencies) {
    const succs = graph.get(dep.predecessorId) ?? [];
    succs.push(dep.successorId);
    graph.set(dep.predecessorId, succs);
    allNodes.add(dep.predecessorId);
    allNodes.add(dep.successorId);
  }

  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  const color = new Map<string, number>();
  const parent = new Map<string, string | null>();

  for (const node of allNodes) {
    color.set(node, WHITE);
    parent.set(node, null);
  }

  function dfs(node: string): string | null {
    color.set(node, GRAY);

    const neighbors = graph.get(node) ?? [];
    for (const neighbor of neighbors) {
      if (color.get(neighbor) === GRAY) {
        parent.set(neighbor, node);
        return neighbor;
      }
      if (color.get(neighbor) === WHITE) {
        parent.set(neighbor, node);
        const result = dfs(neighbor);
        if (result) return result;
      }
    }

    color.set(node, BLACK);
    return null;
  }

  for (const node of allNodes) {
    if (color.get(node) === WHITE) {
      const cycleStart = dfs(node);
      if (cycleStart) {
        const cyclePath = [cycleStart];
        let current = parent.get(cycleStart);
        while (current && current !== cycleStart) {
          cyclePath.push(current);
          current = parent.get(current);
        }
        cyclePath.push(cycleStart);
        return { hasCycle: true, cyclePath: cyclePath.reverse() };
      }
    }
  }

  return { hasCycle: false, cyclePath: [] };
}

export function validateDependency(
  predecessorId: string,
  successorId: string,
  dependencies: Dependency[],
): { valid: boolean; error?: string } {
  if (predecessorId === successorId) {
    return { valid: false, error: 'A task cannot depend on itself' };
  }

  const exists = dependencies.some(
    (d) =>
      d.predecessorId === predecessorId && d.successorId === successorId,
  );
  if (exists) {
    return { valid: false, error: 'This dependency already exists' };
  }

  const testDeps: Dependency[] = [
    ...dependencies,
    {
      id: '__test__',
      projectId: '',
      predecessorId,
      successorId,
      type: 'FS',
      lag: 0,
    },
  ];

  const result = detectCycle(testDeps);
  if (result.hasCycle) {
    return { valid: false, error: 'This would create a circular dependency' };
  }

  return { valid: true };
}
