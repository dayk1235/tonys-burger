import { cn } from "@/lib/utils"

interface SectionContainerProps {
  children: React.ReactNode
  className?: string
  as?: "section" | "div" | "article"
  id?: string
  background?: "default" | "surface" | "alt" | "brand"
  fullWidth?: boolean
}

const backgroundStyles = {
  default: "bg-bg",
  surface: "bg-bg-surface",
  alt: "bg-bg-surface-alt",
  brand: "bg-brand-primary/5",
}

const overlayGradients = {
  default: "bg-gradient-to-b from-brand-primary/[0.02] to-transparent",
  surface: "bg-gradient-to-b from-brand-primary/[0.03] to-transparent",
  alt: "bg-gradient-to-b from-brand-primary/[0.04] to-transparent",
  brand: "bg-gradient-to-b from-brand-primary/[0.08] to-transparent",
}

export function SectionContainer({
  children,
  className,
  as: Component = "section",
  id,
  background = "default",
  fullWidth = false,
}: SectionContainerProps) {
  return (
    <Component
      id={id}
      className={cn(
        "relative py-16 md:py-20 lg:py-24",
        backgroundStyles[background],
        className
      )}
    >
      {/* Subtle top gradient overlay for visual depth */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-32",
          overlayGradients[background]
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          "mx-auto px-4 md:px-6 lg:px-8",
          fullWidth ? "w-full" : "max-w-container-max"
        )}
      >
        {children}
      </div>
    </Component>
  )
}
