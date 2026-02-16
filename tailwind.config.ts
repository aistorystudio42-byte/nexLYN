import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bronze: {
          light: "#A67C52",
          DEFAULT: "#5C3D2E",
          dark: "#2A1B15",
          accent: "#D9A066",
        },
        ivory: "#E2D1C3",
        obsidian: "#0C0908",
        amber: {
          glow: "rgba(217, 160, 102, 0.08)",
        }
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        'fade-in': 'fadeIn 220ms ease-out',
        'lift': 'lift 180ms ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        lift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-2px)' },
        }
      },
      backgroundImage: {
        'vignette': 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%)',
      }
    },
  },
  plugins: [],
};
export default config;
