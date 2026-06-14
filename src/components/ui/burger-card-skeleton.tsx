import { cn } from "@/lib/utils"

interface BurgerCardSkeletonProps {
  className?: string
}

export function BurgerCardSkeleton({ className }: BurgerCardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-bg-surface",
        className
      )}
      aria-hidden="true"
    >
      <div className="aspect-video w-full animate-pulse bg-bg-surface-alt" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-16 animate-pulse rounded bg-bg-surface-alt" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-bg-surface-alt" />
        <div className="h-3 w-full animate-pulse rounded bg-bg-surface-alt" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-bg-surface-alt" />
        <div className="mt-2 h-6 w-20 animate-pulse rounded bg-bg-surface-alt" />
      </div>
    </div>
  )
}
