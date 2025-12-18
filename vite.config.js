import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import process from 'node:process'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/auth': {
        target: 'https://auth.minecraft-wildhunt.com',
        changeOrigin: true,
        secure: process.env.VITE_APP_ENV === 'prod',
        rewrite: (path) => path.replace(/^\/auth/, '/api/v1/auth'),      
      },
    },
  },
})
