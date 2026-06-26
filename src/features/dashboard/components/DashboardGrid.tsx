"use client";

import { cn } from "@/lib/utils";

interface DashboardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function DashboardGrid({ children, columns = 4, className }: DashboardGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-5",
        {
          "grid-cols-1": columns === 1,
          "sm:grid-cols-2": columns === 2,
          "sm:grid-cols-2 lg:grid-cols-3": columns === 3,
          "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4": columns === 4,
        },
        className
      )}
    >
      {children}
    </div>
  );
}
