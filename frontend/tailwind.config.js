/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Override or add custom colors
        primary: '#512888',    // Custom indigo for heading/buttons
        secondary: '#f97316',  // Orange for accents
        background: '#8D029B', // Light gray for page background
        card: '#ffffff',       // White for cards
        danger: '#ED2839',     // Red for logout button
      },
    },
  },
  plugins: [],
};