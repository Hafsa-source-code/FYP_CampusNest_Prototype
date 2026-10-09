import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// Vite = the tool that runs our app while we develop and builds it for release.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Lets us write '@/components/...' instead of '../../../components/...'
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})