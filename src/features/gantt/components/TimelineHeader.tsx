import { memo, useMemo } from 'react';
import {
  format,
  addDays,
  startOfWeek,
  startOfMonth,
  startOfQuarter,
  endOfQuarter,
  differenceInCalendarDays,
} from 'date-fns';
import type { LayoutResult } from '../engine/layoutEngine';
import { cn } from '@/utils/cn';

interface TimelineHeaderProps {
  layout: LayoutResult;
}

export const TimelineHeader = memo(function TimelineHeader({
  layout,
}: TimelineHeaderProps) {
  const headerHeight = 52;
  const { timelineStart, timelineEnd, pxPerDay, zoomLevel } = layout;

  const headers = useMemo(() => {
    const days = differenceInCalendarDays(timelineEnd, timelineStart);
    const result: { x: number; width: number; label: string; isMajor: boolean }[] = [];

    if (zoomLevel === 'day') {
      for (let i = 0; i < days; i++) {
        const date = addDays(timelineStart, i);
        result.push({
          x: i * pxPerDay,
          width: pxPerDay,
          label: format(date, 'd'),
          isMajor: date.getDate() === 1,
        });
      }
    } else if (zoomLevel === 'week') {
      for (let i = 0; i < days; i += 7) {
        const date = addDays(timelineStart, i);
        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        result.push({
          x: i * pxPerDay,
          width: pxPerDay * 7,
          label: format(weekStart, 'MMM d'),
          isMajor: weekStart.getDate() <= 7,
        });
      }
    } else if (zoomLevel === 'month') {
      let cursor = startOfMonth(timelineStart);
      while (cursor < timelineEnd) {
        const actualNextMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
        const monthDays = differenceInCalendarDays(actualNextMonth, cursor);
        const offsetDays = differenceInCalendarDays(cursor, timelineStart);
        result.push({
          x: Math.max(0, offsetDays * pxPerDay),
          width: monthDays * pxPerDay,
          label: format(cursor, 'MMM yyyy'),
          isMajor: true,
        });
        cursor = actualNextMonth;
      }
    } else {
      let cursor = startOfQuarter(timelineStart);
      while (cursor < timelineEnd) {
        const quarterEnd = endOfQuarter(cursor);
        const quarterDays = differenceInCalendarDays(quarterEnd, cursor) + 1;
        const offsetDays = differenceInCalendarDays(cursor, timelineStart);
        result.push({
          x: Math.max(0, offsetDays * pxPerDay),
          width: quarterDays * pxPerDay,
          label: format(cursor, 'MMM'),
          isMajor: true,
        });
        cursor = addDays(quarterEnd, 1);
      }
    }

    return result;
  }, [timelineStart, timelineEnd, pxPerDay, zoomLevel]);

  return (
    <g className="timeline-header">
      {headers.map((h) => (
        <g key={`${h.label}-${h.x}`}>
          <line
            x1={h.x}
            y1={headerHeight}
            x2={h.x}
            y2={headerHeight + 8}
            className="stroke-slate-300 dark:stroke-slate-600"
            strokeWidth={1}
          />
          <text
            x={h.x + h.width / 2}
            y={h.isMajor ? 22 : 36}
            textAnchor="middle"
            className={cn(
              'font-medium',
              h.isMajor
                ? 'fill-slate-700 dark:fill-slate-300 text-xs'
                : 'fill-slate-400 dark:fill-slate-500 text-[11px]',
            )}
            dominantBaseline="central"
          >
            {h.label}
          </text>
        </g>
      ))}
    </g>
  );
});


