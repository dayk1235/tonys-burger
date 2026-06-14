import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"

interface SuccessStateProps {
  title: string
  description?: string
  className?: string
}

export function SuccessState({
  title,
  description,
  className,
}: SuccessStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-success/20 bg-success/5 p-8 text-center",
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <CheckCircle size={32} className="text-success" aria-hidden="true" />
      <div className="space-y-1">
        <p className="font-sans font-semibold text-success">{title}</p>
        {description && (
          <p className="font-sans text-sm text-text-secondary">{description}</p>
        )}
      </div>
    </div>
  )
}
