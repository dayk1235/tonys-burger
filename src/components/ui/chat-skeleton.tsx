import { cn } from "@/lib/utils"

interface ChatSkeletonProps {
  className?: string
}

export function ChatSkeleton({ className }: ChatSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-4 p-4", className)} aria-hidden="true">
      <div className="flex justify-start">
        <div className="space-y-2 rounded-2xl rounded-bl-md bg-bg-surface-alt p-3">
          <div className="h-3 w-48 animate-pulse rounded bg-bg-elevated" />
        </div>
      </div>
      <div className="flex justify-end">
        <div className="space-y-2 rounded-2xl rounded-br-md bg-bg-surface-alt p-3">
          <div className="h-3 w-32 animate-pulse rounded bg-bg-elevated" />
          <div className="h-3 w-24 animate-pulse rounded bg-bg-elevated" />
        </div>
      </div>
      <div className="flex justify-start">
        <div className="space-y-2 rounded-2xl rounded-bl-md bg-bg-surface-alt p-3">
          <div className="h-3 w-40 animate-pulse rounded bg-bg-elevated" />
          <div className="h-3 w-36 animate-pulse rounded bg-bg-elevated" />
          <div className="h-3 w-28 animate-pulse rounded bg-bg-elevated" />
        </div>
      </div>
      <div className="flex justify-end">
        <div className="space-y-2 rounded-2xl rounded-br-md bg-bg-surface-alt p-3">
          <div className="h-3 w-44 animate-pulse rounded bg-bg-elevated" />
        </div>
      </div>
    </div>
  )
}
