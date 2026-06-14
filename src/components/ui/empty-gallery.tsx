import { cn } from "@/lib/utils"
import { ImageOff } from "lucide-react"

interface EmptyGalleryProps {
  className?: string
  message?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyGallery({
  className,
  message = "No images to display yet",
  actionLabel,
  onAction,
}: EmptyGalleryProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-bg-surface/50 px-6 py-16 text-center",
        className
      )}
      role="status"
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-bg-surface-alt">
        <ImageOff size={28} className="text-text-muted" aria-hidden="true" />
      </div>
      <p className="font-sans text-sm text-text-secondary">{message}</p>
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
