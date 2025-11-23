// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",      // 👈 listen on all network interfaces
    port: 5173,           // (optional but explicit)
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});