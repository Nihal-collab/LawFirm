/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          light: '#F8FAFC',
          DEFAULT: '#000000',
          dark: '#000000',
          accent: '#0a0a0a',
        },
        gold: {
          light: '#E0F2FE',
          DEFAULT: '#4BB8E8',
          dark: '#38A9DD',
          shimmer: '#4BB8E8',
        },
        slate: {
          light: '#FFFFFF',
          DEFAULT: '#444444',
          dark: '#000000',
        },
        primary: '#FFFFFF',
        secondary: '#F8FAFC',
        accent: '#4BB8E8',
        borderElegant: '#E5E7EB',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'sans-serif'],
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
