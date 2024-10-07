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
        lightGray: "#D3D3D3",
        whiteSmoke: "#F5F5F5",
        softLime: "#F1FFC4",
        smokeyGrey: "#726E6D",
        pastelCoral: "#FD8A8A",
        pastelPeach: "#FFCBCB",
        pastelPurple: "#9EA1D4",
        pastelLime: "#F6F9D7",
        pastelTeal: "#A8D1D1",
        pastelBlue: "#DFEBEB",
        blueblue: "#0000FF",
        gold: "#D4AF37",
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
