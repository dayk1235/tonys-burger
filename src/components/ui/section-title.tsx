import { cn } from "@/lib/utils"

interface SectionTitleProps {
  children: React.ReactNode
  className?: string
  as?: "h1" | "h2" | "h3"
  align?: "center" | "left"
}

export function SectionTitle({
  children,
  className,
  as: Component = "h2",
  align = "center",
}: SectionTitleProps) {
  return (
    <Component
      className={cn(
        "font-heading text-4xl leading-[1.15] tracking-wide text-text-primary md:text-5xl lg:text-6xl",
        align === "center" && "text-center",
        className
      )}
    >
      {children}
    </Component>
  )
}
