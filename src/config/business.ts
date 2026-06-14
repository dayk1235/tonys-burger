export const BUSINESS_CONFIG = {
  name: "Tony's Burger",
  tagline: "Hamburguesas al carbón",
  locationName: "Tony's Burger Centro",

  whatsapp: {
    number: "",
    message: "¡Hola! Quiero pedir unas hamburguesas para llevar 🙌",
  },

  phone: "Pendiente de confirmar",
  email: "Correo por confirmar",

  address: {
    full: "Dirección por confirmar",
  },

  hours: {
    display: "Horario por confirmar",
    detailed: "Horario por confirmar",
  },

  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },

  links: {
    siteUrl: "",
  },

  footer: {
    description: "Hamburguesas al carbón, ingredientes frescos y un sabor que habla solo. Así es Tony's.",
    rights: `© ${new Date().getFullYear()} Tony's Burger. Todos los derechos reservados.`,
  },
} as const;
