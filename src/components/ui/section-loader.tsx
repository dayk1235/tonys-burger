import { cn } from "@/lib/utils"
import { LoadingDots } from "./loading-dots"

interface SectionLoaderProps {
  label?: string
  className?: string
}

export function SectionLoader({
  label = "Loading section",
  className,
}: SectionLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-20",
        className
      )}
      role="status"
      aria-label={label}
    >
      <LoadingDots size="lg" />
      <p className="font-sans text-sm text-text-muted">{label}</p>
    </div>
  )
}
