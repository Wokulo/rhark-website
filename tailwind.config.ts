import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // ─── Breakpoints ────────────────────────────────────────────────────────
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },

    extend: {
      // ─── Color Palette ────────────────────────────────────────────────────
      colors: {
        // Primary — Deep Teal (trust, health, professionalism)
        primary: {
          50: "#f0fafa",
          100: "#ccefef",
          200: "#99dfdf",
          300: "#5ec9c9",
          400: "#2eadad",
          500: "#0D6E6E", // brand primary
          600: "#0a5858",
          700: "#084444",
          800: "#053030",
          900: "#031e1e",
          950: "#010f0f",
        },
        // Accent — Warm Amber (CTAs, donations, urgency)
        accent: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#F59E0B", // brand accent
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        // Secondary — Soft Coral (warmth, human connection)
        secondary: {
          50: "#fdf3f1",
          100: "#fbe4df",
          200: "#f7c9c1",
          300: "#f1a496",
          400: "#E8705A", // brand secondary
          500: "#d95540",
          600: "#c03d2a",
          700: "#9e3022",
          800: "#832a1e",
          900: "#6d271e",
          950: "#3b110c",
        },
        // Semantic
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          400: "#4ade80",
          500: "#16A34A",
          600: "#15803d",
          700: "#166534",
          800: "#14532d",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#D97706",
          600: "#b45309",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          500: "#DC2626",
          600: "#b91c1c",
        },
        info: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          400: "#38bdf8",
          500: "#0284C7",
          600: "#0369a1",
          700: "#075985",
          800: "#0c4a6e",
        },
        // Neutral — Slate (cool undertone harmonizes with teal)
        neutral: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
      },

      // ─── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-montserrat)", "var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        // Fluid type scale — Major Third (1.25 ratio), clamp() for fluidity
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.025em" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.01em" }],
        base: ["1rem", { lineHeight: "1.625rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.01em" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.015em" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.02em" }],
        "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        "6xl": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "7xl": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.035em" }],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },

      // ─── Spacing Scale (base-4 system) ────────────────────────────────────
      spacing: {
        // Semantic aliases on top of Tailwind's default scale
        "4.5": "1.125rem",
        "13": "3.25rem",
        "15": "3.75rem",
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "section": "6rem",       // standard section padding
        "section-sm": "4rem",    // compact section padding
      },

      // ─── Border Radius ────────────────────────────────────────────────────
      borderRadius: {
        none: "0",
        sm: "0.25rem",
        DEFAULT: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px",
      },

      // ─── Box Shadow ───────────────────────────────────────────────────────
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        DEFAULT: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        // Teal-tinted shadow for primary elements
        teal: "0 10px 30px -5px rgb(13 110 110 / 0.3)",
        "teal-sm": "0 4px 14px -2px rgb(13 110 110 / 0.2)",
        // Amber-tinted shadow for accent elements
        amber: "0 10px 30px -5px rgb(245 158 11 / 0.35)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        none: "none",
      },

      // ─── Animation & Transitions ──────────────────────────────────────────
      transitionDuration: {
        "75": "75ms",
        "100": "100ms",
        "150": "150ms",   // micro-interactions
        "250": "250ms",   // component transitions
        "300": "300ms",   // page transitions
        "500": "500ms",
        "700": "700ms",
        "1000": "1000ms",
        "1200": "1200ms", // counter animations
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        linear: "linear",
        in: "cubic-bezier(0.4, 0, 1, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
        // Custom natural easing
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down": {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 300ms ease-out",
        "fade-up": "fade-up 400ms ease-out",
        "fade-down": "fade-down 300ms ease-out",
        "slide-in-left": "slide-in-left 350ms ease-out",
        "scale-in": "scale-in 200ms ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },

      // ─── Z-Index Scale ────────────────────────────────────────────────────
      zIndex: {
        "0": "0",
        "10": "10",
        "20": "20",
        "30": "30",
        "40": "40",
        "50": "50",
        "dropdown": "100",
        "sticky": "200",
        "overlay": "300",
        "modal": "400",
        "toast": "500",
        "tooltip": "600",
      },

      // ─── Container ────────────────────────────────────────────────────────
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
        "prose-lg": "72ch",
      },
    },
  },
  plugins: [],
};

export default config;
