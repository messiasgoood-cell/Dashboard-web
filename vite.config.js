import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://discord-bot-complete-x7rj.replit.dev',
        changeOrigin: true,
      }
    }
  },
  preview: {
    port: 5000,
    host: '0.0.0.0'
  }
})
