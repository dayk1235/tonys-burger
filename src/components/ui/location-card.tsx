import { cn } from "@/lib/utils"
import { MapPin, Clock, Phone } from "lucide-react"

interface LocationCardProps {
  name: string
  address: string
  hours: string
  phone?: string
  className?: string
  image?: string
}

export function LocationCard({
  name,
  address,
  hours,
  phone,
  className,
  image,
}: LocationCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-surface shadow-sm transition-all duration-normal hover:-translate-y-0.5 hover:border-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/5",
        className
      )}
    >
      {image && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex flex-col gap-5 p-6">
        <h3 className="font-heading text-2xl tracking-wide text-text-primary">
          {name}
        </h3>
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
            <MapPin size={16} className="text-brand-primary" aria-hidden="true" />
          </div>
          <p className="font-sans text-sm leading-relaxed text-text-secondary">{address}</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-secondary/10">
            <Clock size={16} className="text-brand-secondary" aria-hidden="true" />
          </div>
          <p className="font-sans text-sm leading-relaxed text-text-secondary">{hours}</p>
        </div>
        {phone && (
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary-light/10">
              <Phone size={16} className="text-brand-primary-light" aria-hidden="true" />
            </div>
            <a
              href={`tel:${phone}`}
              className="font-sans text-sm text-text-secondary transition-colors duration-fast hover:text-brand-primary"
            >
              {phone}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
