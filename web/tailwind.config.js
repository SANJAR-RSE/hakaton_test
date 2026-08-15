/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefcf7",
          100: "#d6f7ea",
          200: "#adeed6",
          300: "#7ce0c0",
          400: "#45cba5",
          500: "#1fb08c",
          600: "#128f72",
          700: "#11725d",
          800: "#125b4c",
          900: "#114b40",
        },
      },
      boxShadow: {
        soft: "0 2px 10px 0 rgba(17, 75, 64, 0.06), 0 1px 2px 0 rgba(17, 75, 64, 0.04)",
        card: "0 4px 20px -2px rgba(17, 75, 64, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
