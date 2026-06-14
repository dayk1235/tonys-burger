import { cn } from "@/lib/utils"
import { LoadingSpinner } from "./loading-spinner"

interface CardLoaderProps {
  label?: string
  className?: string
  aspectRatio?: "square" | "video"
}

export function CardLoader({
  label = "Loading",
  className,
  aspectRatio = "video",
}: CardLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-bg-surface",
        aspectRatio === "video" ? "aspect-video" : "aspect-square",
        className
      )}
      role="status"
      aria-label={label}
    >
      <div className="flex flex-1 items-center justify-center">
        <LoadingSpinner size="sm" />
      </div>
    </div>
  )
}
