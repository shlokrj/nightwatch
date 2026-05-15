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
          ember: "#ff9a3c",
          crimson: "#ff3f63",
          violet: "#8f55ff",
          pink: "#ff7adf",
          gold: "#ffb45f",
          pearl: "#f8f3e7",
          rose: "#ff7aa8",
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
        aurora: "0 0 34px rgba(255, 63, 99, 0.26), 0 0 78px rgba(143, 85, 255, 0.2)",
      },
    },
  },
  plugins: [],
};
