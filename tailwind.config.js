/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#e2e2e2',
        secondary: '#ff3131',
        background: '#f5b300',
      },
      fontFamily: {
        gagalin: ['Gagalin', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
