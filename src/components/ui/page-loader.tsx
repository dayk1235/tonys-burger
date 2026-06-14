import { cn } from "@/lib/utils"
import { LoadingSpinner } from "./loading-spinner"

interface PageLoaderProps {
  label?: string
  className?: string
  fullScreen?: boolean
}

export function PageLoader({
  label = "Loading page",
  className,
  fullScreen = true,
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        fullScreen && "fixed inset-0 z-overlay bg-bg/80 backdrop-blur-sm",
        className
      )}
      role="status"
      aria-label={label}
    >
      <LoadingSpinner size="lg" />
      <p className="font-sans text-sm text-text-muted animate-pulse">{label}</p>
    </div>
  )
}
