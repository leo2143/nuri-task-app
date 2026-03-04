import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",
      includeAssets: [
        "favicon/favicon.ico",
        "favicon/apple-touch-icon.png",
        "favicon/favicon-16x16.png",
        "favicon/favicon-32x32.png",
      ],
      manifest: {
        name: "Nuri Task App - Gestión de Tareas",
        short_name: "Nuri Task",
        description:
          "Gestiona tus tareas de manera eficiente con Nuri Task App",
        theme_color: "#2F9685",
        background_color: "#F7F6F2",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "favicon/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "favicon/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "favicon/maskable_icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8888",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
