import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface ErrorStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function ErrorState({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-error/20 bg-error/5 p-8 text-center",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle size={32} className="text-error" aria-hidden="true" />
      <div className="space-y-1">
        <p className="font-sans font-semibold text-error">{title}</p>
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
