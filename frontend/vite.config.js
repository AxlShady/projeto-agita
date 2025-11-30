import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
 
      "/api": {
      target: "http://https://projeto-agita.onrender.com",
     changeOrigin: true,
     },
   },
  }
});
