import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default {
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './plugins/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Dynamic theme colors — driven by CSS custom properties set per event
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        'theme-bg': 'var(--color-bg)',
        'theme-text': 'var(--color-text)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '50%': { transform: 'translateY(-40px) scale(1.15)', opacity: '0.9' },
          '100%': { transform: 'translateY(-120px) scale(0.3)', opacity: '0' },
        },
        'wallet-bounce': {
          '0%, 100%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.25) rotate(-5deg)' },
          '60%': { transform: 'scale(1.1) rotate(3deg)' },
        },
        'float-up': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-60px)' },
        },
        'confetti-pop': {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '80%': { transform: 'scale(1.4)', opacity: '0.8' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'count-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px 2px var(--color-primary)' },
          '50%': { boxShadow: '0 0 24px 8px var(--color-secondary)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.5s ease-in forwards',
        'wallet-bounce': 'wallet-bounce 0.5s ease-out',
        'float-up': 'float-up 0.8s ease-out forwards',
        'confetti-pop': 'confetti-pop 0.6s ease-out forwards',
        'count-up': 'count-up 0.3s ease-out',
        'glow-pulse': 'glow-pulse 1.5s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [animate],
} satisfies Config
