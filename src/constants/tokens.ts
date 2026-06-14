const fonts = {
  inter: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  bebasNeue: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",
} as const;

const colors = {
  brand: {
    primary: "#8B1A1A",
    primaryHover: "#6E1414",
    primaryLight: "#C0392B",
    secondary: "#D4862A",
    secondaryHover: "#B8721F",
    secondaryLight: "#E8A04A",
  },
  bg: {
    base: "#0E0E0E",
    surface: "#181818",
    surfaceAlt: "#222222",
    elevated: "#2A2A2A",
  },
  text: {
    primary: "#F5F5F5",
    secondary: "#A0A0A0",
    muted: "#6B6B6B",
    inverse: "#0E0E0E",
  },
  semantic: {
    success: "#2E7D32",
    error: "#D32F2F",
    warning: "#D4862A",
    info: "#1976D2",
  },
  border: {
    base: "#333333",
    light: "#444444",
  },
} as const;

const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  "2xl": "2rem",
  "3xl": "3rem",
  "4xl": "4rem",
} as const;

const radius = {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
  full: "9999px",
} as const;

const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.3)",
  md: "0 4px 6px rgba(0, 0, 0, 0.4)",
  lg: "0 10px 15px rgba(0, 0, 0, 0.5)",
  xl: "0 20px 25px rgba(0, 0, 0, 0.6)",
  glowPrimary: "0 0 20px rgba(139, 26, 26, 0.3)",
  glowSecondary: "0 0 20px rgba(212, 134, 42, 0.3)",
} as const;

const zIndex = {
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
} as const;

const animation = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
} as const;

const containers = {
  max: "1280px",
  narrow: "768px",
  wide: "1440px",
} as const;

const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1440px",
} as const;

export const tokens = {
  fonts,
  colors,
  spacing,
  radius,
  shadows,
  zIndex,
  animation,
  containers,
  breakpoints,
} as const;

export type Tokens = typeof tokens;
