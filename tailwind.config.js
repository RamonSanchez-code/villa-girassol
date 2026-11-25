/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FBF7EE', 100: '#F6EFDF', 200: '#EFE4CB' },
        sun: { 300: '#E9CF95', 400: '#D9B46E', 500: '#C49A4F', 600: '#87642C' },
        leaf: { 600: '#6B5440', 700: '#3E3126', 800: '#2B221B', 900: '#1B1511' },
        ink: { DEFAULT: '#2A2620', soft: '#5E574C', mute: '#8A8274' },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(42,38,32,.18)',
        lift: '0 24px 48px -20px rgba(42,38,32,.28)',
      },
      keyframes: {
        rise: { from: { opacity: 0, transform: 'translateY(18px)' }, to: { opacity: 1, transform: 'none' } },
        fade: { from: { opacity: 0 }, to: { opacity: 1 } },
        pop: { from: { opacity: 0, transform: 'scale(.96)' }, to: { opacity: 1, transform: 'none' } },
        spin_slow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        rise: 'rise .8s cubic-bezier(.2,.7,.2,1) both',
        fade: 'fade .5s ease both',
        pop: 'pop .35s cubic-bezier(.2,.7,.2,1) both',
        'spin-slow': 'spin_slow 40s linear infinite',
      },
    },
  },
  plugins: [],
}
