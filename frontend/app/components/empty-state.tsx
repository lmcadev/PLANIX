import type { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-12 text-center", className)}>
      <div className="flex size-10 items-center justify-center rounded-full bg-paper">
        <Icon className="size-5 text-muted" />
      </div>
      <div className="space-y-1">
        <p className="font-display text-sm font-semibold text-ink-900">{title}</p>
        {description ? <p className="max-w-sm text-sm text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
