import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/", // root of the domain
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000 // optional, increases the limit for warnings
  }
});
