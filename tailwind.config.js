/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0072B2", // blue
        secondary: "#d55e00", // vermillion
        tertiary: "#cc79a7", // pale violet
        white: {
          DEFAULT: "#FFFFFF",
        },
        black: {
          DEFAULT: "#000000",
        },
        gray: {
          DEFAULT: "#BCBCBC",
        },
      },
      fontFamily: {
      },
    },
  },
  plugins: [],
};