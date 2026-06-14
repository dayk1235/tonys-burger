import { cn } from "@/lib/utils"
import { MessageSquare } from "lucide-react"

interface EmptyReviewsProps {
  className?: string
  message?: string
  description?: string
}

export function EmptyReviews({
  className,
  message = "No reviews yet",
  description = "Be the first to share your experience!",
}: EmptyReviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-bg-surface/50 px-6 py-16 text-center",
        className
      )}
      role="status"
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-bg-surface-alt">
        <MessageSquare size={28} className="text-text-muted" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="font-sans font-medium text-text-primary">{message}</p>
        <p className="font-sans text-sm text-text-secondary">{description}</p>
      </div>
    </div>
  )
}
