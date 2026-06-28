import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  MoreHorizontal,
  Copy,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Button, Badge, EmptyState, DropdownMenu } from '@/components/ui';
import { useUIStore, useProjectStore, getManagerName } from '@/stores';

const statusColor: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  'on-track': 'success',
  'at-risk': 'warning',
  'behind': 'error',
  'completed': 'info',
};

export default function ProjectListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const openModal = useUIStore((s) => s.openModal);
  const projects = useProjectStore((s) => s.projects);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (projects.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<Plus className="size-8" />}
          title="No projects yet"
          description="Create your first project to start scheduling tasks and managing resources."
          action={<Button onClick={() => openModal('create-project')}>Create Project</Button>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          />
        </div>
        <Button icon={<Plus className="size-4" />} onClick={() => openModal('create-project')}>New Project</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((project) => (
          <div
            key={project.id}
            className="group relative rounded-xl border border-slate-200 bg-slate-100 p-5 transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <button
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="text-base font-semibold text-slate-900 dark:text-slate-50 hover:text-primary-600 dark:hover:text-primary-400 truncate block text-left"
                >
                  {project.name}
                </button>
                <Badge variant={statusColor[project.status]} className="mt-2">
                  {project.status.replace('-', ' ')}
                </Badge>
              </div>
              <DropdownMenu
                align="end"
                trigger={
                  <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 opacity-60 hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="size-4" />
                  </button>
                }
                items={[
                  { id: 'open', label: 'Open', icon: <ExternalLink className="size-4" />, onClick: () => navigate(`/projects/${project.id}`) },
                  { id: 'duplicate', label: 'Duplicate', icon: <Copy className="size-4" />, onClick: () => openModal('create-project', { duplicateFrom: project.id }) },
                  { id: 'delete', label: 'Delete', icon: <Trash2 className="size-4" />, danger: true, onClick: () => openModal('delete-confirm', { type: 'project', id: project.id, name: project.name }) },
                ]}
              />
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-500 transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                  {project.progress}%
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Due {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-3">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {getManagerName(project.managerId)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}