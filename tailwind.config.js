/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coralRed: "#FF968A",
        softPeach: "#FFAEA5",
        pastelPink: "#FFC5BF",
        lightBeige: "#FFD8BE",
        warmOrange: "#FFC8A2",
      },
    },
  },
  plugins: [],
};
