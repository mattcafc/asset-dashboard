/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        status: {
          green: '#22c55e',
          amber: '#f59e0b',
          red: '#ef4444',
          grey: '#9ca3af',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.06), 0 6px 16px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
}

