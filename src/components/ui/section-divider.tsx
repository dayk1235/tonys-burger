import { cn } from "@/lib/utils"

interface SectionDividerProps {
  className?: string
}

export function SectionDivider({ className }: SectionDividerProps) {
  return (
    <div
      className={cn(
        "mt-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-brand-primary via-brand-primary-light to-brand-secondary shadow-glow-primary/30",
        className
      )}
      aria-hidden="true"
    />
  )
}
