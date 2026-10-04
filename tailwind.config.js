/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Assistant", "system-ui", "sans-serif"],
      },
      // MP071 palette — the ONLY colors used across the page.
      colors: {
        night: "#13181B", // Neverything — page background (named 'night' to avoid the text-base font-size clash)
        ateneo: "#003A6C", // Ateneo Blue — deep secondary surfaces / badges
        cloud: "#F0EEEB", // Magical Moonlight — primary text / clean surface
        drift: "#CCD5DA", // Polar Drift — muted text / soft borders
        gold: "#FFBF65", // Sea Buckthorn — primary accent / CTA
        coral: "#FD8973", // Miami Coral — vibrant accent / urgent badges
      },
      boxShadow: {
        card: "0 24px 70px -36px rgba(0,0,0,0.85)",
        cta: "0 14px 34px -14px rgba(255,191,101,0.45)",
      },
    },
  },
  plugins: [],
};
