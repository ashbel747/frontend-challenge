export const tokens = {
  colors: {
    brand: "var(--color-brand)",
    brandHover: "var(--color-brand-hover)",
    brandMuted: "var(--color-brand-muted)",
    gradient: "var(--color-gradient)",
    bgNav: "var(--color-bg-nav)",
    bgPage: "var(--color-bg-page)",
    bgSurface: "var(--color-bg-surface)",
    textMain: "var(--color-text-main)",
    textHeader: "var(--color-text-header)",
    borderSubtle: "var(--color-border-subtle)",
  },
  spacing: {
    navPx: "1.5rem",
    navPy: "1rem",
    container: "2rem",
    btnPx: "1rem",
    btnPy: "0.5rem",
  },
  radius: {
    md: "0.5rem",
    full: "9999px",
  },
  layout: {
    navZ: "50",
  },
  effects: {
    shadow: "var(--shadow-main)",
  }
} as const;