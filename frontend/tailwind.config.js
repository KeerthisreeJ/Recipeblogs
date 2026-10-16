/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDF2F3',
          100: '#FDE8E9',
          200: '#FBD2D5',
          300: '#F7A7AD',
          400: '#EF6E78',
          500: '#DC2626',
          600: '#B91C1C',
          700: '#9B1B1B', // Crimson
          800: '#8B0000', // Deep Red (Primary)
          900: '#640404',
          950: '#380202',
        },
        blush: {
          50: '#FFF5F6',
          100: '#FFEBEF',
          200: '#FFDCE3',
          300: '#FFC2CD',
          400: '#FF94A8',
        },
        cream: {
          50: '#FCFAF7',
          100: '#F8F4EE',
          200: '#F1E9DE',
          300: '#E6D7C5',
          400: '#D5BEA5',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(139, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 10px 30px -4px rgba(139, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'hover': '0 20px 40px -6px rgba(139, 0, 0, 0.14), 0 8px 16px -4px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
