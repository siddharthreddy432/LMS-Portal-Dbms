/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Bricolage Grotesque", "sans-serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        brand: {
          pink: '#FF1053',
          yellow: '#FFD166',
          orange: '#FF7B00',
          blue: '#00B4D8',
          green: '#06D6A0',
          purple: '#8338EC',
          coral: '#F08080',
          red: '#D90429',
        },
        dark: {
          bg: '#0F1115',
          secondary: '#15181D',
          card: '#1B1F26',
          elevated: '#222730',
          hover: '#292E38',
          input: '#171A20',
        }
      },
      animation: {
        blob: 'blob 7s infinite',
        shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        }
      }
    },
  },
  plugins: [],
}
