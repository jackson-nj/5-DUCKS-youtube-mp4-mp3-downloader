// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173,
    },
  },
});
