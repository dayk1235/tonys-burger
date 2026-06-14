import { cn } from "@/lib/utils"

interface LoadingDotsProps {
  size?: "sm" | "md" | "lg"
  className?: string
  label?: string
}

const dotSizeMap = {
  sm: "size-1.5",
  md: "size-2",
  lg: "size-2.5",
}

export function LoadingDots({
  size = "md",
  className,
  label = "Loading",
}: LoadingDotsProps) {
  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="status"
      aria-label={label}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "animate-bounce rounded-full bg-brand-primary",
            dotSizeMap[size]
          )}
          style={{
            animationDelay: `${i * 150}ms`,
            animationDuration: "1s",
          }}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  )
}
