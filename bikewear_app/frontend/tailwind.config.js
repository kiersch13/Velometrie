/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary:      '#1E3932',
        accent:       '#E85D00',
        'bg-light':   '#F8F7F4',
        'bg-dark':    '#1F292E',
        'text-light': '#1C1C1E',
        'text-dark':  '#E4E2E0',
        success:      '#2A9D5F',
        warning:      '#F4A261',
        error:        '#E63946',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':       '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'card-hover': '0 4px 16px 0 rgb(0 0 0 / 0.10)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

