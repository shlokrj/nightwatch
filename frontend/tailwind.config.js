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
          ember: "#e9a36b",
          crimson: "#d76673",
          violet: "#9272cf",
          pink: "#d58ac3",
          gold: "#efbd7c",
          pearl: "#f8f3e7",
          rose: "#d986a0",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        display: ["Cinzel Decorative", "Orbitron", "serif"],
        future: ["Orbitron", "Space Grotesk", "sans-serif"],
        elegant: ["Cormorant Garamond", "Georgia", "serif"],
      },
      boxShadow: {
        observatory: "0 26px 90px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        aurora: "0 0 28px rgba(215, 102, 115, 0.18), 0 0 64px rgba(146, 114, 207, 0.14)",
      },
    },
  },
  plugins: [],
};
