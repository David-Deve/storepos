/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF', // Dark blue
        secondary: '#C4C4C4', // Purple
        hightlight: '#F8B602', // Yellow
        linear: '#EB5757', // Gray
        iconinactive: '#A098AE',
        iconactive: '#FFFFFF',
      },
    },
  },
  plugins: [],
}
