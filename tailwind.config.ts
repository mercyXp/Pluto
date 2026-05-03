import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/screens/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        pluto: {
          blue: "#0A84FF",
          blueDark: "#055AC7",
          ice: "#EAF5FF",
          mist: "#F7FBFF",
          navy: "#071A33",
          slate: "#5A6B82",
          line: "#DDEBFA"
        }
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem"
      },
      boxShadow: {
        pluto: "0 24px 70px rgba(10, 132, 255, 0.13)",
        sheet: "0 -12px 44px rgba(7, 26, 51, 0.12)"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "ui-sans-serif", "system-ui"]
      },
      keyframes: {
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        breathe: {
          "0%, 100%": { transform: "scale(0.985)", opacity: "0.82" },
          "50%": { transform: "scale(1.035)", opacity: "1" }
        },
        ring: {
          "0%": { transform: "scale(0.72)", opacity: "0.42" },
          "100%": { transform: "scale(1.55)", opacity: "0" }
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        }
      },
      animation: {
        orbit: "orbit 8s linear infinite",
        breathe: "breathe 3.2s ease-in-out infinite",
        ring: "ring 1.8s ease-out infinite",
        shimmer: "shimmer 1.6s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
