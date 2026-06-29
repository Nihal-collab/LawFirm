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
          light: '#EFE8DD',
          DEFAULT: '#171717',
          dark: '#171717',
          accent: '#1C1B1A',
        },
        gold: {
          light: '#EFE8DD',
          DEFAULT: '#8B6B57',
          dark: '#7A5E4C',
          shimmer: '#8B6B57',
        },
        slate: {
          light: '#F8F5F0',
          DEFAULT: '#6D6258',
          dark: '#171717',
        },
        primary: '#F8F5F0',
        secondary: '#EFE8DD',
        accent: '#8B6B57',
        borderElegant: '#DDD5C8',
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
