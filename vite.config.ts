import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./client",
  publicDir: "../public",
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "../dist",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
    },
  },
});
