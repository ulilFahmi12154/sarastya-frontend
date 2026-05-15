import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const FALLBACK_API_URL = "https://sarastya-backend-production.up.railway.app";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBaseUrl = env.VITE_API_BASE_URL || FALLBACK_API_URL;

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
