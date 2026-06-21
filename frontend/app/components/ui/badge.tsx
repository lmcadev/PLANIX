import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium font-mono-data tracking-tight',
  {
    variants: {
      variant: {
        neutral: 'border-line-strong bg-paper text-ink-800',
        signal: 'border-signal-100 bg-signal-50 text-signal-700',
        amber: 'border-amber-50 bg-amber-50 text-amber-600',
        grass: 'border-grass-50 bg-grass-50 text-grass-600',
        flag: 'border-flag-50 bg-flag-50 text-flag-600',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: Readonly<BadgeProps>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
