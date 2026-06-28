import { memo } from 'react';
import { cn } from '@/utils/cn';
import type { DependencyPath } from '@/types';

interface DependencyLineProps {
  path: DependencyPath;
  isCritical: boolean;
  markerPrefix: string;
}

export const DependencyLine = memo(function DependencyLine({
  path,
  isCritical,
  markerPrefix,
}: DependencyLineProps) {
  return (
    <g>
      <path
        d={path.path}
        className={cn(
          'fill-none stroke-info-500 stroke-[1.5]',
          isCritical && 'stroke-critical-500 stroke-[2]',
        )}
        markerEnd={isCritical ? `url(#${markerPrefix}-arrow-critical)` : `url(#${markerPrefix}-arrow-info)`}
      />
    </g>
  );
});
