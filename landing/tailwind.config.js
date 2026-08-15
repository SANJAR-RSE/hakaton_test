/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefcf8',
          100: '#d6f7ee',
          200: '#adefdd',
          300: '#7be1c9',
          400: '#45c9ac',
          500: '#22a893',
          600: '#178878',
          700: '#166d63',
          800: '#165750',
          900: '#154843',
          950: '#062a28',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(15, 61, 55, 0.15)',
        card: '0 4px 20px -4px rgba(15, 61, 55, 0.10)',
      },
    },
  },
  plugins: [],
}
