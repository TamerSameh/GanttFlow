import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { GanttChart } from './components/GanttChart';
import { TaskGrid } from './components/TaskGrid';
import { GanttToolbar } from './components/GanttToolbar';
import { PanelGroup } from '@/components/layout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useGanttStore } from './store';
import { useProjectStore } from '@/stores';
import { ChevronLeft } from 'lucide-react';

const SAMPLE_TASKS = [
  { id: '1', projectId: 'demo', parentId: null, name: 'Project Kickoff', description: 'Initial project setup and team alignment.', startDate: '2026-06-01', endDate: '2026-06-03', duration: 3, progress: 100, assigneeId: 'alex', constraint: null, constraintDate: null, priority: 'high' as const, status: 'completed' as const, isMilestone: false, isSummary: false, sortOrder: 1, createdAt: '', updatedAt: '' },
  { id: '2', projectId: 'demo', parentId: null, name: 'Requirements Gathering', description: 'Collect and document all requirements.', startDate: '2026-06-04', endDate: '2026-06-10', duration: 7, progress: 100, assigneeId: 'sarah', constraint: null, constraintDate: null, priority: 'high' as const, status: 'completed' as const, isMilestone: false, isSummary: false, sortOrder: 2, createdAt: '', updatedAt: '' },
  { id: '3', projectId: 'demo', parentId: null, name: 'Design Phase', description: 'UI/UX design and prototyping.', startDate: '2026-06-11', endDate: '2026-06-24', duration: 14, progress: 65, assigneeId: 'marcus', constraint: null, constraintDate: null, priority: 'high' as const, status: 'in-progress' as const, isMilestone: false, isSummary: false, sortOrder: 3, createdAt: '', updatedAt: '' },
  { id: '4', projectId: 'demo', parentId: null, name: 'Development', description: 'Core development sprint.', startDate: '2026-06-25', endDate: '2026-07-22', duration: 28, progress: 20, assigneeId: 'sarah', constraint: null, constraintDate: null, priority: 'high' as const, status: 'in-progress' as const, isMilestone: false, isSummary: false, sortOrder: 4, createdAt: '', updatedAt: '' },
  { id: '5', projectId: 'demo', parentId: null, name: 'Testing', description: 'QA and bug fixing.', startDate: '2026-07-23', endDate: '2026-08-05', duration: 14, progress: 0, assigneeId: 'david', constraint: null, constraintDate: null, priority: 'medium' as const, status: 'not-started' as const, isMilestone: false, isSummary: false, sortOrder: 5, createdAt: '', updatedAt: '' },
  { id: '6', projectId: 'demo', parentId: null, name: 'Deployment', description: 'Production deployment.', startDate: '2026-08-06', endDate: '2026-08-06', duration: 1, progress: 0, assigneeId: null, constraint: null, constraintDate: null, priority: 'medium' as const, status: 'not-started' as const, isMilestone: true, isSummary: false, sortOrder: 6, createdAt: '', updatedAt: '' },
];

const SAMPLE_DEPENDENCIES = [
  { id: 'd1', projectId: 'demo', predecessorId: '1', successorId: '2', type: 'FS' as const, lag: 0 },
  { id: 'd2', projectId: 'demo', predecessorId: '2', successorId: '3', type: 'FS' as const, lag: 0 },
  { id: 'd3', projectId: 'demo', predecessorId: '3', successorId: '4', type: 'FS' as const, lag: 0 },
  { id: 'd4', projectId: 'demo', predecessorId: '4', successorId: '5', type: 'FS' as const, lag: 0 },
  { id: 'd5', projectId: 'demo', predecessorId: '5', successorId: '6', type: 'FS' as const, lag: 0 },
];

export default function GanttPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const setTasks = useGanttStore((s) => s.setTasks);
  const setDependencies = useGanttStore((s) => s.setDependencies);
  const projects = useProjectStore((s) => s.projects);
  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    setTasks(SAMPLE_TASKS);
    setDependencies(SAMPLE_DEPENDENCIES);
    useProjectStore.getState().setActiveProject(projectId ?? null);
  }, [projectId, setTasks, setDependencies]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-700">
        <button
          onClick={() => navigate('/projects')}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Back to projects"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {project?.name ?? 'Website Redesign'}
        </span>
      </div>
      <GanttToolbar />
      <div className="flex-1 overflow-hidden">
        <PanelGroup
          left={<TaskGrid />}
          right={
            <ErrorBoundary>
              <GanttChart
                projectStart="2026-06-01"
                projectEnd="2026-08-06"
              />
            </ErrorBoundary>
          }
          defaultLeftWidth={320}
        />
      </div>
    </div>
  );
}
