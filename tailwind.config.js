/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['IBM Plex Mono', 'monospace'],
        'goblin': ['Goblin One', 'cursive'],
        'spartan': ['League Spartan', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
