/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Deep-space base, not pure black — keeps glass panels readable
        void: {
          DEFAULT: "#0A0B0D",
          100: "#111318",
          200: "#181B21",
          300: "#20242C",
        },
        // Frosted glass surfaces
        glass: {
          fill: "rgba(255,255,255,0.07)",
          fillStrong: "rgba(255,255,255,0.12)",
          border: "rgba(255,255,255,0.14)",
          borderStrong: "rgba(255,255,255,0.22)",
        },
        // Accents
        cyan: {
          DEFAULT: "#3FE0FF",
          soft: "#8FF0FF",
          dim: "rgba(63,224,255,0.35)",
        },
        emerald: {
          DEFAULT: "#34F5A6",
          soft: "#8FFFCE",
          dim: "rgba(52,245,166,0.35)",
        },
        ink: {
          DEFAULT: "#F5F7FA",
          dim: "rgba(245,247,250,0.62)",
          faint: "rgba(245,247,250,0.34)",
        },
      },
      fontFamily: {
        display: ["System"],
      },
    },
  },
  plugins: [],
};
