/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Override or add custom colors
        primary: '#512888',    // Purple
        secondary: '#f97316',  // Orange
        background: '#8D029B', // plum
        card: '#ffffff',       // White
        danger: '#ED2839',     // Red
        hoverpurp:"#c18eff",    // Light purple
      },
    },
  },
  plugins: [],
};