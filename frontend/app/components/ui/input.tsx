import * as React from "react";
import { cn } from "~/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-line-strong bg-surface px-3 py-1 text-sm text-ink-900 shadow-xs outline-none transition-colors placeholder:text-muted focus-visible:border-signal-500 focus-visible:ring-2 focus-visible:ring-signal-100 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
