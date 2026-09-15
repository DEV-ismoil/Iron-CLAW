// Raw hex/rgba tokens for places NativeWind classes can't reach —
// SVG gradients, BlurView tints, shadow colors, chart fills.
// Keep in sync with tailwind.config.js `theme.extend.colors`.

export const colors = {
  void: "#0A0B0D",
  void100: "#111318",
  void200: "#181B21",
  void300: "#20242C",

  glassFill: "rgba(255,255,255,0.07)",
  glassFillStrong: "rgba(255,255,255,0.12)",
  glassBorder: "rgba(255,255,255,0.14)",
  glassBorderStrong: "rgba(255,255,255,0.22)",

  cyan: "#3FE0FF",
  cyanSoft: "#8FF0FF",
  cyanDim: "rgba(63,224,255,0.35)",

  emerald: "#34F5A6",
  emeraldSoft: "#8FFFCE",
  emeraldDim: "rgba(52,245,166,0.35)",

  ink: "#F5F7FA",
  inkDim: "rgba(245,247,250,0.62)",
  inkFaint: "rgba(245,247,250,0.34)",

  chrome: {
    dark: "#6B747E",
    light: "#A8B0B8",
    highlight: "#D6DCE0",
    shadow: "#141519",
  },
} as const;

export type HeatLevel = 0 | 1 | 2 | 3 | 4;

// Heat-map intensity for the year overview — 0 = no workout, 4 = big session.
// Bumped noticeably brighter than a first pass would suggest: at small cell
// sizes (11-16px) a subtle tint reads as "empty" even when a day was logged.
export const heatColor = (level: HeatLevel): string => {
  switch (level) {
    case 0:
      return "rgba(255,255,255,0.05)";
    case 1:
      return "rgba(63,224,255,0.42)";
    case 2:
      return "rgba(63,224,255,0.68)";
    case 3:
      return "rgba(52,245,166,0.82)";
    case 4:
      return "#34F5A6";
    default:
      return "rgba(255,255,255,0.05)";
  }
};
