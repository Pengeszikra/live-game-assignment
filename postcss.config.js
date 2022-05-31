const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const nesting = require('@tailwindcss/nesting');
module.exports = {
  plugins: [
    nesting,
    tailwindcss('./tailwind.config.js'),
    autoprefixer,
  ]
}