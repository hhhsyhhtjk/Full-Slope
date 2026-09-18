import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
// import path from 'path'
// import cesium from 'vite-plugin-cesium'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/Full-Slope/' : '/',
  server: {
    host: '0.0.0.0',
    port: 8080,
    open: false,
  },
  plugins: [
    vue(),
    // cesium(),
  ],
  resolve: {
    alias: {
      // '@': path.resolve(__dirname, './src'),
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/assets/styles/mixin" as mixin;'
      }
    }
  }
}))
