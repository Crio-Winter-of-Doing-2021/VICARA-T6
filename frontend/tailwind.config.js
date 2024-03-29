module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Poppins']
    },
    screens: {
      xs: { max: '480px' },
      sm: { max: '767px' },
      md: { max: '1023px' },
      lg: { max: '1280px' },
      xl: { max: '1536px' },
      '2xl': { max: '1780px' }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
