import { useRef, useState, type ReactNode, useCallback, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface PanelGroupProps {
  left: ReactNode;
  right: ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  className?: string;
}

export function PanelGroup({
  left,
  right,
  defaultLeftWidth = 320,
  minLeftWidth = 200,
  maxLeftWidth = 600,
  className,
}: PanelGroupProps) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setContainerWidth(entries[0]?.contentRect.width ?? 0);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const effectiveMin = isMobile && containerWidth > 0
    ? Math.round(containerWidth * 0.35)
    : minLeftWidth;
  const effectiveMax = isMobile && containerWidth > 0
    ? Math.round(containerWidth * 0.45)
    : maxLeftWidth;

  useEffect(() => {
    if (isMobile && containerWidth > 0) {
      setLeftWidth((prev) => {
        const maxPx = containerWidth * 0.45;
        if (prev > maxPx) {
          return Math.round(containerWidth * 0.40);
        }
        return prev;
      });
    }
  }, [isMobile, containerWidth]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      setLeftWidth(Math.max(effectiveMin, Math.min(effectiveMax, newWidth)));
    },
    [isDragging, effectiveMin, effectiveMax],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={cn('flex h-full overflow-hidden', className)}
    >
      <div style={{ width: leftWidth }} className="shrink-0 overflow-hidden">
        {left}
      </div>

      <div
        className={cn(
          'w-1.5 shrink-0 cursor-col-resize border-x border-slate-200 transition-colors dark:border-slate-700',
          isDragging
            ? 'bg-primary-300 dark:bg-primary-600'
            : 'bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700',
        )}
        onMouseDown={handleMouseDown}
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={leftWidth}
        aria-valuemin={effectiveMin}
        aria-valuemax={effectiveMax}
        tabIndex={0}
        onKeyDown={(e) => {
          const step = isMobile ? 10 : 20;
          if (e.key === 'ArrowLeft') {
            setLeftWidth((w) => Math.max(effectiveMin, w - step));
          } else if (e.key === 'ArrowRight') {
            setLeftWidth((w) => Math.min(effectiveMax, w + step));
          }
        }}
      />

      <div className="flex-1 overflow-hidden">{right}</div>
    </div>
  );
}
