/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Assistant", "system-ui", "sans-serif"],
      },
      // WhatsApp-inspired light palette — the ONLY colors used across the page.
      colors: {
        ink: "#111B21", // primary text (WhatsApp's own text color)
        muted: "#4A5568", // subtitles, micro-copy, footer
        line: "#D1D7DB", // card borders / dividers
        wa: {
          DEFAULT: "#25D366", // WhatsApp brand green - glow and small accents
          button: "#1DAA61", // CTA fill: WhatsApp's light-mode button green (white text passes 3:1)
          dark: "#128C7E", // CTA hover
          deep: "#008069", // eyebrows + headline accent (passes 4.5:1 on the light background)
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,27,33,0.06), 0 14px 34px -18px rgba(17,27,33,0.22)",
        wa: "0 18px 44px -12px rgba(37,211,102,0.75), 0 4px 12px -4px rgba(18,140,126,0.35)",
        "wa-hover": "0 22px 54px -12px rgba(37,211,102,0.85), 0 6px 16px -4px rgba(18,140,126,0.4)",
      },
    },
  },
  plugins: [],
};
