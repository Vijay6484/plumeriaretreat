/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#1E40AF',
        'primary-dark': '#1E3A8A',
        'secondary': '#0891B2',
        'accent': '#F59E0B',
        'neutral-light': '#F8FAFC',
        'neutral-dark': '#0F172A',
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
        'brunswick-green': '#1E40AF',
        'rose-taupe': '#0891B2',
        'mardi-gras': '#F59E0B',
        'baby-powder': '#F8FAFC',
        'black': '#0F172A',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(135deg, rgba(30, 64, 175, 0.85), rgba(8, 145, 178, 0.75)), url('https://images.pexels.com/photos/2666598/pexels-photo-2666598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        'texture-wood': "url('https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
      },
    },
  },
  plugins: [],
};
