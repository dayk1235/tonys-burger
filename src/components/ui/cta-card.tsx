import { cn } from "@/lib/utils"
import { Button } from "./button"
import type { LucideIcon } from "lucide-react"

interface CTACardProps {
  title: string
  description?: string
  buttonLabel: string
  onButtonClick?: () => void
  icon?: LucideIcon
  className?: string
  variant?: "default" | "brand" | "accent"
  buttonVariant?: "default" | "cta" | "outline"
}

const variantStyles = {
  default: "border-border bg-bg-surface",
  brand: "border-brand-primary/20 bg-gradient-to-br from-brand-primary/10 to-brand-primary/5",
  accent: "border-brand-secondary/20 bg-brand-secondary/5",
}

export function CTACard({
  title,
  description,
  buttonLabel,
  onButtonClick,
  icon: Icon,
  className,
  variant = "default",
  buttonVariant = "cta",
}: CTACardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-7 rounded-3xl border p-8 text-center shadow-sm md:p-14",
        variantStyles[variant],
        className
      )}
    >
      {Icon && (
        <div className="flex size-16 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary shadow-glow-primary">
          <Icon size={32} aria-hidden="true" />
        </div>
      )}
      <div className="space-y-3">
        <h3 className="font-heading text-4xl leading-[1.15] tracking-wide text-text-primary md:text-5xl">
          {title}
        </h3>
        {description && (
          <p className="mx-auto max-w-lg font-sans text-base leading-relaxed text-text-secondary">
            {description}
          </p>
        )}
      </div>
      <Button
        variant={buttonVariant}
        size="xl"
        onClick={onButtonClick}
      >
        {buttonLabel}
      </Button>
    </div>
  )
}
