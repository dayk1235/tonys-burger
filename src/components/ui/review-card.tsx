import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

interface ReviewCardProps {
  name: string
  text: string
  rating: number
  className?: string
  date?: string
  avatar?: string
}

export function ReviewCard({
  name,
  text,
  rating,
  className,
  date,
  avatar,
}: ReviewCardProps) {
  return (
    <blockquote
      className={cn(
        "flex flex-col gap-5 rounded-2xl border border-border bg-bg-surface p-6 shadow-sm transition-all duration-normal hover:-translate-y-0.5 hover:border-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/5 md:p-8",
        className
      )}
    >
      <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={16}
            className={cn(
              "transition-colors duration-fast",
              i < rating
                ? "fill-brand-secondary text-brand-secondary"
                : "fill-none text-text-muted"
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="font-sans text-sm leading-relaxed italic text-text-primary">
        &ldquo;{text}&rdquo;
      </p>
      <div className="mt-auto flex items-center gap-4 pt-3">
        {avatar && (
          <img
            src={avatar}
            alt={name}
            className="size-11 rounded-full border border-border object-cover"
            loading="lazy"
          />
        )}
        <div>
          <cite className="not-italic font-sans text-sm font-semibold text-text-primary">
            {name}
          </cite>
          {date && (
            <time className="block font-sans text-xs text-text-muted">
              {date}
            </time>
          )}
        </div>
      </div>
    </blockquote>
  )
}
