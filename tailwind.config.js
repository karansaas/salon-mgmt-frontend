/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: { colors: { brand: { 50: '#f2f7ff', 500: '#2563eb', 600: '#1d4ed8', 700: '#1d4ed8', 900: '#172554' } } } },
  plugins: [],
};
