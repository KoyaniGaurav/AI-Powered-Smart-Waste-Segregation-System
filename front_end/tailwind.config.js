/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "rgb(var(--surface) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        brand: {
          DEFAULT: "#0f766e",
          bright: "#14b8a6",
          soft: "#99f6e4",
          moss: "#65a30d",
          amber: "#f59e0b",
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', "sans-serif"],
        body: ['"Manrope"', "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(15, 23, 42, 0.22)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(20, 184, 166, 0.16), transparent 36%), radial-gradient(circle at 85% 15%, rgba(101, 163, 13, 0.14), transparent 28%), linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0))",
      },
    },
  },
  plugins: [],
};
