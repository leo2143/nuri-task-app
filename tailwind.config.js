/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta principal de la app
        primary: {
          light: "#3BB6A2",
          DEFAULT: "#2F9685",
          dark: "#257D6F",
        },
        neutral: {
          DEFAULT: "#F7F6F2",
          dark: "#E3E2DD",
        },

        secondary: {
          light: "#8CDFED",
          DEFAULT: "#75BDC9",
          dark: "#599DA8",
        },
        tertiary: {
          light: "#624033",
          DEFAULT: "#3A251D",
          dark: "#311F18",
        },
      },
      fontFamily: {
        // títulos
        heading: ['"Montserrat Alternates"', "sans-serif"],
        //  texto general
        body: ['"Nunito Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
