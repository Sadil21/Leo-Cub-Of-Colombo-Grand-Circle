import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/Leo-Cub-Of-Colombo-Grand-Circle/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
