/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
   extend: {
  colors: {
    olive: {
      50: "#f8f9f4",
      100: "#e9ebd9",
      200: "#d2d6b3",
      300: "#b5bb8a",
      400: "#98a165",
      500: "#7a8541",
      600: "#606b32",
      700: "#495227",
      800: "#343b1c",
      900: "#1c1f0f",
    },
  },
}

  },
  plugins: [],
}

