import { useCallback, useMemo } from 'react';
import type { ZoomLevel } from '@/types';
import { useGanttStore } from '../store';
import { getPxPerDay } from '../engine/layoutEngine';

const ZOOM_LEVELS: ZoomLevel[] = ['day', 'week', 'month', 'quarter'];

export function useGanttZoom() {
  const zoomLevel = useGanttStore((s) => s.zoomLevel);
  const setZoomLevel = useGanttStore((s) => s.setZoomLevel);

  const pxPerDay = useMemo(() => getPxPerDay(zoomLevel), [zoomLevel]);

  const zoomIn = useCallback(() => {
    const idx = ZOOM_LEVELS.indexOf(zoomLevel);
    if (idx > 0) setZoomLevel(ZOOM_LEVELS[idx - 1]!);
  }, [zoomLevel, setZoomLevel]);

  const zoomOut = useCallback(() => {
    const idx = ZOOM_LEVELS.indexOf(zoomLevel);
    if (idx < ZOOM_LEVELS.length - 1) setZoomLevel(ZOOM_LEVELS[idx + 1]!);
  }, [zoomLevel, setZoomLevel]);

  const canZoomIn = ZOOM_LEVELS.indexOf(zoomLevel) > 0;
  const canZoomOut = ZOOM_LEVELS.indexOf(zoomLevel) < ZOOM_LEVELS.length - 1;

  return { zoomLevel, setZoomLevel, zoomIn, zoomOut, canZoomIn, canZoomOut, pxPerDay };
}