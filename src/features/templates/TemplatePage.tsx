import { useState } from 'react';
import { Search, Layers, Users } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { useUIStore } from '@/stores';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  taskCount: number;
  usageCount: number;
}

const templates: Template[] = [
  { id: '1', name: 'Website Launch', description: 'Complete website project from kickoff to deployment.', category: 'Development', taskCount: 28, usageCount: 45 },
  { id: '2', name: 'Marketing Campaign', description: 'End-to-end marketing campaign planning and execution.', category: 'Marketing', taskCount: 18, usageCount: 32 },
  { id: '3', name: 'Sprint Template', description: 'Two-week agile sprint with standard ceremonies.', category: 'Agile', taskCount: 12, usageCount: 128 },
  { id: '4', name: 'Product Launch', description: 'Cross-functional product launch coordination.', category: 'Product', taskCount: 35, usageCount: 27 },
  { id: '5', name: 'Design Sprint', description: 'Five-day design sprint framework.', category: 'Design', taskCount: 10, usageCount: 19 },
  { id: '6', name: 'Event Planning', description: 'Full event lifecycle from concept to wrap-up.', category: 'Events', taskCount: 22, usageCount: 15 },
];

export default function TemplatePage() {
  const [search, setSearch] = useState('');
  const addToast = useUIStore((s) => s.addToast);
  const openModal = useUIStore((s) => s.openModal);

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Templates
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Start faster with pre-built project templates.
          </p>
        </div>
        <Button variant="secondary" onClick={() => addToast({ message: 'Template builder coming soon', variant: 'info' })}>Create Template</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((template) => (
          <div
            key={template.id}
            className="group rounded-xl border border-slate-200 bg-slate-100 p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800"
          >
            <Badge variant="info" size="sm">{template.category}</Badge>
            <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-50">
              {template.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {template.description}
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Layers className="size-3.5" />
                {template.taskCount} tasks
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-3.5" />
                Used {template.usageCount} times
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <Button variant="secondary" size="sm" className="w-full" onClick={() => { openModal('create-project'); addToast({ message: `Started project from "${template.name}" template`, variant: 'success' }); }}>
                  Use Template
                </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
