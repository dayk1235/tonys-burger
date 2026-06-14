import { cn } from "@/lib/utils"
import { SectionTitle } from "./section-title"
import { SectionSubtitle } from "./section-subtitle"
import { SectionDivider } from "./section-divider"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
  className?: string
  align?: "center" | "left"
  withDivider?: boolean
}

export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  className,
  align = "center",
  withDivider = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary">
          {eyebrow}
        </p>
      )}
      <SectionTitle align={align}>{title}</SectionTitle>
      {subtitle && <SectionSubtitle align={align}>{subtitle}</SectionSubtitle>}
      {withDivider && (
        <SectionDivider className={align === "center" ? "mx-auto" : ""} />
      )}
    </div>
  )
}
