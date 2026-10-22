import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    lib: {
      entry: "./index.tsx",
      name: "RechartsLookerFunnel",
      fileName: () => "bundle.js",
      formats: ["iife"], // Garante execução direta no browser sem imports externos
    },
    outDir: "dist",
  },
});
