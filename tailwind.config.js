/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
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
        brand: "#75BDC9",
        gray: {
          100: "#F1F3F2", // Paneles y Tarjetas sutiles
          300: "#D9E0DE", // Bordes y Dividers
          500: "#9AA4A2", // Iconos inactivos / placeholders
          700: "#5B6462", // Texto secundario / Labels
          900: "#2E3432", // Títulos / Headers / Texto principal
        },
        greenCheap: {
          light: "#BEE6DB",
          dark: "#1D5E52",
        },
        yellowCheap: "#F2C879",
        blueCheap: {
          light: "#DBEAFE",
          dark: "#1e40af",
        },
      },
      boxShadow: {
        "brand-glow": "0 0 5px 0 #75BDC9",
        "brand-achievement": "0 4px 15px 0 #75BDC9",
      },
      fontFamily: {
        // títulos
        heading: ['"Montserrat Alternates"', "sans-serif"],
        //  texto general
        body: ['"Nunito Sans"', "sans-serif"],
      },
      padding: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      margin: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
    },
  },
  plugins: [],
};
