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
        whiteSmoke: "#F5F5F5",
        pearl: "#FCF5EF",
        pumpkin: "#FEA735",
        orange: "#FE7235",
        robinBlue: "#00C3FF",
        deepBlue: "#0077FF",
        lightBlue: "#DDE4ED",
        coolGray: "#CCDBE9",
        softBlue: "#B4C9DD",
        warmBeige: "#EDE1DB",
        softLime: "#F1FFC4",
        darkGrey: "#595959",
        smokeyGrey: "#726E6D",
      },
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"], // Clean, modern sans-serif
      serif: ["Merriweather", "serif"], // Great for readability in long texts
      display: ["Poppins", "sans-serif"], // Good for headings, modern and versatile
      mono: ["Fira Code", "monospace"], // Perfect for coding or monospaced content
      handwriting: ["Dancing Script", "cursive"], // Fun and fluid cursive style
    },
  },
  plugins: [],
};
