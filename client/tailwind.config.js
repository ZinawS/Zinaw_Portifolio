/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all JS/TS files in src
    "./public/index.html", // Include HTML file
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [{ pattern: /./ }],  // ← Keep all classes (remove later!)
};
