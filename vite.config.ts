import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import wasm from 'vite-plugin-wasm'
import define from './env'

export default defineConfig({
  build: {
    minify: true,
    target: 'esnext',
  },
  envPrefix: ['THREE', 'SWORD'],
  plugins: [
    mkcert(),
    wasm(),
  ],
  publicDir: 'assets',
  server: {
    fs: {
      strict: true,
      allow: ['.'],
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    https: true,
    port: 5173,
    strictPort: true,
  },
  define,
})
