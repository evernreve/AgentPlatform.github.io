import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // --- 新增或修改以下配置 ---
  base: '/Agent.github.io/', // 设置公共基础路径为你的仓库名
  build: {
    outDir: 'docs',          // 构建输出到 docs 目录
    emptyOutDir: true,       // 构建前清空目录
    rollupOptions: {
      output: {
        // 可选：保持文件名稳定，方便调试（可选）
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      }
    }
  }
  // --------------------------
})