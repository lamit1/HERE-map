/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/components/*.{html,js,jsx}", "./src/layout/*.{html,js,jsx}", "./src/components/**/*.{html,js,jsx}"],
  theme: {
    colors: {
      'text':"#1d2828",
      'primary': '#4b81f4',
      'bg': '#f4f4f4',
      'green':"#00dd2c",
      "red":"#e52228",
      'yellow':"#ffd028",
      'scaffold': '#a0a0a0',
      'success': '#4edd49',
      'error': '#f93920',
    },
    extend: {},
  },
  plugins: [],
}

