import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/", // 部署到根域名时填 '/'
  build: { outDir: "dist" },
});
