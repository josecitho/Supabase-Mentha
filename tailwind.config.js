/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mentha: {
          50: '#F0F9F1',
          100: '#DCF2DE',
          200: '#BBE5C0',
          300: '#8DD297',
          400: '#83AC40',
          500: '#6B9532',
          600: '#1A6D31',
          700: '#155A28',
          800: '#124A22',
          900: '#0F3E1D',
        },
        accent: {
          50: '#F7FBF3',
          100: '#EDF6E3',
          200: '#DDECC9',
          300: '#C4DDA4',
          400: '#A8CC7A',
          500: '#83AC40',
          600: '#6B8F33',
          700: '#54722A',
          800: '#455C24',
          900: '#3A4D21',
        },
        cream: {
          50: '#FEF7ED',
          100: '#FDF4E6',
          200: '#FCE6CC',
          300: '#F8D6A3',
          400: '#F3C178',
          500: '#EEAD54',
          600: '#E2923B',
          700: '#C67A2F',
          800: '#A6652A',
          900: '#8A5426',
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};