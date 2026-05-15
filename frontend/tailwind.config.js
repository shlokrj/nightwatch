/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          950: "#02030a",
          900: "#060912",
          800: "#0d1522",
          700: "#1c2936",
          600: "#2e4452",
        },
        stellar: {
          gold: "#f5d98b",
          pearl: "#f8f3e7",
          teal: "#77e2dd",
          rose: "#d99bb7",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        display: ["Bruno Ace SC", "Space Grotesk", "sans-serif"],
        elegant: ["Cormorant Garamond", "Georgia", "serif"],
      },
      boxShadow: {
        observatory: "0 26px 90px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        aurora: "0 0 34px rgba(119, 226, 221, 0.25), 0 0 70px rgba(245, 217, 139, 0.12)",
      },
    },
  },
  plugins: [],
};
