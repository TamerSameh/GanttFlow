import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, AlertTriangle, TrendingUp, TrendingDown, Clock, Users, Briefcase } from 'lucide-react';
import { Button, Badge, Skeleton } from '@/components/ui';
import { useUIStore } from '@/stores';

interface ProjectSummary {
  id: string;
  name: string;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  progress: number;
  endDate: string;
  taskCount: number;
}

const statusVariant = {
  'on-track': 'success' as const,
  'at-risk': 'warning' as const,
  'behind': 'error' as const,
  'completed': 'info' as const,
};

const projects: ProjectSummary[] = [
  { id: '1', name: 'Website Redesign', status: 'on-track', progress: 65, endDate: 'Jul 15, 2026', taskCount: 24 },
  { id: '2', name: 'Mobile App v2', status: 'at-risk', progress: 40, endDate: 'Aug 30, 2026', taskCount: 42 },
  { id: '3', name: 'Q3 Marketing Campaign', status: 'on-track', progress: 25, endDate: 'Sep 1, 2026', taskCount: 18 },
  { id: '4', name: 'API Migration', status: 'behind', progress: 30, endDate: 'Jun 30, 2026', taskCount: 15 },
  { id: '5', name: 'Brand Guidelines', status: 'completed', progress: 100, endDate: 'Jun 1, 2026', taskCount: 8 },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading] = useState(false);
  const openModal = useUIStore((s) => s.openModal);

  const atRiskCount = projects.filter((p) => p.status === 'at-risk' || p.status === 'behind').length;
  const totalProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length);
  const upcomingDeadlines = projects
    .filter((p) => p.status !== 'completed')
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Good morning, Alex
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Here's what's happening across your projects.
          </p>
        </div>
        <Button icon={<Plus className="size-4" />} onClick={() => openModal('create-project')}>New Project</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Briefcase}
          label="Active Projects"
          value={projects.length}
          color="text-primary-800 bg-primary-200 dark:bg-primary-900/70 dark:text-primary-200"
          trend={{ direction: 'up', value: '2', isPositive: true }}
        />
        <StatCard
          icon={AlertTriangle}
          label="At Risk"
          value={atRiskCount}
          color="text-warning-800 bg-warning-200 dark:bg-warning-900/70 dark:text-warning-200"
          trend={{ direction: 'down', value: '1', isPositive: true }}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Progress"
          value={`${totalProgress}%`}
          color="text-success-800 bg-success-200 dark:bg-success-900/70 dark:text-success-200"
          trend={{ direction: 'up', value: '5%', isPositive: true }}
        />
        <StatCard
          icon={Users}
          label="Team Members"
          value={8}
          color="text-info-800 bg-info-200 dark:bg-info-900/70 dark:text-info-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Active Projects
          </h3>
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="w-full rounded-xl border border-slate-200 bg-slate-100 p-4 text-left transition-all hover:shadow-md hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-slate-50 truncate">
                      {project.name}
                    </span>
                    <Badge variant={statusVariant[project.status]}>
                      {project.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      Due {project.endDate}
                    </span>
                    <span>{project.taskCount} tasks</span>
                  </div>
                </div>
                <div className="w-32">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary-500 transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums w-8 text-right">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            {upcomingDeadlines.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 size-5 shrink-0 text-warning-500" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                      {project.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Due {project.endDate}
                    </p>
                    <div className="mt-2 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-warning-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatTrend {
  direction: 'up' | 'down';
  value: string;
  isPositive: boolean;
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
  trend?: StatTrend;
}

function StatCard({ icon: Icon, label, value, color, trend }: StatCardProps) {
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend ? (trend.isPositive ? 'text-success-500' : 'text-error-500') : '';
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <div className={`flex size-10 items-center justify-center rounded-lg ${color}`}>
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="text-xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
            {value}
          </p>
          {trend && (
            <p className={`mt-0.5 flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
              <TrendIcon className="size-3" />
              {trend.value} from last week
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
