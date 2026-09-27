/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F4EF",
        ink: "#16211B",
        marigold: "#FFB100",
        route: "#0F6E5D",
        alert: "#C1443B",
        slate: {
          25: "#FBFAF7",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "lane-dash":
          "repeating-linear-gradient(90deg, #16211B 0, #16211B 18px, transparent 18px, transparent 34px)",
      },
    },
  },
  plugins: [],
};
