/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          50: '#EEEDFC',
          100: '#DCDAF9',
          400: '#7C74EE',
          500: '#4F46E5',
          600: '#4038C2',
          700: '#302A94',
        },
        accent: {
          DEFAULT: '#8B5CF6',
          400: '#A78BFA',
          600: '#7C3AED',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        canvas: {
          DEFAULT: '#0A0A0F',
          soft: '#0F0F16',
        },
        surface: {
          DEFAULT: '#131319',
          soft: '#181820',
          border: '#232330',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-mesh':
          'linear-gradient(rgba(79,70,229,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.06) 1px, transparent 1px)',
        'hero-glow':
          'radial-gradient(60% 100% at 20% 0%, rgba(79,70,229,0.35) 0%, rgba(10,10,15,0) 60%), radial-gradient(50% 80% at 90% 10%, rgba(139,92,246,0.25) 0%, rgba(10,10,15,0) 60%)',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -8px rgba(0,0,0,0.5)',
        glow: '0 0 0 1px rgba(79,70,229,0.4), 0 0 24px rgba(79,70,229,0.25)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.8' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        scan: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 200%' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        scan: 'scan 3s linear infinite',
        floaty: 'floaty 6s ease-in-out infinite',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
