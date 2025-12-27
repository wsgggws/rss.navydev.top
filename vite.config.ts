import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import SetupExtend from "vite-plugin-vue-setup-extend";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    SetupExtend(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  build: {
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'element-plus': ['element-plus'],
        },
      },
    },
    // 使用 esbuild 压缩（默认，更快）
    minify: 'esbuild',
    // 提高chunk大小警告阈值
    chunkSizeWarningLimit: 1000,
  },
  server: {
    // 开发服务器预热常用文件
    warmup: {
      clientFiles: ['./src/views/*.vue', './src/router/index.ts'],
    },
  },
});
