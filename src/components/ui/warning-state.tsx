import { cn } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"

interface WarningStateProps {
  title: string
  description?: string
  className?: string
}

export function WarningState({
  title,
  description,
  className,
}: WarningStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-warning/20 bg-warning/5 p-8 text-center",
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <AlertTriangle size={32} className="text-warning" aria-hidden="true" />
      <div className="space-y-1">
        <p className="font-sans font-semibold text-warning">{title}</p>
        {description && (
          <p className="font-sans text-sm text-text-secondary">{description}</p>
        )}
      </div>
    </div>
  )
}
