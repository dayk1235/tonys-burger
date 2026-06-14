import { cn } from "@/lib/utils"

interface LocationCardSkeletonProps {
  className?: string
}

export function LocationCardSkeleton({ className }: LocationCardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-bg-surface",
        className
      )}
      aria-hidden="true"
    >
      <div className="aspect-video w-full animate-pulse bg-bg-surface-alt" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-bg-surface-alt" />
        <div className="flex items-start gap-3">
          <div className="size-[18px] shrink-0 animate-pulse rounded bg-bg-surface-alt" />
          <div className="h-3 w-full animate-pulse rounded bg-bg-surface-alt" />
        </div>
        <div className="flex items-start gap-3">
          <div className="size-[18px] shrink-0 animate-pulse rounded bg-bg-surface-alt" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-bg-surface-alt" />
        </div>
      </div>
    </div>
  )
}
