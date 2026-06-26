"use client";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between", className)}>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        {description && (
          <p className="text-sm text-text-muted">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
