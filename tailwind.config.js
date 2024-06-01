/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { // blue
          DEFAULT: "#0072B2",
          light: "#0072B2",
        },
        secondary: { // vermillion
          DEFAULT: "#D55E00",
          light: "#D55E00",
        },
        tertiary: { // pale violet
          DEFAULT: "#CC79A7",
          light: "#CC79A7",
        },
        accent: { // yellow
          DEFAULT: "#F9C04A",
          light: "#F9C04A",
        },
        dark: {
          DEFAULT: "#171717",
          MID: '#343434',
          LOW: '#646464'
        },
        light: {
          DEFAULT: "#F9F9F9",
          MID: "#E8E8E8",
          LOW: "FFFFFF"
        },
      },
      fontFamily: {
      },
    },
  },
  plugins: [],
};