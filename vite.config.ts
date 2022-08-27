import path from 'node:path' 
import { defineConfig } from 'vite'
import ssl from '@vitejs/plugin-basic-ssl'
import wasm from 'vite-plugin-wasm'

export default defineConfig({
  server: {
    port: 5174,
    strictPort: true,
    // https: true,
    fs: {
      strict: true,
      allow: ['.'],
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  envPrefix: ['THREE', 'SWORD'],
  plugins: [
    // ssl(),
    wasm(),
  ],
})
