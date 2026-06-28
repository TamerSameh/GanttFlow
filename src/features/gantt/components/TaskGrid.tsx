import { memo, useMemo } from 'react';
import { useGanttStore } from '../store';
import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';
import { Plus } from 'lucide-react';

export const TaskGrid = memo(function TaskGrid() {
  const tasks = useGanttStore((s) => s.tasks);
  const selectedTaskIds = useGanttStore((s) => s.selectedTaskIds);
  const selectTask = useGanttStore((s) => s.selectTask);
  const addTask = useGanttStore((s) => s.addTask);

  function buildTree(parentId: string | null): typeof tasks {
    return tasks
      .filter((t) => t.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const rootTasks = useMemo(() => buildTree(null), [tasks]);

  const handleAddTask = () => {
    const task = {
      id: `task-${Date.now()}`,
      projectId: '',
      parentId: null,
      name: 'New Task',
      description: '',
      startDate: new Date().toISOString().split('T')[0]!,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]!,
      duration: 7,
      progress: 0,
      assigneeId: null,
      constraint: null,
      constraintDate: null,
      priority: 'medium' as const,
      status: 'not-started' as const,
      isMilestone: false,
      isSummary: false,
      sortOrder: tasks.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addTask(task);
  };

  const COLUMNS: { key: string; label: string; width: number }[] = [
    { key: 'name', label: 'Task Name', width: 200 },
    { key: 'assignee', label: 'Assignee', width: 100 },
    { key: 'start', label: 'Start', width: 90 },
    { key: 'end', label: 'End', width: 90 },
    { key: 'duration', label: 'Dur', width: 50 },
    { key: 'progress', label: '%', width: 50 },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-700">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Tasks
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleAddTask}
          className="h-7 px-2"
          aria-label="Add task"
        >
          <Plus className="size-3.5" />
        </Button>
      </div>

      <div className="flex items-center border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
        {COLUMNS.map((col) => (
          <div
            key={col.key}
            className="px-3 py-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
            style={{ width: col.width, minWidth: col.width }}
          >
            {col.label}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {rootTasks.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
            <p className="text-sm text-slate-400">
              No tasks yet
            </p>
            <Button size="sm" variant="secondary" onClick={handleAddTask}>
              <Plus className="size-3.5" />
              Add Task
            </Button>
          </div>
        ) : (
          rootTasks.map((task) => (
            <TaskGridRow
              key={task.id}
              task={task}
              isSelected={selectedTaskIds.has(task.id)}
              onSelect={() => selectTask(task.id, false)}
            />
          ))
        )}
      </div>
    </div>
  );
});

interface TaskGridRowProps {
  task: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    progress: number;
    assigneeId: string | null;
  };
  isSelected: boolean;
  onSelect: () => void;
}

const TaskGridRow = memo(function TaskGridRow({
  task,
  isSelected,
  onSelect,
}: TaskGridRowProps) {
  const days = Math.max(
    (new Date(task.endDate).getTime() - new Date(task.startDate).getTime()) /
      (1000 * 60 * 60 * 24),
    1,
  );

  const COLUMNS = [
    { key: 'name', width: 200 },
    { key: 'assignee', width: 100 },
    { key: 'start', width: 90 },
    { key: 'end', width: 90 },
    { key: 'duration', width: 50 },
    { key: 'progress', width: 50 },
  ];

  const values: Record<string, string> = {
    name: task.name,
    assignee: task.assigneeId ?? '—',
    start: task.startDate.slice(5),
    end: task.endDate.slice(5),
    duration: `${days}d`,
    progress: `${task.progress}%`,
  };

  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex w-full items-center border-b border-slate-100 text-left text-xs transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50',
        isSelected && 'bg-primary-50 dark:bg-primary-900/20',
      )}
    >
      {COLUMNS.map((col) => (
        <div
          key={col.key}
          className="truncate px-3 py-2.5 text-slate-700 dark:text-slate-300"
          style={{ width: col.width, minWidth: col.width }}
          title={values[col.key]}
        >
          {values[col.key]}
        </div>
      ))}
    </button>
  );
});