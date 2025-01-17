import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/users": {
        target: "http://localhost:5000", // Backend server
        changeOrigin: true, // Adjust the origin of the host header to the target URL
        rewrite: (path) => path.replace(/^\/users/, "/users"), // Optional: Adjust path if needed
      },
    },
  },
});
