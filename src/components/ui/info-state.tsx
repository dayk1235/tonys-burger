import { cn } from "@/lib/utils"
import { Info } from "lucide-react"

interface InfoStateProps {
  title: string
  description?: string
  className?: string
}

export function InfoState({
  title,
  description,
  className,
}: InfoStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-info/20 bg-info/5 p-8 text-center",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Info size={32} className="text-info" aria-hidden="true" />
      <div className="space-y-1">
        <p className="font-sans font-semibold text-info">{title}</p>
        {description && (
          <p className="font-sans text-sm text-text-secondary">{description}</p>
        )}
      </div>
    </div>
  )
}
