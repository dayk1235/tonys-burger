export const BUSINESS_CONFIG = {
  name: "Tony's Burger",
  tagline: "Hamburguesas al carbón",
  locationName: "Tony's Burger Centro",

  whatsapp: {
    number: "+1234567890",
    message: "¡Hola! Quiero pedir unas hamburguesas para llevar 🙌",
  },

  phone: "(555) 123-4567",
  email: "hello@tonys-burger.com",

  address: {
    full: "123 Burger Street, Foodville, CA 90210",
  },

  hours: {
    display: "Lun-Sáb: 11AM-10PM, Dom: 12PM-9PM",
    detailed: "Lun — Sáb: 11AM — 10PM\nDomingo: 12PM — 9PM",
  },

  social: {
    instagram: "https://instagram.com/tonysburger",
    facebook: "https://facebook.com/tonysburger",
    tiktok: "https://tiktok.com/@tonysburger",
  },

  links: {
    siteUrl: "https://tonys-burger.com",
  },

  footer: {
    description: "Hamburguesas al carbón, ingredientes frescos y un sabor que habla solo. Así es Tony's.",
    rights: `© ${new Date().getFullYear()} Tony's Burger. Todos los derechos reservados.`,
  },
} as const;
