export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        darkBg: '#0B0B0C',
        crimson: '#DC2626',
      },
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    animation: {
        'border-beam': 'border-beam 3s linear infinite',
      },
      keyframes: {
        'border-beam': {
          '100%': { offsetDistance: '100%' },
        },
      },
    },
  },
  plugins: [],
}