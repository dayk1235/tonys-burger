"use client";

import { cn } from "@/lib/utils";

interface DashboardContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardContainer({ children, className }: DashboardContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
