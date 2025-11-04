/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta principal de la app
        primary: {
          light: "#257D6F",
          DEFAULT: "#2F9685",
          dark: "#3BB6A2",
        },
        neutral: {
          DEFAULT: "#F7F6F2",
          dark: "#E3E2DD",
        },

        secondary: {
          light: "#003844",
          DEFAULT: "#003844",
          dark: "#002F39",
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
