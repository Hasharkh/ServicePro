import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#0B0E14",
          light: "#0d1117",
        },
        surface: {
          DEFAULT: "#161B22",
          light: "#1C2230",
          border: "#21262d",
        },
        indigo: {
          DEFAULT: "#6366F1",
          hover: "#818CF8",
          muted: "#6366f120",
          ring: "#6366f140",
        },
        emerald: {
          DEFAULT: "#10B981",
          hover: "#34D399",
          muted: "#10b98120",
        },
        rose: {
          DEFAULT: "#F43F5E",
          muted: "#f43f5e20",
        },
        slate: {
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["Montserrat", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "glow-indigo": "radial-gradient(ellipse at center, #6366f115 0%, transparent 70%)",
        "glow-emerald": "radial-gradient(ellipse at center, #10b98115 0%, transparent 70%)",
        "grid-pattern":
          "linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.35s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(99,102,241,0.3)" },
          "50%": { boxShadow: "0 0 24px rgba(99,102,241,0.7)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glow-indigo": "0 0 30px rgba(99, 102, 241, 0.3)",
        "glow-emerald": "0 0 20px rgba(16, 185, 129, 0.3)",
        "card": "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
export default config;
