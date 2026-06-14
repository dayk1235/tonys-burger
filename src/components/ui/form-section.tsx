import { cn } from "@/lib/utils"
import { SectionDivider } from "./section-divider"

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  withDivider?: boolean
}

export function FormSection({
  title,
  description,
  children,
  className,
  withDivider = true,
}: FormSectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-1">
        <h3 className="font-heading text-xl tracking-wide text-text-primary">
          {title}
        </h3>
        {description && (
          <p className="font-sans text-sm text-text-secondary">{description}</p>
        )}
      </div>
      {withDivider && <SectionDivider />}
      <div className="space-y-5">{children}</div>
    </div>
  )
}
