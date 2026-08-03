import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
  ],
  server: {
    host: true,
    port: 3001,
    proxy: {
      "/api": {
        target: process.env.BACKEND_URL || "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
