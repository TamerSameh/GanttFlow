import { memo, useMemo, useCallback, useRef } from 'react';
import { startOfDay, differenceInCalendarDays, addDays, format } from 'date-fns';
import type { LayoutResult } from '../engine/layoutEngine';
import { useGanttStore } from '../store';

interface TodayMarkerProps {
  layout: LayoutResult;
  height: number;
}

export const TodayMarker = memo(function TodayMarker({
  layout,
  height,
}: TodayMarkerProps) {
  const todayMarkerDate = useGanttStore((s) => s.todayMarkerDate);
  const setTodayMarkerDate = useGanttStore((s) => s.setTodayMarkerDate);
  const draggingRef = useRef(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const todayX = useMemo(() => {
    const date = startOfDay(todayMarkerDate);
    const daysFromStart = differenceInCalendarDays(date, layout.timelineStart);
    return daysFromStart * layout.pxPerDay;
  }, [todayMarkerDate, layout]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    draggingRef.current = true;
    svgRef.current = (e.currentTarget as SVGGElement).closest('svg');

    const handleMove = (ev: MouseEvent) => {
      if (!draggingRef.current || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const days = Math.round(x / layout.pxPerDay);
      const newDate = addDays(layout.timelineStart, days);
      setTodayMarkerDate(format(newDate, 'yyyy-MM-dd'));
    };

    const handleUp = () => {
      draggingRef.current = false;
      svgRef.current = null;
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }, [layout, setTodayMarkerDate]);

  if (todayX < 0 || todayX > layout.totalWidth) return null;

  return (
    <g onMouseDown={handleMouseDown} style={{ cursor: 'ew-resize' }}>
      <rect
        x={todayX - 12}
        y={0}
        width={24}
        height={height}
        fill="transparent"
      />
      <line
        x1={todayX}
        y1={0}
        x2={todayX}
        y2={height}
        stroke="#ef4444"
        strokeWidth={3}
      >
        <animate
          attributeName="opacity"
          values="1;0.4;1"
          dur="2s"
          repeatCount="indefinite"
          begin="0s"
        />
      </line>
      <rect
        x={todayX - 24}
        y={0}
        width={48}
        height={20}
        rx={4}
        fill="#ef4444"
      >
        <animate
          attributeName="opacity"
          values="1;0.4;1"
          dur="2s"
          repeatCount="indefinite"
          begin="0s"
        />
      </rect>
      <text
        x={todayX}
        y={10}
        textAnchor="middle"
        fill="#ffffff"
        className="text-[10px] font-semibold"
        dominantBaseline="central"
      >
        Today
      </text>
    </g>
  );
});
