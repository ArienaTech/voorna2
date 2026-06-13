import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#121212",
          soft: "#6E6A60",
          faint: "#9B968A",
        },
        paper: {
          DEFAULT: "#FBF9F4",
          shade: "#F2EFE7",
          mute: "#ECE8DC",
        },
        gold: {
          DEFAULT: "#C9A24B",
          deep: "#9C7A2E",
          bright: "#D4AF37",
          wash: "#F8F1DF",
        },
        line: {
          subtle: "#EEEAE0",
          DEFAULT: "#E4DFD3",
          strong: "#D3CDBD",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        hero: ["var(--font-hero)", "Playfair Display", "Georgia", "serif"],
        mono: ["var(--font-mono)", "Space Mono", "monospace"],
      },
      maxWidth: {
        wrap: "1180px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(18,18,18,0.06), 0 1px 2px rgba(18,18,18,0.04)",
        lift: "0 24px 50px -28px rgba(20,18,10,0.4)",
        ticket: "0 24px 60px -28px rgba(20,18,10,0.35)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%": { boxShadow: "0 0 0 0 rgba(201,162,75,0.55)" },
          "70%": { boxShadow: "0 0 0 8px rgba(201,162,75,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(201,162,75,0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 500ms cubic-bezier(0,0,0.2,1) both",
        "pulse-dot": "pulse-dot 2s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
