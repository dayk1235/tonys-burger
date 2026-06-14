import { cn } from "@/lib/utils"

interface ReviewCardSkeletonProps {
  className?: string
}

export function ReviewCardSkeleton({ className }: ReviewCardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-bg-surface p-6",
        className
      )}
      aria-hidden="true"
    >
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="size-4 animate-pulse rounded-sm bg-bg-surface-alt"
          />
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-bg-surface-alt" />
        <div className="h-3 w-full animate-pulse rounded bg-bg-surface-alt" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-bg-surface-alt" />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <div className="size-10 animate-pulse rounded-full bg-bg-surface-alt" />
        <div className="space-y-1.5">
          <div className="h-3 w-24 animate-pulse rounded bg-bg-surface-alt" />
          <div className="h-2 w-16 animate-pulse rounded bg-bg-surface-alt" />
        </div>
      </div>
    </div>
  )
}
