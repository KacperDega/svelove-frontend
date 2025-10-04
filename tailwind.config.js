/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        'swipe-left': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%) rotate(-15deg)', opacity: '0' },
        },
        'swipe-right': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%) rotate(15deg)', opacity: '0' },
        },
      },
      animation: {
        'swipe-left': 'swipe-left 0.5s ease-in-out forwards',
        'swipe-right': 'swipe-right 0.5s ease-in-out forwards',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dracula"],
  },
};
