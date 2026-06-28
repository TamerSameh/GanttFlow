import { type HTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/utils/cn';

const sizes = {
  sm: 'size-7 text-xs',
  md: 'size-9 text-sm',
  lg: 'size-12 text-base',
} as const;

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name: string;
  size?: keyof typeof sizes;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function getColor(name: string): string {
  const colors = [
    'bg-primary-500',
    'bg-success-500',
    'bg-warning-500',
    'bg-error-500',
    'bg-info-500',
    'bg-milestone-500',
    'bg-critical-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length] ?? colors[0]!;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, name, size = 'md', ...props }, ref) => {
    const [imgError, setImgError] = useState(false);

    if (src && !imgError) {
      return (
        <div
          ref={ref}
          className={cn(
            'inline-flex shrink-0 overflow-hidden rounded-full',
            sizes[size],
            className,
          )}
          {...props}
        >
          <img
            src={src}
            alt={name}
            className="size-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium text-white',
          getColor(name),
          sizes[size],
          className,
        )}
        title={name}
        {...props}
      >
        {getInitials(name)}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';
