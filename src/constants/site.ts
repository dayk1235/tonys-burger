import { BUSINESS_CONFIG } from "@/config/business";

export const SITE_CONFIG = {
  name: BUSINESS_CONFIG.name,
  locale: "es-MX",
  currency: "MXN",
  timezone: "America/Mexico_City",

  navigation: [
    { label: "Inicio", href: "#" },
    { label: "Menú", href: "#menu-preview" },
    { label: "Galería", href: "#gallery" },
    { label: "Contacto", href: "#contact" },
  ] as const,

  social: {
    instagram: BUSINESS_CONFIG.social.instagram,
    facebook: BUSINESS_CONFIG.social.facebook,
  } as const,
} as const;
