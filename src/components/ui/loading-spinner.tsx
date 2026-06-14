import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  label?: string
}

const sizeMap = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
}

export function LoadingSpinner({
  size = "md",
  className,
  label = "Loading",
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      role="status"
      aria-label={label}
    >
      <Loader2
        className={cn("animate-spin text-brand-primary", sizeMap[size])}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}
