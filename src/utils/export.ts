import { format } from 'date-fns';
import type { Task, Dependency } from '@/types';

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportTasksToCSV(tasks: Task[], dependencies: Dependency[]): void {
  const headers = [
    'ID',
    'Name',
    'Description',
    'Start Date',
    'End Date',
    'Duration (days)',
    'Progress (%)',
    'Status',
    'Priority',
    'Assignee',
    'Parent ID',
    'Is Milestone',
  ];

  const rows = tasks.map((task) => [
    task.id,
    task.name,
    task.description,
    format(new Date(task.startDate), 'yyyy-MM-dd'),
    format(new Date(task.endDate), 'yyyy-MM-dd'),
    String(
      Math.max(
        (new Date(task.endDate).getTime() - new Date(task.startDate).getTime()) /
          (1000 * 60 * 60 * 24),
        1,
      ),
    ),
    String(task.progress),
    task.status,
    task.priority,
    task.assigneeId ?? '',
    task.parentId ?? '',
    task.isMilestone ? 'Yes' : 'No',
  ]);

  const depHeaders = ['Predecessor ID', 'Successor ID', 'Type', 'Lag'];
  const depRows = dependencies.map((dep) => [
    dep.predecessorId,
    dep.successorId,
    dep.type,
    String(dep.lag),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => escapeCSV(cell)).join(',')),
    '',
    depHeaders.join(','),
    ...depRows.map((row) => row.map((cell) => escapeCSV(cell)).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `ganttflow-schedule-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
