import * as React from "react";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-xs font-medium text-flag-600">{error}</p> : null}
    </div>
  );
}
