import { BUSINESS_CONFIG } from "@/config/business";
import { MapPin, Phone, Mail, Clock, Camera, ExternalLink } from "lucide-react";

const FOOTER_LINKS = {
  navigate: [
    { label: "Inicio", href: "/" },
    { label: "Menú", href: "#menu-preview" },
    { label: "Galería", href: "#gallery" },
    { label: "Ubicación", href: "#location" },
  ],
  legal: [
    { label: "Privacidad", href: "/privacy-policy" },
    { label: "Términos", href: "/terms-of-service" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-bg-surface" role="contentinfo">
      {/* Top decorative gradient line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-container-max px-4 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <h3 className="font-heading text-3xl tracking-wide text-text-primary">
              {BUSINESS_CONFIG.name}
            </h3>
            <p className="font-sans text-sm leading-relaxed text-text-muted">
              {BUSINESS_CONFIG.footer.description}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {BUSINESS_CONFIG.social.instagram && (
                <a
                  href={BUSINESS_CONFIG.social.instagram}
                  className="flex size-10 items-center justify-center rounded-xl border border-border text-text-muted transition-all duration-fast hover:border-brand-primary hover:bg-brand-primary/5 hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Camera size={18} aria-hidden="true" />
                </a>
              )}
              {BUSINESS_CONFIG.social.facebook && (
                <a
                  href={BUSINESS_CONFIG.social.facebook}
                  className="flex size-10 items-center justify-center rounded-xl border border-border text-text-muted transition-all duration-fast hover:border-brand-primary hover:bg-brand-primary/5 hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={18} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-5 font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Navega
            </h4>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.navigate.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-sans text-sm text-text-muted transition-colors duration-fast hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Contacto
            </h4>
            <ul className="space-y-4" role="list">
              <li>
                <a
                  href={`tel:${BUSINESS_CONFIG.phone}`}
                  className="flex items-start gap-3 font-sans text-sm text-text-muted transition-colors duration-fast hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
                    <Phone size={13} className="text-brand-primary" aria-hidden="true" />
                  </span>
                  <span>{BUSINESS_CONFIG.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BUSINESS_CONFIG.email}`}
                  className="flex items-start gap-3 font-sans text-sm text-text-muted transition-colors duration-fast hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-primary-light/10">
                    <Mail size={13} className="text-brand-primary-light" aria-hidden="true" />
                  </span>
                  <span>{BUSINESS_CONFIG.email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 font-sans text-sm text-text-muted">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-secondary/10">
                    <MapPin size={13} className="text-brand-secondary" aria-hidden="true" />
                  </span>
                  <span>{BUSINESS_CONFIG.address.full}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="mb-5 font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Horario
            </h4>
            <div className="flex items-start gap-3 font-sans text-sm text-text-muted">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-secondary/10">
                <Clock size={13} className="text-brand-secondary" aria-hidden="true" />
              </span>
              <span className="leading-relaxed">{BUSINESS_CONFIG.hours.display}</span>
            </div>
          </div>
        </div>

        {/* Legal Links + Copyright */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-7 md:flex-row">
          <ul className="flex gap-6" role="list">
            {FOOTER_LINKS.legal.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-sans text-xs text-text-muted transition-colors duration-fast hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="font-sans text-xs text-text-muted">
            {BUSINESS_CONFIG.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
