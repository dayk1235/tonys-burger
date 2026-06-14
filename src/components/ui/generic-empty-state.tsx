import { cn } from "@/lib/utils"
import { Inbox } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface GenericEmptyStateProps {
  icon?: LucideIcon
  message?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function GenericEmptyState({
  icon: Icon = Inbox,
  message = "Nothing here yet",
  description,
  actionLabel,
  onAction,
  className,
}: GenericEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-bg-surface/50 px-6 py-16 text-center",
        className
      )}
      role="status"
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-bg-surface-alt">
        <Icon size={28} className="text-text-muted" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="font-sans font-medium text-text-primary">{message}</p>
        {description && (
          <p className="font-sans text-sm text-text-secondary">{description}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 font-sans text-sm font-medium text-brand-primary transition-colors duration-fast hover:text-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
