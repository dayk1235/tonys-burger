import { cn } from "@/lib/utils"

interface SectionSubtitleProps {
  children: React.ReactNode
  className?: string
  align?: "center" | "left"
}

export function SectionSubtitle({
  children,
  className,
  align = "center",
}: SectionSubtitleProps) {
  return (
    <p
      className={cn(
        "mx-auto mt-5 max-w-2xl font-sans text-base leading-relaxed text-text-secondary md:text-lg",
        align === "center" && "text-center",
        className
      )}
    >
      {children}
    </p>
  )
}
