/**
 * Centralised brand identity.
 *
 * Change the product name, tagline, logo mark and palette here.
 * No component or copy string should hard-code these values.
 */
export const brand = {
  /** Working product name. */
  name: "BackOnTrack",

  /** Short tagline used after the product name and as the closing demo line. */
  tagline: "Know what to learn next.",

  /** Core proposition for internal reference and pitch context. */
  proposition:
    "Tell every student the next best block of learning — and decide again when their state changes.",

  /** One-line product description for SEO metadata. */
  description:
    "A curriculum-grounded recovery planner that adapts each learning block as a student's state changes.",

  /** Complete working palette — referenced in globals.css as CSS custom properties. */
  palette: {
    bg: "#f7f8f6",
    surface: "#ffffff",
    surfaceMuted: "#f0f2ef",
    ink: "#17201f",
    textSecondary: "#5d6663",
    border: "#dce2de",
    borderStrong: "#cbd4cf",
    brand: "#0f7358",
    brandDark: "#095640",
    brandSoft: "#e5f1ec",
    signal: "#e3a124",
    signalSoft: "#fff4d8",
    danger: "#b42318",
    dangerSoft: "#fdecea",
    info: "#2459a6",
    infoSoft: "#eaf1fb",
  },

  /** Typography stacks. */
  fonts: {
    sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
  },
} as const;
