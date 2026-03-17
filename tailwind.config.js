/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          pink: {
            50: '#FFF9FB',
            100: '#FFF1F6',
            200: '#FFE1ED',
            300: '#FFA6D5',
            400: '#FF87C3',
            500: '#feaba3', // Primary base
            600: '#f8948d', // Softer hover
            700: '#D4367D',
            800: '#A62E6B',
            900: '#7A2250',
            dark: '#4a112c',
          },
          cream: {
            50: '#FDFBFA',
            100: '#FCF8F4',
            200: '#F9F1E8',
            300: '#F4E3D0',
            400: '#EDCEA9',
            500: '#fbe7b4', // Base cream
            600: '#f5d68d',
            700: '#e1a661',
            800: '#c27e3d',
            900: '#8c5024',
          }
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-in-down': 'fade-in-down 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(254, 171, 163, 0.15)',
        'premium-hover': '0 20px 40px -10px rgba(254, 171, 163, 0.25)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-fade': 'linear-gradient(180deg, var(--tw-gradient-stops))',
        'premium-gradient': 'linear-gradient(135deg, #fbe7b4 0%, #feaba3 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
} 