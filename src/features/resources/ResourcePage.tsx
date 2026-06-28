import { useState } from 'react';
import { Plus, Search, Mail, Clock, BarChart3 } from 'lucide-react';
import { Button, Badge, Avatar, EmptyState } from '@/components/ui';
import { useUIStore } from '@/stores';

interface Resource {
  id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  utilization: number;
  capacity: number;
}

const resources: Resource[] = [
  { id: '1', name: 'Alex Morgan', email: 'alex@ganttflow.dev', role: 'Project Manager', skills: ['Agile', 'Scrum', 'Jira'], utilization: 80, capacity: 40 },
  { id: '2', name: 'Sarah Chen', email: 'sarah@ganttflow.dev', role: 'Senior Developer', skills: ['React', 'Node.js', 'TypeScript'], utilization: 95, capacity: 40 },
  { id: '3', name: 'Marcus Jones', email: 'marcus@ganttflow.dev', role: 'Designer', skills: ['Figma', 'UI/UX', 'Branding'], utilization: 60, capacity: 40 },
  { id: '4', name: 'Priya Patel', email: 'priya@ganttflow.dev', role: 'Backend Developer', skills: ['Python', 'PostgreSQL', 'AWS'], utilization: 100, capacity: 40 },
  { id: '5', name: 'David Kim', email: 'david@ganttflow.dev', role: 'QA Engineer', skills: ['Cypress', 'Playwright', 'Manual Testing'], utilization: 45, capacity: 40 },
];

function getUtilizationVariant(utilization: number) {
  if (utilization >= 100) return 'error';
  if (utilization >= 80) return 'warning';
  return 'success';
}

export default function ResourcePage() {
  const [search, setSearch] = useState('');
  const openModal = useUIStore((s) => s.openModal);

  const filtered = resources.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.role.toLowerCase().includes(search.toLowerCase()),
  );

  if (resources.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          title="No team members yet"
          description="Invite your team to start assigning resources to tasks."
          action={<Button onClick={() => openModal('invite-team')}>Invite Team</Button>}
        />
      </div>
    );
  }

  const overallocated = resources.filter((r) => r.utilization >= 100).length;
  const avgUtilization = Math.round(
    resources.reduce((s, r) => s + r.utilization, 0) / resources.length,
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          />
        </div>
        <Button icon={<Plus className="size-4" />} onClick={() => openModal('invite-team')}>Add Resource</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary-200 text-primary-800 dark:bg-primary-900/70 dark:text-primary-200">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg Utilization</p>
              <p className="text-xl font-bold tabular-nums text-slate-900 dark:text-slate-50">{avgUtilization}%</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-error-200 text-error-800 dark:bg-error-900/70 dark:text-error-200">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Overallocated</p>
              <p className="text-xl font-bold tabular-nums text-slate-900 dark:text-slate-50">{overallocated}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-success-200 text-success-800 dark:bg-success-900/70 dark:text-success-200">
              <Mail className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Team Size</p>
              <p className="text-xl font-bold tabular-nums text-slate-900 dark:text-slate-50">{resources.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((resource) => {
          const variant = getUtilizationVariant(resource.utilization);
          return (
            <div
              key={resource.id}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-100 p-4 transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <Avatar name={resource.name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900 dark:text-slate-50">
                    {resource.name}
                  </span>
                  <Badge variant="default" size="sm">{resource.role}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {resource.skills.join(' · ')}
                </p>
              </div>
              <div className="w-48">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Utilization
                  </span>
                  <span className="text-xs font-medium tabular-nums text-slate-700 dark:text-slate-300">
                    {resource.utilization}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      variant === 'error'
                        ? 'bg-error-500'
                        : variant === 'warning'
                          ? 'bg-warning-500'
                          : 'bg-success-500'
                    }`}
                    style={{ width: `${Math.min(resource.utilization, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}