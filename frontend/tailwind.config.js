/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#07111F', // Primary BG
          900: '#0B1728', // Secondary BG
          800: '#101F33', // Card BG
          700: '#182E4B', // Card Border / Hover
          600: '#234168',
        },
        sentinel: {
          blue: '#2563EB',
          brightBlue: '#3B82F6',
          green: '#22C55E',
          amber: '#F59E0B',
          red: '#EF4444',
          slate: '#94A3B8',
          light: '#F8FAFC',
        }
      },
    },
  },
  plugins: [],
}
