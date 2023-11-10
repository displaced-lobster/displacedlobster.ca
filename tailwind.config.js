/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./templates/shortcodes/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7f7ffe',
        secondary: '#31c2cb',
        accent: '#96a5f7',
      },
    },
  },
  plugins: [],
}
