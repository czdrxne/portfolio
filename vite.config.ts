import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), tailwindcss()],

  server: {
    port: 5000,
    strictPort: true,
  },

  define: {
    __APP_ENV__: JSON.stringify(process.env.NODE_ENV || "development"),
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/lib/components"),
      "@routes": path.resolve(__dirname, "./src/lib/routes"),
      "@utilities": path.resolve(__dirname, "./src/lib/utilities"),
    },
  },

  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: process.env.NODE_ENV !== "production",
    minify: "esbuild",
    target: "esnext",
    chunkSizeWarningLimit: 1000,

    esbuild: {
      drop:
        process.env.NODE_ENV === "production"
          ? ["console", "debugger"]
          : [],
    },
  },
});