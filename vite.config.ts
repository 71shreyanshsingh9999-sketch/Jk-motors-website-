// vite.config.js example configuration
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Jk-motors-website/',
  // Ensures relative asset paths for GitHub Pages
})
