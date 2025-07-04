/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}', './node_modules/@shadcn/ui/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        accent: '#10b981',
      },
    },
  },
  plugins: [],
};
