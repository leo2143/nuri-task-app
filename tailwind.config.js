/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal de la app
        primary: {
          light: '#75BDC9',    // Azul claro - Tranquilidad y claridad
          DEFAULT: '#2F9685',  // Verde azulado - Equilibrio y constancia
          dark: '#37241C',     // Marrón oscuro - Contraste y estabilidad
        },
        neutral: {
          light: '#F7F6F2',    // Beige claro - Base neutra
          DEFAULT: '#EDCBB1',  // Melocotón - Calidez y empatía
          dark: '#3A251D',     // Marrón muy oscuro - Profundidad
        },
        // Aliases semánticos
        tranquility: '#75BDC9',
        balance: '#2F9685',
        base: '#F7F6F2',
        warmth: '#EDCBB1',
        contrast: '#37241C',
        depth: '#3A251D',
      },
      fontFamily: {
        // Montserrat Alternates para títulos
        heading: ['"Montserrat Alternates"', 'sans-serif'],
        // PT Sans para texto general
        body: ['"PT Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

