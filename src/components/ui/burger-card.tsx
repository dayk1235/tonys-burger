import Image from "next/image"
import { cn } from "@/lib/utils"

interface BurgerCardProps {
  name: string
  description: string
  price: number
  image?: string
  imageAlt?: string
  className?: string
  category?: string
  badge?: string
  currency?: string
  featured?: boolean
  onSelect?: () => void
  placeholder?: boolean
}

export function BurgerCard({
  name,
  description,
  price,
  image,
  imageAlt,
  className,
  category,
  badge,
  currency = "$",
  featured = false,
  onSelect,
  placeholder = false,
}: BurgerCardProps) {
  if (placeholder) {
    return (
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-surface transition-colors",
          className
        )}
      >
        <div className="aspect-video w-full bg-bg-surface-alt" />
        <div className="flex flex-col gap-2 p-5">
          <div className="h-5 w-3/4 rounded bg-bg-surface-alt" />
          <div className="h-3 w-full rounded bg-bg-surface-alt" />
          <div className="h-3 w-2/3 rounded bg-bg-surface-alt" />
        </div>
      </div>
    )
  }

  return (
    <article
      className={cn(
        "group/card flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-bg-surface shadow-sm transition-all duration-normal hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5",
        className
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect?.()
        }
      }}
      aria-label={`${name} — ${description}`}
    >
      {image && (
        <div className={cn("relative w-full overflow-hidden", featured ? "aspect-[3/4]" : "aspect-video")}>
          <div
            className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent opacity-0 transition-opacity duration-normal group-hover/card:opacity-100"
            aria-hidden="true"
          />
          <Image
            src={image}
            alt={imageAlt ?? name}
            fill
            className="object-cover transition-transform duration-slow group-hover/card:scale-105"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {badge && (
            <span className="absolute top-2 left-2 rounded-md bg-brand-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {category && (
          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-primary-light">
            {category}
          </span>
        )}
        <h3 className={cn("font-heading tracking-wide text-text-primary", featured ? "text-2xl" : "text-xl")}>
          {name}
        </h3>
        <p className="line-clamp-2 font-sans text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-heading text-3xl tracking-wide text-brand-secondary">
            {currency}
            {price.toFixed(2)}
          </span>
        </div>
      </div>
    </article>
  )
}
