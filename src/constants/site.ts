import { BUSINESS_CONFIG } from "@/config/business";

export const SITE_CONFIG = {
  name: BUSINESS_CONFIG.name,
  locale: "en-US",
  currency: "USD",
  timezone: "America/New_York",

  navigation: [
    { label: "Menu", href: "#menu" },
    { label: "About", href: "#about" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ] as const,

  social: {
    instagram: BUSINESS_CONFIG.social.instagram,
    facebook: BUSINESS_CONFIG.social.facebook,
  } as const,
} as const;
