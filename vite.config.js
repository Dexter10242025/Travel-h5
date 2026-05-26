import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/Travel-h5/", // 部署到Travel-h5域名时填
  build: { outDir: "dist" },
});
