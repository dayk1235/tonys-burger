import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group/card flex flex-col gap-4 rounded-xl border border-border bg-bg-surface p-6 transition-all duration-normal hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5",
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary transition-colors duration-normal group-hover/card:bg-brand-primary group-hover/card:text-white">
        <Icon size={24} aria-hidden="true" />
      </div>
      <h3 className="font-heading text-xl tracking-wide text-text-primary">
        {title}
      </h3>
      <p className="font-sans text-sm leading-relaxed text-text-secondary">
        {description}
      </p>
    </div>
  )
}
