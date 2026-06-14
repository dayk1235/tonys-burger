export const PLACEHOLDER = {
  SITE_DESCRIPTION: "Las hamburguesas al carbón más chingonas de la ciudad. Carne jugosa, queso derretido y ese sabor que buscas.",

  /* ─── Hero Section ──────────────────────────── */
  HERO_TITLE: "HAMBURGUESAS\nAL CARBÓN",
  HERO_SUBTITLE: "Carne angus 100% cocida en fuego real. Queso que se derrite, pan tostado y un sabor que no vas a olvidar.",
  HERO_CTA_PRIMARY: "Pedir por WhatsApp",
  HERO_CTA_SECONDARY: "Ver el menú",
  HERO_IMAGE_ALT: "Hamburguesa premium en una escena oscura y cinematográfica",
  HERO_IMAGE_SRC: "/assets/hero/hero-premium-wide.png",
  HERO_TRUST_INDICATORS: [
    { label: "Ingredientes frescos", icon: "check" },
    { label: "Carne angus 100%", icon: "check" },
    { label: "Negocio familiar", icon: "check" },
  ] as const,

  /* ─── Featured Burgers Section ──────────────── */
  FEATURED_TITLE: "Especialidades",
  FEATURED_DESCRIPTION: "Las que todo mundo pide cuando llega con hambre.",
  FEATURED_BURGERS: [
    {
      id: "featured_1",
      name: "The Classic",
      description: "La que nunca falla. Queso cheddar derretido, cebolla caramelizada y nuestra salsa especial. Simple y perfecta.",
      price: 14.99,
      image: "/assets/demo/burgers/burger-classic.webp",
      imageAlt: "The Classic con queso cheddar derretido",
      category: "Especial",
      badge: "El más vendido",
    },
    {
      id: "featured_2",
      name: "Smoky BBQ",
      description: "Brisket ahumado, mermelada de tocino, aros de cebolla crujientes y nuestra BBQ casera. Sí, es tan buena como suena.",
      price: 17.99,
      image: "/assets/demo/burgers/burger-double.webp",
      imageAlt: "Smoky BBQ con brisket y tocino",
      category: "Especial",
      badge: "Recomendado",
    },
    {
      id: "featured_3",
      name: "The Inferno",
      description: "Queso ghost pepper jack, salsa de habanero, jalapeños frescos y chipotle. Si no pica, no paga.",
      price: 16.99,
      image: "/assets/demo/burgers/burger-special.webp",
      imageAlt: "The Inferno — hamburguesa picante",
      category: "Picosa",
      badge: "Picante",
    },
  ] as const,

  /* ─── About Section ─────────────────────────── */
  ABOUT_TITLE: "Fuego, carne y tradición",
  ABOUT_SUBTITLE: "Desde el primer día, todo al carbón.",
  ABOUT_TEXT: "Todo empezó con una idea bien sencilla: hacer la hamburguesa que a nosotros nos gustaría comer. Carne angus de verdad, verduras frescas todos los días, y un comal lleno de carbón prendido. No hay atajos, no hay congeladores. Solo cocina honesta y ganas de darle de comer bien a la gente.",
  ABOUT_IMAGE_ALT: "Nuestra cocina abierta, donde todo se prepara al carbón",
  ABOUT_IMAGE_SRC: "/assets/demo/hero/hero-burger.webp",

  /* ─── Menu Preview Section ──────────────────── */
  MENU_SECTION_TITLE: "El Menú",
  MENU_SECTION_DESCRIPTION: "Pide por WhatsApp y te lo tenemos listo en lo que llegas.",
  MENU_ITEMS: [
    {
      id: "menu_1",
      name: "Classic Burger",
      description: "Clásica que nunca falla. Carne angus, lechuga, tomate, pepinillos y nuestra salsa de la casa.",
      price: 12.99,
      image: "/assets/demo/burgers/burger-classic.webp",
      imageAlt: "Classic Burger",
      category: "Hamburguesas",
      badge: "El más vendido",
    },
    {
      id: "menu_2",
      name: "Double Cheeseburger",
      description: "Dos carnes angus con queso americano derretido, cebolla asada y salsa de la casa. Para el hambriento.",
      price: 15.99,
      image: "/assets/demo/burgers/burger-double.webp",
      imageAlt: "Double Cheeseburger",
      category: "Hamburguesas",
      badge: "Popular",
    },
    {
      id: "menu_3",
      name: "Spicy Chicken",
      description: "Pollo crujiente bañado en nuestra salsa picante, con coleslaw y aderezo ranch. El que pica, repite.",
      price: 13.99,
      image: "/assets/demo/burgers/burger-special.webp",
      imageAlt: "Spicy Chicken Burger",
      category: "Pollo",
      badge: "Picante",
    },
    {
      id: "menu_4",
      name: "Veggie Deluxe",
      description: "Patties de frijol negro hechos en casa, aguacate, pimientos asados y chipotle. Hasta los carnívoros la piden.",
      price: 13.99,
      image: "/assets/demo/burgers/burger-classic.webp",
      imageAlt: "Veggie Deluxe",
      category: "Veggie",
      badge: undefined,
    },
    {
      id: "menu_5",
      name: "Bacon Ranch",
      description: "Tocino crujiente, aderezo ranch, cheddar añejo y lechuga fresca. La favorita de los que no se andan con medias tintas.",
      price: 16.99,
      image: "/assets/demo/burgers/burger-double.webp",
      imageAlt: "Bacon Ranch Burger",
      category: "Hamburguesas",
      badge: "Popular",
    },
    {
      id: "menu_6",
      name: "Mushroom Swiss",
      description: "Hongos salteados, queso suizo derretido, trufa y rúcula. Suena elegante, sabe delicioso.",
      price: 15.99,
      image: "/assets/demo/burgers/burger-special.webp",
      imageAlt: "Mushroom Swiss Burger",
      category: "Hamburguesas",
      badge: "Recomendado",
    },
  ] as const,

  /* ─── Gallery Section ───────────────────────── */
  GALLERY_TITLE: "Así se ve",
  GALLERY_DESCRIPTION: "Fotos reales de lo que servimos todos los días. Sin filtros raros, sin trucos.",
  GALLERY_IMAGES: [
    { src: "/assets/demo/gallery/gallery-01.webp", alt: "Preparando hamburguesas al carbón", caption: "Se prendió el carbón" },
    { src: "/assets/demo/gallery/gallery-02.webp", alt: "Hamburguesa servida con papas", caption: "La que pide todo mundo" },
    { src: "/assets/demo/gallery/gallery-03.webp", alt: "Papas gourmet cortadas a mano", caption: "Doraditas por fuera, suaves por dentro" },
    { src: "/assets/demo/gallery/gallery-04.webp", alt: "Bebidas artesanales", caption: "Para bajar la hamburguesa" },
    { src: "/assets/demo/gallery/gallery-05.webp", alt: "Nuestra cocina abierta", caption: "Aquí pasa la magia" },
    { src: "/assets/demo/gallery/gallery-06.webp", alt: "Ambiente del restaurante", caption: "Siéntete como en casa" },
  ] as const,

  /* ─── Testimonials Section ──────────────────── */
  TESTIMONIALS_TITLE: "Lo que dice la raza",
  TESTIMONIALS_DESCRIPTION: "Gente real, reseñas reales. Sin letras chiquitas.",
  TESTIMONIALS: [
    {
      name: "Juan D.",
      text: "De verdad que están bien buenas. La carne sabe a carbón, el pan está tostadito y el queso se derrite bien. No es como esas hamburguesas de plaza vacía. Aquí se nota que hay amor.",
      rating: 5,
      date: "Marzo 2026",
    },
    {
      name: "Sara M.",
      text: "La Smoky BBQ me cambió la vida. No es broma. El brisket se deshace, la mermelada de tocino es otra cosa. Ya voy tres veces en el mes y las papas también están increíbles.",
      rating: 5,
      date: "Febrero 2026",
    },
    {
      name: "Alex R.",
      text: "Pensé que la Inferno iba a ser puro humo, pero sí pica bien rico. Si te gusta el picante, esta es tu hamburguesa. Yo ya le agarré el gusto y ahora soy cliente recurrente.",
      rating: 5,
      date: "Enero 2026",
    },
  ] as const,

  /* ─── Location Section ──────────────────────── */
  LOCATION_TITLE: "Visítanos",
  LOCATION_MAP_PLACEHOLDER: "Cargando mapa...",

  /* ─── CTA Section ───────────────────────────── */
  CTA_TITLE: "¿Ya se te antojó?",
  CTA_DESCRIPTION: "Pide por WhatsApp y pasa por tu hamburguesa. La tenemos lista en 15-20 minutos.",
  CTA_BUTTON: "Pedir por WhatsApp",
  CTA_SECONDARY_BUTTON: "Encuéntranos",

  /* ─── Contact Section ───────────────────────── */
  CONTACT_TITLE: "Contacto",
} as const;
