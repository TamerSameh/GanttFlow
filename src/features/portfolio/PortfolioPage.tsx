import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui';
import { parse, differenceInCalendarDays } from 'date-fns';

interface ProjectSummary {
  id: string;
  name: string;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  progress: number;
  startDate: string;
  endDate: string;
  budget: string;
}

const portfolio: ProjectSummary[] = [
  { id: '1', name: 'Website Redesign', status: 'on-track', progress: 65, startDate: 'Apr 1', endDate: 'Jul 15', budget: '$45,000' },
  { id: '2', name: 'Mobile App v2', status: 'at-risk', progress: 40, startDate: 'May 1', endDate: 'Aug 30', budget: '$120,000' },
  { id: '3', name: 'Q3 Marketing Campaign', status: 'on-track', progress: 25, startDate: 'Jun 15', endDate: 'Sep 1', budget: '$30,000' },
  { id: '4', name: 'API Migration', status: 'behind', progress: 30, startDate: 'Apr 15', endDate: 'Jun 30', budget: '$60,000' },
  { id: '5', name: 'Brand Guidelines', status: 'completed', progress: 100, startDate: 'May 1', endDate: 'Jun 1', budget: '$15,000' },
];

const statusColor: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  'on-track': 'success',
  'at-risk': 'warning',
  'behind': 'error',
  'completed': 'info',
};

function StatCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <div className={`flex size-10 items-center justify-center rounded-lg ${color}`}>
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-xl font-bold tabular-nums text-slate-900 dark:text-slate-50">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const onTrack = portfolio.filter((p) => p.status === 'on-track').length;
  const atRisk = portfolio.filter((p) => p.status === 'at-risk' || p.status === 'behind').length;
  const completed = portfolio.filter((p) => p.status === 'completed').length;
  const totalBudget = portfolio.reduce((s, p) => {
    return s + Number.parseInt(p.budget.replace(/[$,]/g, ''));
  }, 0);

  const projectDates = portfolio.map((p) => ({
    ...p,
    start: parse(p.startDate, 'MMM d', new Date()),
    end: parse(p.endDate, 'MMM d', new Date()),
  }));
  const overallStart = new Date(Math.min(...projectDates.map((p) => p.start.getTime())));
  const overallEnd = new Date(Math.max(...projectDates.map((p) => p.end.getTime())));
  const totalDays = differenceInCalendarDays(overallEnd, overallStart) || 1;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Portfolio Overview
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          High-level view of all projects and programs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CheckCircle2} label="On Track" value={onTrack} color="bg-success-200 text-success-800 dark:bg-success-900/70 dark:text-success-200" />
        <StatCard icon={AlertTriangle} label="At Risk" value={atRisk} color="bg-warning-200 text-warning-800 dark:bg-warning-900/70 dark:text-warning-200" />
        <StatCard icon={TrendingUp} label="Completed" value={completed} color="bg-info-200 text-info-800 dark:bg-info-900/70 dark:text-info-200" />
        <StatCard icon={BarChart3} label="Total Budget" value={`$${totalBudget.toLocaleString()}`} color="bg-primary-200 text-primary-800 dark:bg-primary-900/70 dark:text-primary-200" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Program Roadmap
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {portfolio.map((project) => {
              const matched = projectDates.find((p) => p.id === project.id);
              const start = matched?.start ?? new Date();
              const end = matched?.end ?? new Date();
              const elapsed = differenceInCalendarDays(start, overallStart);
              const duration = differenceInCalendarDays(end, start);

              return (
                <div key={project.id} className="relative">
                  <div className="flex items-center gap-4 mb-1.5">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-50 w-40 truncate">
                      {project.name}
                    </span>
                    <Badge variant={statusColor[project.status]} size="sm">
                      {project.status.replace('-', ' ')}
                    </Badge>
                    <span className="text-xs text-slate-400 ml-auto">{project.budget}</span>
                  </div>
                  <div className="relative h-8 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`absolute top-0 h-full rounded-lg transition-all ${
                        project.status === 'on-track'
                          ? 'bg-primary-400'
                          : project.status === 'at-risk'
                            ? 'bg-warning-400'
                            : project.status === 'behind'
                              ? 'bg-error-400'
                              : 'bg-success-400'
                      }`}
                      style={{
                        left: `${(elapsed / totalDays) * 100}%`,
                        width: `${(duration / totalDays) * 100}%`,
                      }}
                    >
                      <div
                        className="h-full bg-black/10 rounded-lg"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                    <span>{project.startDate}</span>
                    <span>{project.endDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
