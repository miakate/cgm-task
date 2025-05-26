/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      fontFamily: {},
      colors: {
        dark: '#151517',
        primary: '#1C1C1E',
        secondary: '#1b5c13',
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
