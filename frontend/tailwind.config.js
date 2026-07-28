/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1440px',
      '2xl': '1600px',
    },
    extend: {
      colors: {
        navy: {
          light: '#F8FAFC',
          DEFAULT: '#08204A',
          dark: '#0B132B',
          accent: '#05070C',
        },
        gold: {
          light: '#D6E2F0',
          DEFAULT: '#0A4DFF',
          dark: '#0057D9',
          shimmer: '#0A4DFF',
        },
        slate: {
          light: '#FFFFFF',
          DEFAULT: '#A7B2C3',
          dark: '#000000',
        },
        primary: '#0A4DFF',
        secondary: '#0057D9',
        accent: '#0A4DFF',
        borderElegant: 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        serif: ['"ITC Avant Garde Gothic"', '"Futura PT"', '"Century Gothic"', '"Avant Garde"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': 'clamp(0.7rem, 1.5vw, 0.75rem)',
        'sm': 'clamp(0.8rem, 1.8vw, 0.875rem)',
        'base': 'clamp(0.9rem, 2vw, 1rem)',
        'lg': 'clamp(1.05rem, 2.2vw, 1.125rem)',
        'xl': 'clamp(1.15rem, 2.5vw, 1.25rem)',
        '2xl': 'clamp(1.35rem, 3vw, 1.5rem)',
        '3xl': 'clamp(1.6rem, 3.5vw, 1.875rem)',
        '4xl': 'clamp(1.9rem, 4vw, 2.25rem)',
        '5xl': 'clamp(2.2rem, 5vw, 3rem)',
        '6xl': 'clamp(2.7rem, 6vw, 3.75rem)',
        '7xl': 'clamp(3.3rem, 7vw, 4.5rem)',
      },
      boxShadow: {
        'premium': '0 20px 50px rgba(0, 0, 0, 0.35)',
        'glow-blue': '0 20px 50px rgba(10, 77, 255, 0.25)',
        'glow-hover': '0 25px 70px rgba(10, 77, 255, 0.30)',
        'btn-glow': '0 12px 35px rgba(10, 77, 255, 0.40)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
