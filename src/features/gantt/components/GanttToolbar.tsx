import { memo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Link2,
  Layers,
  Download,
  Share2,
  FlagTriangleLeft,
} from 'lucide-react';
import { Button, Tooltip } from '@/components/ui';
import { useGanttZoom } from '../hooks/useGanttZoom';
import { useGanttStore } from '../store';
import { useUIStore } from '@/stores';
import { exportTasksToCSV } from '@/utils/export';

const ZOOM_LABELS = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
  quarter: 'Quarter',
} as const;

export const GanttToolbar = memo(function GanttToolbar() {
  const { zoomIn, zoomOut, zoomLevel, setZoomLevel, canZoomIn, canZoomOut } =
    useGanttZoom();
  const showCriticalPath = useGanttStore((s) => s.showCriticalPath);
  const toggleCriticalPath = useGanttStore((s) => s.toggleCriticalPath);
  const tasks = useGanttStore((s) => s.tasks);
  const dependencies = useGanttStore((s) => s.dependencies);
  const addToast = useUIStore((s) => s.addToast);

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-2 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-1">
        <Tooltip content="Zoom in">
          <Button
            size="sm"
            variant="ghost"
            disabled={!canZoomIn}
            onClick={zoomIn}
            aria-label="Zoom in"
          >
            <ZoomIn className="size-4" />
          </Button>
        </Tooltip>

        <div className="flex items-center rounded-md border border-slate-200 dark:border-slate-600">
          {(['day', 'week', 'month', 'quarter'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setZoomLevel(level)}
              className={`px-2.5 py-1 text-xs font-medium transition-colors first:rounded-l-md last:rounded-r-md ${
                zoomLevel === level
                  ? 'bg-primary-200 text-primary-800 dark:bg-primary-900/70 dark:text-primary-200'
                  : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {ZOOM_LABELS[level]}
            </button>
          ))}
        </div>

        <Tooltip content="Zoom out">
          <Button
            size="sm"
            variant="ghost"
            disabled={!canZoomOut}
            onClick={zoomOut}
            aria-label="Zoom out"
          >
            <ZoomOut className="size-4" />
          </Button>
        </Tooltip>
      </div>

      <div className="flex items-center gap-1">
        <Tooltip content="Toggle critical path">
          <Button
            size="sm"
            variant={showCriticalPath ? 'primary' : 'ghost'}
            onClick={toggleCriticalPath}
            aria-label="Toggle critical path"
            aria-pressed={showCriticalPath}
          >
            <FlagTriangleLeft className="size-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Link tasks">
          <Button
            size="sm"
            variant="ghost"
            aria-label="Create dependency"
            onClick={() => addToast({ message: 'Click the circle handle on a task bar to draw a dependency', variant: 'info' })}
          >
            <Link2 className="size-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Level resources">
          <Button
            size="sm"
            variant="ghost"
            aria-label="Level resources"
            onClick={() => addToast({ message: 'Resource leveling will be available in the next update', variant: 'info' })}
          >
            <Layers className="size-4" />
          </Button>
        </Tooltip>

        <div className="mx-2 h-5 w-px bg-slate-200 dark:bg-slate-700" />

        <Tooltip content="Share">
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              addToast({
                message: 'Share link copied to clipboard',
                variant: 'success',
              })
            }
            aria-label="Share"
          >
            <Share2 className="size-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Export CSV">
          <Button
            size="sm"
            variant="ghost"
            aria-label="Export as CSV"
            onClick={() => {
              exportTasksToCSV(tasks, dependencies);
              addToast({
                message: 'Schedule exported as CSV',
                variant: 'success',
              });
            }}
          >
            <Download className="size-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
});
