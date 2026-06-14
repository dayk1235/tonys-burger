import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { ChevronRight } from "lucide-react"

interface InfoCardProps {
  icon?: LucideIcon
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
}

export function InfoCard({
  icon: Icon,
  title,
  description,
  children,
  className,
  href,
  onClick,
}: InfoCardProps) {
  const content = (
    <div
      className={cn(
        "group/card flex items-start gap-4 rounded-2xl border border-border bg-bg-surface p-5 shadow-sm transition-all duration-normal hover:-translate-y-0.5 hover:border-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/5 md:p-6",
        (href || onClick) && "cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {Icon && (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
          <Icon size={22} aria-hidden="true" />
        </div>
      )}
      <div className="flex-1 space-y-1.5">
        <h4 className="font-heading text-xl tracking-wide text-text-primary">
          {title}
        </h4>
        {description && (
          <p className="font-sans text-sm leading-relaxed text-text-secondary">{description}</p>
        )}
        {children}
      </div>
      {(href || onClick) && (
        <ChevronRight
          size={18}
          className="mt-2 shrink-0 text-text-muted transition-transform duration-fast group-hover/card:translate-x-0.5"
          aria-hidden="true"
        />
      )}
    </div>
  )

  if (href) {
    return <a href={href}>{content}</a>
  }

  return content
}
