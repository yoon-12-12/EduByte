import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/EduByte/",

  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "EduByte",
        short_name: "EduByte",

        description:
          "시험 학습 지원 플랫폼",

        theme_color: "#2563eb",

        background_color: "#ffffff",

        display: "standalone",

        start_url: "/EduByte/",

        icons: [
          {
            src: "icon-192-v2.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },

          {
            src: "icon-512-v2.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});