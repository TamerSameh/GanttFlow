import { memo } from 'react';
import { cn } from '@/utils/cn';
import type { TaskPosition } from '@/types';

interface MilestoneProps {
  position: TaskPosition;
  isSelected: boolean;
  isCritical: boolean;
  name: string;
  onMouseDown: (e: React.MouseEvent) => void;
}

export const Milestone = memo(function Milestone({
  position,
  isSelected,
  isCritical,
  name,
  onMouseDown,
}: MilestoneProps) {
  const diamondSize = 14;
  const cx = position.x;
  const cy = position.y + position.height / 2;

  const points = [
    `${cx},${cy - diamondSize / 2}`,
    `${cx + diamondSize / 2},${cy}`,
    `${cx},${cy + diamondSize / 2}`,
    `${cx - diamondSize / 2},${cy}`,
  ].join(' ');

  return (
    <g
      className="cursor-pointer"
      onMouseDown={onMouseDown}
      role="img"
      aria-label={`Milestone: ${name}`}
    >
      <polygon
        points={points}
        className={cn(
          'fill-milestone-500 stroke-milestone-600',
          isSelected && 'stroke-primary-500 stroke-2',
          isCritical && 'fill-critical-500 stroke-critical-600',
        )}
        strokeWidth={isSelected ? 2 : 1}
      />
    </g>
  );
});
