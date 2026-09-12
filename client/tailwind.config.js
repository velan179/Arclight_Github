/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFC',
        surface: '#FFFFFF',
        'surface-subtle': '#F4F4F8',
        'surface-muted': '#EDEBF5',
        primary: {
          50: '#FBF8FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#8B5CF6',
          600: '#7C3AED', // Odoo purple primary accent
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          DEFAULT: '#7C3AED'
        },
        secondary: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          DEFAULT: '#A855F7'
        },
        dark: {
          DEFAULT: '#0F172A',
          secondary: '#334155',
          muted: '#64748B'
        },
        border: '#E2E8F0',
        'border-subtle': '#EEF2F6'
      },
      borderRadius: {
        'card': '16px',
        'card-sm': '14px',
        'card-lg': '18px'
      },
      boxShadow: {
        'apple': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'apple-hover': '0 8px 30px -4px rgba(124, 58, 237, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)'
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
