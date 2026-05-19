/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts'
  },
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/')

          if (normalizedId.includes('/src/data/flashcards/')) {
            return 'flashcards'
          }

          if (normalizedId.includes('/src/data/') && normalizedId.endsWith('.json')) {
            return 'study-data'
          }

          if (
            normalizedId.includes('/node_modules/katex/') ||
            normalizedId.includes('/node_modules/react-markdown/') ||
            normalizedId.includes('/node_modules/remark-') ||
            normalizedId.includes('/node_modules/rehype-') ||
            normalizedId.includes('/node_modules/micromark') ||
            normalizedId.includes('/node_modules/mdast-util') ||
            normalizedId.includes('/node_modules/hast-util') ||
            normalizedId.includes('/node_modules/unified/') ||
            normalizedId.includes('/node_modules/unist-util') ||
            normalizedId.includes('/node_modules/vfile')
          ) {
            return 'markdown-vendor'
          }

          if (
            normalizedId.includes('/node_modules/lucide-react/') ||
            normalizedId.includes('/node_modules/lucide/')
          ) {
            return 'icons'
          }

          if (
            normalizedId.includes('/node_modules/react/') ||
            normalizedId.includes('/node_modules/react-dom/') ||
            normalizedId.includes('/node_modules/react-router') ||
            normalizedId.includes('/node_modules/scheduler/')
          ) {
            return 'react-vendor'
          }

          return undefined
        }
      }
    }
  },
})
